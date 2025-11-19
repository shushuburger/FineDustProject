import type { DustGrade } from '@/shared/types/api'
import type { DustMood } from './types'

export const DUST_MOOD_MAP: Record<DustGrade, DustMood> = {
  '매우 좋음': { 
    emoji: '😊', 
    text: '상쾌한 하루!', 
    color: '#4285F4', 
    bgColor: '#B3D5F5' 
  },
  '좋음': { 
    emoji: '🙂', 
    text: '좋은 공기!', 
    color: '#1976D2', 
    bgColor: '#90C5F0' 
  },
  '양호': { 
    emoji: '😐', 
    text: '괜찮아요', 
    color: '#22B14C', 
    bgColor: '#A8E0B8' 
  },
  '보통': { 
    emoji: '😕', 
    text: '조금 주의', 
    color: '#B5E61D', 
    bgColor: '#E5F5A8' 
  },
  '주의': { 
    emoji: '😟', 
    text: '마스크 권장', 
    color: '#FFD400', 
    bgColor: '#FFE880' 
  },
  '나쁨': { 
    emoji: '😰', 
    text: '실외 활동 자제', 
    color: '#FF7F27', 
    bgColor: '#FFB87A' 
  },
  '매우 나쁨': { 
    emoji: '😱', 
    text: '실외 금지!', 
    color: '#F52020', 
    bgColor: '#F88B8B' 
  }
}

export const DEFAULT_DUST_MOOD: DustMood = {
  emoji: '😐',
  text: '정보 없음',
  color: '#6B7280',
  bgColor: '#F9FAFB'
}

export const OBJECT_NAMES: Record<string, string> = {
  window: '창문',
  dog: '반려견',
  plants: '식물',
  sofa: '가구',
  light: '조명',
  stove: '가스레인지',
  sink: '세면대',
  fan: '공기청정기',
  door: '출입문',
  refrigeator: '냉장고',
  clean: '청소'
}

