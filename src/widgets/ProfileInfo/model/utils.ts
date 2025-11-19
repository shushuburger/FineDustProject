import type { ProfileCategory } from '@/shared/types/profile'
import profileCategories from '@/shared/assets/data/profileCategories.json'

// 프로필 카테고리에서 라벨 찾기
export const getLabel = (category: string, value: string): string => {
  const categoryData = (profileCategories as ProfileCategory[]).find(cat => cat.category === category)
  const option = categoryData?.options.find(opt => opt.value === value)
  return option?.label || value
}

