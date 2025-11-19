import type { LocationInfo } from '@/shared/types/api'

interface DashboardHeaderProps {
  locationInfo: LocationInfo | null
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  isLaptop: boolean
  onToggleSidebar: () => void
  onNavigateToProfile?: () => void
  onTestPm10Change: (value: number | null) => void
}

export const DashboardHeader = ({
  locationInfo,
  dustMood,
  isLaptop,
  onToggleSidebar,
  onNavigateToProfile,
  onTestPm10Change
}: DashboardHeaderProps) => {
  const gradeButtons = [
    { value: 10, label: '매우 좋음', color: '#4285F4', title: '매우 좋음 (0-15)' },
    { value: 20, label: '좋음', color: '#1976D2', title: '좋음 (16-30)' },
    { value: 40, label: '양호', color: '#22B14C', title: '양호 (31-55)' },
    { value: 70, label: '보통', color: '#B5E61D', title: '보통 (56-80)' },
    { value: 100, label: '주의', color: '#FFD400', title: '주의 (81-115)' },
    { value: 130, label: '나쁨', color: '#FF7F27', title: '나쁨 (116-150)' },
    { value: 200, label: '매우 나쁨', color: '#F52020', title: '매우 나쁨 (151+)' }
  ]

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
            {gradeButtons.map((btn) => (
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
              onClick={() => onTestPm10Change(null)} 
              style={{ padding: '4px 8px', fontSize: '11px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              title="실제 데이터 사용"
            >
              실제값
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

