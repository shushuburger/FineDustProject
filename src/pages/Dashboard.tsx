import { House3D } from '@/widgets/House3D'
import { DustInfo } from '@/widgets/DustInfo/DustInfo'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react'
import { formatCurrentTime, getPM10Grade, getNearestStationAir } from '@/shared/api/dustApi'
import type { DustData, LocationInfo, DustGrade } from '@/shared/types/api'
import type { TodoRealLifeAction } from '@/shared/types/todo'
import todoListData from '@/assets/data/todoList.json'
import { registerServiceWorker, scheduleNotificationOnUnload, updateNotificationMission } from '@/shared/utils/notifications'
import './Dashboard.css'

interface DashboardProps {
  onNavigateToProfile?: () => void
}

export const Dashboard = ({ onNavigateToProfile }: DashboardProps) => {
  const isLaptop = useMediaQuery({ minWidth: 1024 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // 위치 정보 및 미세먼지 데이터 상태
  const [dustData, setDustData] = useState<DustData | null>(null)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(formatCurrentTime())
  const [currentDate, setCurrentDate] = useState('')
  const [calendarDates, setCalendarDates] = useState<number[]>([])
  const [dustMood, setDustMood] = useState<{ emoji: string; text: string; color: string; bgColor: string } | null>(null)
  const [randomMissions, setRandomMissions] = useState<TodoRealLifeAction[]>([])
  const [testPm10, setTestPm10] = useState<number | null>(null)
  const [userProfile, setUserProfile] = useState<{
    profile?: {
      health?: string
      ageGroup?: string
      child?: string
      pet?: string
    }
  } | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // 날짜 기반 시드로 랜덤 미션 선택 (하루 단위로 고정)
  const getRandomMissions = (count: number = 5, seed?: string): TodoRealLifeAction[] => {
    const allActions = todoListData.realLifeActions
    
    // 시드가 있으면 결정적 난수 생성
    if (seed) {
      const seededRandom = (s: number) => {
        const x = Math.sin(s++) * 10000
        return x - Math.floor(x)
      }
      
      const shuffled = [...allActions].sort((a, b) => {
        const seed1 = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const seed2 = seed1 + a.id
        const seed3 = seed1 + b.id
        return seededRandom(seed2) - seededRandom(seed3)
      })
      return shuffled.slice(0, count)
    }
    
    // 시드가 없으면 일반 랜덤
    const shuffled = [...allActions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // 오늘 날짜 가져오기 (YYYY-MM-DD 형식)
  const getTodayDateString = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 미세먼지 등급에 따른 표정과 색상 설정
  const getDustMood = (grade: DustGrade) => {
    const moodMap: Record<DustGrade, { emoji: string; text: string; color: string; bgColor: string }> = {
      '매우 좋음': { 
        emoji: '😊', 
        text: '상쾌한 하루!', 
        color: '#4285F4', 
        bgColor: '#D0E8F2' 
      },
      '좋음': { 
        emoji: '🙂', 
        text: '좋은 공기!', 
        color: '#1976D2', 
        bgColor: '#E3F2FD' 
      },
      '양호': { 
        emoji: '😐', 
        text: '괜찮아요', 
        color: '#22B14C', 
        bgColor: '#F1F8E9' 
      },
      '보통': { 
        emoji: '😕', 
        text: '조금 주의', 
        color: '#B5E61D', 
        bgColor: '#FFF8E1' 
      },
      '주의': { 
        emoji: '😟', 
        text: '마스크 권장', 
        color: '#FFD400', 
        bgColor: '#FFF3E0' 
      },
      '나쁨': { 
        emoji: '😰', 
        text: '실외 활동 자제', 
        color: '#FF7F27', 
        bgColor: '#FFEBEE' 
      },
      '매우 나쁨': { 
        emoji: '😱', 
        text: '실외 금지!', 
        color: '#F52020', 
        bgColor: '#FCE4EC' 
      }
    };
    return moodMap[grade] || { emoji: '😐', text: '정보 없음', color: '#6B7280', bgColor: '#F9FAFB' };
  };

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
              // 다른 날이면 새로 선택
              const newMissions = getRandomMissions(5, todayDate)
              setRandomMissions(newMissions)
              localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions: newMissions }))
            }
          } catch (error) {
            // 파싱 에러 시 새로 선택
            const missions = getRandomMissions(5, todayDate)
            setRandomMissions(missions)
            localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions }))
          }
        } else {
          // 첫 방문 시
          const missions = getRandomMissions(5, todayDate)
          setRandomMissions(missions)
          localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions }))
        }
        
        // 표정 상태 업데이트 (testPm10이 없을 때만)
        if (!testPm10 && currentDustData?.PM10 !== undefined) {
          const pm10Grade = getPM10Grade(currentDustData.PM10);
          const mood = getDustMood(pm10Grade);
          setDustMood(mood);
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
  }, [])

  // randomMissions가 로드되면 알림 설정 업데이트
  useEffect(() => {
    if (randomMissions.length > 0) {
      const randomMission = randomMissions[Math.floor(Math.random() * randomMissions.length)]
      // 미션 제목만 업데이트 (이벤트 리스너는 이미 등록됨)
      updateNotificationMission(randomMission.title)
      console.log('미션 알림 업데이트:', randomMission.title)
    }
  }, [randomMissions])

  // 테스트용 PM10 값이 변경될 때 dustMood 업데이트
  useEffect(() => {
    if (testPm10 !== null) {
      const pm10Grade = getPM10Grade(testPm10);
      const mood = getDustMood(pm10Grade);
      setDustMood(mood);
    } else if (dustData?.PM10 !== undefined) {
      // 실제값 복원 시 실제 데이터로 표정 재계산
      const pm10Grade = getPM10Grade(dustData.PM10);
      const mood = getDustMood(pm10Grade);
      setDustMood(mood);
    }
  }, [testPm10, dustData])


  return (
    <>
      {/* 프로필 설정 모달 */}
      {showProfileModal && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>환영합니다</h2>
              <button className="profile-modal-close" onClick={() => setShowProfileModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="profile-modal-body">
              <p>맞춤형 미세먼지 정보를 제공받기 위해 프로필을 설정해주세요.</p>
              <button 
                className="profile-modal-button"
                onClick={() => {
                  setShowProfileModal(false)
                  onNavigateToProfile?.()
                }}
              >
                프로필 설정하러 가기
              </button>
            </div>
          </div>
        </div>
      )}

    <div className={`smart-home-dashboard ${!isLaptop ? 'mobile-layout' : ''}`}>
      {/* 상단 헤더 */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="brand-logo">
            <span>Finedust</span>
          </div>
                  <div className="address">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{locationInfo?.address || '위치 정보 로딩 중...'}</span>
                  </div>
        </div>
        
        <div className="header-center">
        </div>
        
                <div className="header-right">
                  <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H21M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

          {/* 테스트용 미세먼지 등급 버튼 - 데스크톱에서만 표시 */}
          {isLaptop && (
            <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
              <button 
                onClick={() => setTestPm10(20)} 
                style={{ padding: '4px 8px', fontSize: '11px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title="좋음 (0-30)"
              >
                좋음
              </button>
              <button 
                onClick={() => setTestPm10(60)} 
                style={{ padding: '4px 8px', fontSize: '11px', background: '#22b14c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title="보통 (31-80)"
              >
                보통
              </button>
              <button 
                onClick={() => setTestPm10(110)} 
                style={{ padding: '4px 8px', fontSize: '11px', background: '#ffd400', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title="나쁨 (81-150)"
              >
                나쁨
              </button>
              <button 
                onClick={() => setTestPm10(200)} 
                style={{ padding: '4px 8px', fontSize: '11px', background: '#f52020', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title="매우 나쁨 (151+)"
              >
                매우 나쁨
              </button>
              <button 
                onClick={() => setTestPm10(null)} 
                style={{ padding: '4px 8px', fontSize: '11px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title="실제 데이터 사용"
              >
                실제값
              </button>
            </div>
          )}

          <div className="user-profile" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
            <span>Shopia W.</span>
            <div className="profile-avatar">
              <div className="avatar-circle"></div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </header>

              <div className="dashboard-content">
                {/* 중앙 메인 콘텐츠 */}
                <main className="main-content">
                  <House3D 
                    pm10Value={testPm10 ?? dustData?.PM10}
                    userHealth={userProfile?.profile?.health}
                    userAge={userProfile?.profile?.ageGroup}
                    userChild={userProfile?.profile?.child}
                    userPet={userProfile?.profile?.pet}
                  />
                  
                  {/* 미세먼지 표정 오버레이 */}
                  {dustMood && (
                    <div 
                      className="dust-mood-overlay"
                      style={{
                        backgroundColor: dustMood.bgColor,
                        color: dustMood.color,
                        borderColor: dustMood.color
                      }}
                    >
                      <div className="mood-emoji">{dustMood.emoji}</div>
                      <div className="mood-text">{dustMood.text}</div>
                    </div>
                  )}
                </main>

                {/* 모바일에서 사이드바 오버레이 배경 */}
                {!isLaptop && isSidebarOpen && (
                  <div 
                    className="mobile-sidebar-backdrop" 
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                {/* 오른쪽 사이드바 - 데스크톱에서는 항상 표시, 모바일에서는 오버레이로 */}
                <aside className={`right-sidebar ${!isSidebarOpen ? 'collapsed' : ''} ${!isLaptop ? 'mobile-overlay' : ''}`}>
                      <div className="sidebar-header">
                        <h2>상세 정보</h2>
                        <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
              
                      <div className="sidebar-content">
                        {/* 미세먼지 정보 섹션 */}
                        <DustInfo 
                          dustData={dustData || undefined}
                          location={locationInfo?.address || undefined}
                          time={currentTime}
                          isLoading={isLoading}
                          error={error || undefined}
                        />
                
                {/* 활동 섹션 */}
                <div className="activity-section">
                  <h3>오늘의 미션</h3>
                  <div className="activity-date">{currentDate}</div>
                  
                  {/* 캘린더 */}
                  <div className="calendar">
                    <div className="calendar-header">
                      <div className="day">Su</div>
                      <div className="day">Mo</div>
                      <div className="day">Tu</div>
                      <div className="day">We</div>
                      <div className="day">Th</div>
                      <div className="day">Fr</div>
                      <div className="day">Sa</div>
                    </div>
                    <div className="calendar-dates">
                      {calendarDates.map((date, index) => (
                        <div key={index} className={`date ${date === new Date().getDate() ? 'active' : ''}`}>
                          {date > 0 ? date : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 미션 체크리스트 */}
                  <div className="mission-checklist">
                    {randomMissions.map((mission) => (
                      <div key={mission.id} className="mission-item">
                        <input type="checkbox" id={`mission${mission.id}`} className="mission-checkbox" />
                        <label htmlFor={`mission${mission.id}`} className="mission-label">
                          <span className="mission-text">{mission.title}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
            
            {/* 사이드바가 접혔을 때 보여줄 토글 버튼 - 데스크톱에서만 */}
            {isLaptop && !isSidebarOpen && (
              <button className="sidebar-toggle-expanded" onClick={() => setIsSidebarOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
    </>
  )
}
