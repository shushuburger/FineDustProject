import type { DustGrade } from '@/shared/types/api'
import type { TodoRealLifeAction } from '@/shared/types/todo'
import type { UserProfile } from '@/shared/types/profile'
import { DUST_MOOD_MAP, DEFAULT_DUST_MOOD } from './constants'
import type { DustMood } from './types'

// 오늘 날짜 가져오기 (YYYY-MM-DD 형식)
export const getTodayDateString = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 미세먼지 등급에 따른 표정과 색상 설정
export const getDustMood = (grade: DustGrade): DustMood => {
  return DUST_MOOD_MAP[grade] || DEFAULT_DUST_MOOD
}

// PM10 값에 따라 행동 방안 등급 결정
export const getDustLevel = (pm10?: number): 'good' | 'moderate' | 'bad' | 'very_bad' => {
  if (!pm10) return 'moderate'
  if (pm10 <= 30) return 'good'
  if (pm10 <= 80) return 'moderate'
  if (pm10 <= 150) return 'bad'
  return 'very_bad'
}

// 프로필 기반 미션 우선순위 계산
export const getMissionPriority = (mission: TodoRealLifeAction, profile?: UserProfile): number => {
  if (!profile) return 0
  
  let priority = 0
  
  // 건강 상태 기반 우선순위
  if (profile.health === 'asthma' && mission.guidelineKey === 'fan') {
    priority += 10 // 천식 환자는 공기청정기 우선
  }
  if (profile.health === 'allergy_rhinitis' && (mission.guidelineKey === 'sink' || mission.guidelineKey === 'clean')) {
    priority += 8 // 알레르기 비염은 세정/청소 우선
  }
  if (profile.health === 'lung_disease' && mission.guidelineKey === 'door') {
    priority += 9 // 폐질환자는 외출 관리 우선
  }
  
  // 연령대 기반 우선순위
  if (profile.ageGroup === 'senior' && mission.guidelineKey === 'refrigeator') {
    priority += 5 // 노년층은 수분 섭취 우선
  }
  if (profile.ageGroup === 'child' && mission.guidelineKey === 'door') {
    priority += 7 // 어린이는 외출 관리 우선
  }
  
  // 아이 기반 우선순위
  if (profile.child && profile.child !== 'none' && mission.guidelineKey === 'sofa') {
    priority += 6 // 아이가 있으면 가구 청소 우선
  }
  
  // 반려동물 기반 우선순위
  if (profile.pet === 'dog' && mission.guidelineKey === 'dog') {
    priority += 10 // 반려견이 있으면 반려견 관리 최우선
  }
  if (profile.pet === 'dog' && mission.guidelineKey === 'clean') {
    priority += 7 // 반려견이 있으면 청소 우선
  }
  
  return priority
}

// 날짜 기반 시드로 랜덤 미션 선택 (하루 단위로 고정, 프로필 기반 우선순위 적용)
export const getRandomMissions = (
  allActions: TodoRealLifeAction[],
  count: number = 5,
  seed?: string,
  profile?: UserProfile
): TodoRealLifeAction[] => {
  // 프로필 기반 우선순위 계산
  const actionsWithPriority = allActions.map(action => ({
    ...action,
    priority: getMissionPriority(action, profile)
  }))
  
  // 시드가 있으면 결정적 난수 생성
  if (seed) {
    const seededRandom = (s: number) => {
      const x = Math.sin(s++) * 10000
      return x - Math.floor(x)
    }
    
    // 우선순위가 높은 것부터 정렬, 같은 우선순위면 시드 기반 랜덤
    const sorted = [...actionsWithPriority].sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      const seed1 = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const seed2 = seed1 + a.id
      const seed3 = seed1 + b.id
      return seededRandom(seed2) - seededRandom(seed3)
    })
    
    // 우선순위가 높은 것들을 먼저 선택
    const highPriority = sorted.filter(a => a.priority > 0).slice(0, count)
    const remaining = sorted.filter(a => a.priority === 0).slice(0, count - highPriority.length)
    return [...highPriority, ...remaining].slice(0, count)
  }
  
  // 시드가 없으면 우선순위 기반 정렬 후 랜덤
  const sorted = [...actionsWithPriority].sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority
    }
    return 0.5 - Math.random()
  })
  
  return sorted.slice(0, count)
}

