import type { DustGrade } from '@/shared/types/api'

export const DUST_COLOR_MAP: Record<DustGrade, string> = {
  '매우 좋음': '#4285F4',
  '좋음': '#1976D2',
  '양호': '#22B14C',
  '보통': '#B5E61D',
  '주의': '#FFD400',
  '나쁨': '#FF7F27',
  '매우 나쁨': '#F52020'
}

export const DUST_BG_COLOR_MAP: Record<DustGrade, string> = {
  '매우 좋음': '#B3D5F5',
  '좋음': '#90C5F0',
  '양호': '#A8E0B8',
  '보통': '#E5F5A8',
  '주의': '#FFE880',
  '나쁨': '#FFB87A',
  '매우 나쁨': '#F88B8B'
}

export const DEFAULT_DUST_COLOR = '#10b981'
export const DEFAULT_DUST_BG_COLOR = '#90C5F0'

export const OBJECT_NAMES: Record<string, string> = {
  window: '창문',
  dog: '반려견',
  plant: '식물',
  sofa: '가구',
  light: '조명',
  stove: '가스레인지',
  sink: '세면대',
  fan: '공기청정기',
  door: '출입문',
  refrigeator: '냉장고',
  clean: '청소',
  bed: '침대'
}

export const SPLINE_SCENE_URL = 'https://prod.spline.design/LZVviCy6ekslUYeT/scene.splinecode'
export const MODAL_READY_DELAY = 1000 // 1초

