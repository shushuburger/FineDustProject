import type { UserProfile } from '@/shared/types/profile'
import profileCategories from '@/assets/data/profileCategories.json'
import './ProfileInfo.css'

interface ProfileInfoProps {
  profile?: UserProfile
  onEditClick?: () => void
}

export const ProfileInfo = ({ profile, onEditClick }: ProfileInfoProps) => {

  if (!profile) {
    return (
      <div className="profile-info-empty">
        <p>프로필을 설정하면 맞춤형 정보를 받을 수 있습니다.</p>
        {onEditClick && (
          <button className="profile-setup-button" onClick={onEditClick}>
            프로필 설정하기
          </button>
        )}
      </div>
    )
  }

  // 프로필 카테고리에서 라벨 찾기
  const getLabel = (category: string, value: string): string => {
    const categoryData = profileCategories.find(cat => cat.category === category)
    const option = categoryData?.options.find(opt => opt.value === value)
    return option?.label || value
  }

  const profileItems: Array<{ label: string; value: string; icon: string }> = []

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

  return (
    <div className="profile-info-card">
      <div className="profile-info-header">
        <h3 className="profile-info-title">프로필</h3>
        {onEditClick && (
          <button className="profile-edit-button" onClick={onEditClick} title="프로필 수정">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      
      {profileItems.length > 0 ? (
        <div className="profile-info-badges">
          {profileItems.map((item, index) => (
            <div key={index} className="profile-badge">
              <span className="profile-badge-icon">{item.icon}</span>
              <div className="profile-badge-content">
                <span className="profile-badge-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="profile-info-empty-state">
          <p>프로필 정보가 없습니다.</p>
          {onEditClick && (
            <button className="profile-setup-button-small" onClick={onEditClick}>
              설정하기
            </button>
          )}
        </div>
      )}

      <div className="profile-info-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>행동 가이드 반영</span>
      </div>
    </div>
  )
}

