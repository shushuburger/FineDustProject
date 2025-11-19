import { getPM10Grade } from '@/shared/api/dustApi'
import { DUST_COLOR_MAP, DUST_BG_COLOR_MAP, DEFAULT_DUST_COLOR, DEFAULT_DUST_BG_COLOR } from './constants'

// PM10 값에 따라 행동 방안 등급 결정
export const getDustLevel = (pm10?: number): 'good' | 'moderate' | 'bad' | 'very_bad' => {
  if (!pm10) return 'moderate'
  if (pm10 <= 30) return 'good'
  if (pm10 <= 80) return 'moderate'
  if (pm10 <= 150) return 'bad'
  return 'very_bad'
}

// 미세먼지 등급에 따른 색상 가져오기
export const getDustColor = (pm10?: number): string => {
  if (!pm10) return DEFAULT_DUST_COLOR
  const grade = getPM10Grade(pm10)
  return DUST_COLOR_MAP[grade] || DEFAULT_DUST_COLOR
}

// 미세먼지 등급에 따른 배경색 가져오기
export const getDustBgColor = (pm10?: number): string => {
  if (!pm10) return DEFAULT_DUST_BG_COLOR
  const grade = getPM10Grade(pm10)
  return DUST_BG_COLOR_MAP[grade] || DEFAULT_DUST_BG_COLOR
}

