import type { ProfileCategory } from '@/shared/types/profile'

export interface ProfileCategoryListProps {
  categories: ProfileCategory[]
  selectedOptions: Record<string, string>
  onCategoryClick: (category: ProfileCategory) => void
}

