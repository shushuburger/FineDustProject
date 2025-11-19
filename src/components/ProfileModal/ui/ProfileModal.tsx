import type { ProfileModalProps } from '../model/types'

export const ProfileModal = ({ isOpen, onClose, onNavigateToProfile }: ProfileModalProps) => {
  if (!isOpen) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>환영합니다</h2>
          <button className="profile-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="profile-modal-body">
          <p>맞춤형 미세먼지 정보를 제공받기 위해 프로필을 설정해주세요.</p>
          <button 
            className="profile-modal-button"
            onClick={() => {
              onClose()
              onNavigateToProfile?.()
            }}
          >
            프로필 설정하러 가기
          </button>
        </div>
      </div>
    </div>
  )
}

