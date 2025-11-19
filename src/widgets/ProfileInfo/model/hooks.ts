import type { UserProfile } from '@/shared/types/profile'
import type { ProfileItem } from './types'
import { getLabel } from './utils'

export const useProfileItems = (profile?: UserProfile): ProfileItem[] => {
  const profileItems: ProfileItem[] = []

  if (!profile) return profileItems

  if (profile.ageGroup) {
    profileItems.push({
      label: '연령대',
      value: getLabel('연령대', profile.ageGroup),
      icon: '👤'
    })
  }

  if (profile.health && profile.health !== 'normal') {
    profileItems.push({
      label: '건강',
      value: getLabel('건강', profile.health),
      icon: '🏥'
    })
  }

  if (profile.child && profile.child !== 'none') {
    profileItems.push({
      label: '아이',
      value: getLabel('아이', profile.child),
      icon: '👶'
    })
  }

  if (profile.pet && profile.pet !== 'none') {
    profileItems.push({
      label: '반려동물',
      value: getLabel('반려견', profile.pet),
      icon: profile.pet === 'dog' ? '🐕' : '🐱'
    })
  }

  return profileItems
}

