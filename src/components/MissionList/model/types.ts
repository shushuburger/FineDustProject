import type { TodoRealLifeAction } from '@/shared/types/todo'
import type { UserProfile } from '@/shared/types/profile'

export interface MissionListProps {
  missions: TodoRealLifeAction[]
  userProfile?: UserProfile
  getMissionPriority: (mission: TodoRealLifeAction, profile?: UserProfile) => number
}

