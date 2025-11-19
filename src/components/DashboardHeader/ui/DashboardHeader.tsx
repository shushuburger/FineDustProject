import type { DashboardHeaderProps } from '../model/types'
import { GRADE_BUTTONS, ACTUAL_VALUE_BUTTON } from '../model/constants'

export const DashboardHeader = ({
  locationInfo,
  dustMood,
  isLaptop,
  onToggleSidebar,
  onNavigateToProfile,
  onTestPm10Change
}: DashboardHeaderProps) => {
  return (
    <header 
      className="dashboard-header"
      style={dustMood ? {
        backgroundColor: dustMood.bgColor
      } : {}}
    >
      <div className="header-left">
        <div className="brand-logo">
          <span>Finedust</span>
        </div>
        <div className="address">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{locationInfo?.address || '위치 정보 로딩 중...'}</span>
        </div>
      </div>
      
      <div className="header-center">
      </div>
      
      <div className="header-right">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 테스트용 미세먼지 등급 버튼 - 데스크톱에서만 표시 */}
        {isLaptop && (
          <div style={{ display: 'flex', gap: '8px', marginRight: '16px', flexWrap: 'wrap' }}>
            {GRADE_BUTTONS.map((btn) => (
              <button 
                key={btn.value}
                onClick={() => onTestPm10Change(btn.value)} 
                style={{ padding: '4px 8px', fontSize: '11px', background: btn.color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title={btn.title}
              >
                {btn.label}
              </button>
            ))}
            <button 
              onClick={() => onTestPm10Change(ACTUAL_VALUE_BUTTON.value)} 
              style={{ padding: '4px 8px', fontSize: '11px', background: ACTUAL_VALUE_BUTTON.color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              title={ACTUAL_VALUE_BUTTON.title}
            >
              {ACTUAL_VALUE_BUTTON.label}
            </button>
          </div>
        )}

        <div className="user-profile" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
          <span>Shopia W.</span>
          <div className="profile-avatar">
            <div className="avatar-circle"></div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  )
}

