import type { ProfileHeaderProps } from '../model/types'

export const ProfileHeader = ({ onNavigateToDashboard, isMobile }: ProfileHeaderProps) => {
  if (isMobile) {
    return (
      <button className="back-button-mobile" onClick={onNavigateToDashboard}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    )
  }

  return (
    <header className="profile-page-header">
      <div className="profile-header-left">
        <button className="back-button-header" onClick={onNavigateToDashboard}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="brand-logo">
          <span>Finedust</span>
        </div>
      </div>
    </header>
  )
}

