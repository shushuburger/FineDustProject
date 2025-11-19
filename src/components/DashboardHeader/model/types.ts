import type { LocationInfo } from '@/shared/types/api'

export interface DashboardHeaderProps {
  locationInfo: LocationInfo | null
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  isLaptop: boolean
  onToggleSidebar: () => void
  onNavigateToProfile?: () => void
  onTestPm10Change: (value: number | null) => void
}

