import type { UserProfile } from '@/shared/types/profile'

export interface ProfileInfoProps {
  profile?: UserProfile
  onEditClick?: () => void
}

export interface ProfileItem {
  label: string
  value: string
  icon: string
}

