export interface ProfileOption {
  value: string
  label: string
  recommendation: string
}

export interface ProfileCategory {
  category: string
  options: ProfileOption[]
}

export interface UserProfile {
  ageGroup?: string
  child?: string
  pet?: string
  health?: string
}

export interface SavedProfile {
  userName: string
  selectedOptions: Record<string, string>
  profile: UserProfile
}

