import type { ProfileCategory } from '@/shared/types/profile'

export interface ProfileCategoryCardProps {
  category: ProfileCategory
  selectedValue: string | undefined
  onSelect: (value: string) => void
}

