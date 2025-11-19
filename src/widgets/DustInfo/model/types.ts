import type { DustData } from '@/shared/types/api'

export interface DustInfoProps {
  dustData?: DustData | null
  location?: string | null
  time?: string
  isLoading?: boolean
  error?: string | null
}

