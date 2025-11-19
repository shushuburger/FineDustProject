export interface GradeButton {
  value: number
  label: string
  color: string
  title: string
}

export const GRADE_BUTTONS: GradeButton[] = [
  { value: 10, label: '매우 좋음', color: '#4285F4', title: '매우 좋음 (0-15)' },
  { value: 20, label: '좋음', color: '#1976D2', title: '좋음 (16-30)' },
  { value: 40, label: '양호', color: '#22B14C', title: '양호 (31-55)' },
  { value: 70, label: '보통', color: '#B5E61D', title: '보통 (56-80)' },
  { value: 100, label: '주의', color: '#FFD400', title: '주의 (81-115)' },
  { value: 130, label: '나쁨', color: '#FF7F27', title: '나쁨 (116-150)' },
  { value: 200, label: '매우 나쁨', color: '#F52020', title: '매우 나쁨 (151+)' }
]

export const ACTUAL_VALUE_BUTTON = {
  value: null,
  label: '실제값',
  color: '#64748b',
  title: '실제 데이터 사용'
} as const

