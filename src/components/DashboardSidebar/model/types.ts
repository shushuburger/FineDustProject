import type { DustData, LocationInfo } from '@/shared/types/api'
import type { TodoRealLifeAction } from '@/shared/types/todo'
import type { UserProfile } from '@/shared/types/profile'

export interface DashboardSidebarProps {
  isOpen: boolean
  isLaptop: boolean
  onClose: () => void
  dustData: DustData | null
  locationInfo: LocationInfo | null
  currentTime: string
  isLoading: boolean
  error: string | null
  userProfile: { profile?: UserProfile } | null
  onNavigateToProfile?: () => void
  currentDate: string
  calendarDates: number[]
  randomMissions: TodoRealLifeAction[]
  getMissionPriority: (mission: TodoRealLifeAction, profile?: UserProfile) => number
}

