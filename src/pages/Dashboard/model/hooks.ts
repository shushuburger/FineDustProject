import { useState, useEffect } from 'react'
import { formatCurrentTime, getPM10Grade, getNearestStationAir } from '@/shared/api/dustApi'
import { registerServiceWorker, scheduleNotificationOnUnload, updateNotificationMission } from '@/shared/utils/notifications'
import type { DustData, LocationInfo } from '@/shared/types/api'
import type { TodoRealLifeAction } from '@/shared/types/todo'
import todoListData from '@/shared/assets/data/todoList.json'
import { getTodayDateString, getDustMood, getRandomMissions } from './utils'
import type { DustMood, UserProfileState, BehavioralGuide } from './types'
import behavioralGuidelines from '@/shared/assets/data/behavioral_guidelines.json'
import { getDustLevel } from './utils'
import { OBJECT_NAMES } from './constants'

export const useDashboardData = () => {
  const [dustData, setDustData] = useState<DustData | null>(null)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(formatCurrentTime())
  const [currentDate, setCurrentDate] = useState('')
  const [calendarDates, setCalendarDates] = useState<number[]>([])
  const [dustMood, setDustMood] = useState<DustMood | null>(null)
  const [randomMissions, setRandomMissions] = useState<TodoRealLifeAction[]>([])
  const [testPm10, setTestPm10] = useState<number | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfileState | null>(null)

  // 위치 정보 및 미세먼지 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // 최근접 측정소 기반 미세먼지 정보 가져오기
        const result = await getNearestStationAir()
        console.log('[Dust] Nearest station:', result.nearestStation)
        console.log('[Dust] Air snapshot for station:', result.air)
        console.log('[Dust] Current location:', result.location)
        const location = result.location
        const air = result.air
        // 스냅샷 포맷을 기존 DustData로 매핑
        const currentDustData = air
          ? { PM10: air.pm10 ?? undefined, 'PM2.5': air.pm25 ?? undefined }
          : null
        
        setDustData(currentDustData || null)
        setLocationInfo(location)
        setCurrentTime(formatCurrentTime())
        
        // 현재 날짜 설정
        const now = new Date()
        const year = now.getFullYear()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')
        const day = now.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}/${month}/${day}`
        setCurrentDate(formattedDate)
        
        // 캘린더 날짜 생성
        const lastDay = new Date(year, now.getMonth() + 1, 0)
        const lastDate = lastDay.getDate()
        
        // 현재 주의 날짜들 생성 (오늘을 포함한 주의 7일)
        const today = now.getDate()
        const thisWeekStart = today - now.getDay() // 이번 주 일요일의 날짜
        const dates: number[] = []
        for (let i = 0; i < 7; i++) {
          const date = thisWeekStart + i
          if (date >= 1 && date <= lastDate) {
            dates.push(date)
          } else {
            dates.push(0) // 빈 칸
          }
        }
        setCalendarDates(dates)
        
        // 오늘 날짜 확인 및 미션 설정 (하루 단위로 고정)
        const todayDate = getTodayDateString()
        const stored = localStorage.getItem('dailyMissions')
        
        if (stored) {
          try {
            const { date, missions } = JSON.parse(stored)
            if (date === todayDate) {
              // 같은 날이면 저장된 미션 사용
              setRandomMissions(missions)
            } else {
              // 다른 날이면 새로 선택 (프로필 반영)
              const newMissions = getRandomMissions(
                todoListData.realLifeActions,
                5,
                todayDate,
                userProfile?.profile
              )
              setRandomMissions(newMissions)
              localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions: newMissions }))
            }
          } catch {
            // 파싱 에러 시 새로 선택 (프로필 반영)
            const missions = getRandomMissions(
              todoListData.realLifeActions,
              5,
              todayDate,
              userProfile?.profile
            )
            setRandomMissions(missions)
            localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions }))
          }
        } else {
          // 첫 방문 시 (프로필 반영)
          const missions = getRandomMissions(
            todoListData.realLifeActions,
            5,
            todayDate,
            userProfile?.profile
          )
          setRandomMissions(missions)
          localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions }))
        }
        
        // 표정 상태 업데이트 (testPm10이 없을 때만)
        if (!testPm10 && currentDustData?.PM10 !== undefined) {
          const pm10Grade = getPM10Grade(currentDustData.PM10)
          const mood = getDustMood(pm10Grade)
          setDustMood(mood)
        }
        
      } catch (err) {
        console.error('데이터 로딩 실패:', err)
        setError(err instanceof Error ? err.message : '데이터를 불러올 수 없습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    
    // Service Worker 등록
    registerServiceWorker()
    
    // 페이지 언로드 감지 (브라우저 닫을 때만 실행)
    scheduleNotificationOnUnload(10000)
    
    // 1분마다 시간 업데이트
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime())
    }, 60000)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 테스트용 PM10 값이 변경될 때 dustMood 업데이트
  useEffect(() => {
    if (testPm10 !== null) {
      const pm10Grade = getPM10Grade(testPm10)
      const mood = getDustMood(pm10Grade)
      setDustMood(mood)
    } else if (dustData?.PM10 !== undefined) {
      // 실제값 복원 시 실제 데이터로 표정 재계산
      const pm10Grade = getPM10Grade(dustData.PM10)
      const mood = getDustMood(pm10Grade)
      setDustMood(mood)
    }
  }, [testPm10, dustData])

  // randomMissions가 로드되면 알림 설정 업데이트
  useEffect(() => {
    if (randomMissions.length > 0) {
      const randomMission = randomMissions[Math.floor(Math.random() * randomMissions.length)]
      // 미션 제목만 업데이트 (이벤트 리스너는 이미 등록됨)
      updateNotificationMission(randomMission.title)
    }
  }, [randomMissions])

  return {
    dustData,
    locationInfo,
    isLoading,
    error,
    currentTime,
    currentDate,
    calendarDates,
    dustMood,
    randomMissions,
    testPm10,
    userProfile,
    setDustData,
    setLocationInfo,
    setIsLoading,
    setError,
    setCurrentTime,
    setCurrentDate,
    setCalendarDates,
    setDustMood,
    setRandomMissions,
    setTestPm10,
    setUserProfile
  }
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileState | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // 사용자 프로필 정보 로딩
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        setUserProfile(profile)
      } catch (error) {
        console.error('프로필 정보 파싱 오류:', error)
      }
    } else {
      // 프로필이 없으면 모달 표시
      setShowProfileModal(true)
    }
  }, [])

  // 프로필 저장 감지 및 모달 닫기
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
          setUserProfile(profile)
          setShowProfileModal(false)
        } catch (error) {
          console.error('프로필 정보 파싱 오류:', error)
        }
      }
    }

    // 초기 로딩
    handleStorageChange()

    // storage 이벤트 리스너 추가 (다른 탭에서 변경 감지)
    window.addEventListener('storage', handleStorageChange)

    // 주기적으로 체크 (같은 탭에서 변경 감지)
    const interval = setInterval(handleStorageChange, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return {
    userProfile,
    showProfileModal,
    setUserProfile,
    setShowProfileModal
  }
}

export const useBehavioralGuides = (
  testPm10: number | null,
  dustData: DustData | null,
  userProfile: UserProfileState | null
) => {
  const getAllBehavioralGuides = (): BehavioralGuide[] => {
    const pm10Value = testPm10 ?? dustData?.PM10
    const dustLevel = getDustLevel(pm10Value)
    const profile = userProfile?.profile

    const guideKeys = Object.keys(behavioralGuidelines.guides) as Array<keyof typeof behavioralGuidelines.guides>
    const allGuides: BehavioralGuide[] = []

    guideKeys.forEach((key) => {
      const guide = behavioralGuidelines.guides[key]
      let content = [...guide.baseMessages[dustLevel]]
      const profileApplied: string[] = []
      let priority = 0

      // 조건부 메시지 추가 및 우선순위 계산
      if ('conditionalMessages' in guide && guide.conditionalMessages) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const conditionalMsgs = guide.conditionalMessages as any

        // 건강 상태 확인
        if (profile?.health && conditionalMsgs[`health_${profile.health}`]) {
          const healthMsg = conditionalMsgs[`health_${profile.health}`]
          if (healthMsg[dustLevel]) {
            content = [...content, ...healthMsg[dustLevel]]
            profileApplied.push('건강 상태')
            priority += 10
          }
        }

        // 반려견 확인
        if (profile?.pet === 'dog' && conditionalMsgs.pet_dog) {
          const petMsg = conditionalMsgs.pet_dog
          if (petMsg[dustLevel]) {
            content = [...content, ...petMsg[dustLevel]]
            profileApplied.push('반려동물')
            priority += 10
          }
        }

        // 연령대 확인
        if (profile?.ageGroup) {
          const ageKey = profile.ageGroup === 'senior' ? 'age_elderly' : `age_${profile.ageGroup}`
          if (conditionalMsgs[ageKey]) {
            const ageMsg = conditionalMsgs[ageKey]
            if (ageMsg[dustLevel]) {
              content = [...content, ...ageMsg[dustLevel]]
              profileApplied.push('연령대')
              priority += 7
            }
          }
        }

        // 아이 확인
        if (profile?.child && profile.child !== 'none' && conditionalMsgs.child) {
          const childMsg = conditionalMsgs.child
          if (childMsg[dustLevel]) {
            content = [...content, ...childMsg[dustLevel]]
            profileApplied.push('아이')
            priority += 6
          }
        }
      }

      // 프로필 기반 추가 우선순위 계산
      if (profile) {
        // 건강 상태 기반 우선순위
        if (profile.health === 'asthma' && key === 'fan') {
          priority += 5
        }
        if (profile.health === 'allergy_rhinitis' && (key === 'sink' || key === 'clean')) {
          priority += 3
        }
        if (profile.health === 'lung_disease' && key === 'door') {
          priority += 4
        }

        // 연령대 기반 우선순위
        if (profile.ageGroup === 'senior' && key === 'refrigeator') {
          priority += 2
        }
        if (profile.ageGroup === 'child' && key === 'door') {
          priority += 3
        }

        // 아이 기반 우선순위
        if (profile.child && profile.child !== 'none' && key === 'sofa') {
          priority += 2
        }

        // 반려동물 기반 우선순위
        if (profile.pet === 'dog' && key === 'dog') {
          priority += 5
        }
        if (profile.pet === 'dog' && key === 'clean') {
          priority += 3
        }
      }

      // 외출 관련은 기본적으로 약간의 우선순위 (출근/외출 전 확인 목적)
      if (key === 'door') {
        priority += 1
      }

      allGuides.push({
        title: OBJECT_NAMES[key] || key,
        content,
        profileApplied,
        priority
      })
    })

    // 우선순위가 높은 순으로 정렬 (프로필 관련된 것이 상단에)
    allGuides.sort((a, b) => {
      // 프로필이 적용된 것이 우선
      if (a.profileApplied.length > 0 && b.profileApplied.length === 0) return -1
      if (a.profileApplied.length === 0 && b.profileApplied.length > 0) return 1
      // 같은 경우 우선순위로 정렬
      return b.priority - a.priority
    })

    return allGuides
  }

  return { getAllBehavioralGuides }
}

