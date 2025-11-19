import type { DustData, LocationInfo } from '@/shared/types/api'
import type { TodoRealLifeAction } from '@/shared/types/todo'

export interface DashboardProps {
  onNavigateToProfile?: () => void
}

export interface DustMood {
  emoji: string
  text: string
  color: string
  bgColor: string
}

export interface UserProfileState {
  profile?: {
    health?: string
    ageGroup?: string
    child?: string
    pet?: string
  }
}

export interface BehavioralGuide {
  title: string
  content: string[]
  profileApplied: string[]
  priority: number
}

export interface DashboardState {
  dustData: DustData | null
  locationInfo: LocationInfo | null
  isLoading: boolean
  error: string | null
  currentTime: string
  currentDate: string
  calendarDates: number[]
  dustMood: DustMood | null
  randomMissions: TodoRealLifeAction[]
  testPm10: number | null
  userProfile: UserProfileState | null
  showProfileModal: boolean
  showBehavioralModal: boolean
  behavioralModalGuides: BehavioralGuide[]
  buttonWidth: number | undefined
  showMobileDustControls: boolean
  isSidebarOpen: boolean
}

