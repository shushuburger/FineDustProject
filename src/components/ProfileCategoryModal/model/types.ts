import type { ProfileCategory } from '@/shared/types/profile'

export interface ProfileCategoryModalProps {
  isOpen: boolean
  category: ProfileCategory | null
  initialSelectedValue: string
  onClose: () => void
  onConfirm: (category: string, value: string) => void
}

