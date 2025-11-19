import { DustInfo } from '@/widgets/DustInfo/DustInfo'
import { ProfileInfo } from '@/widgets/ProfileInfo'
import { Calendar } from './Calendar'
import { MissionList } from './MissionList'
import type { DustData, LocationInfo } from '@/shared/types/api'
import type { TodoRealLifeAction } from '@/shared/types/todo'
import type { UserProfile } from '@/shared/types/profile'

interface DashboardSidebarProps {
  isOpen: boolean
  isLaptop: boolean
  onClose: () => void
  dustData: DustData | null
  locationInfo: LocationInfo | null
  currentTime: string
  isLoading: boolean
  error: string | null
  userProfile: { profile?: UserProfile } | null
  onNavigateToProfile?: () => void
  currentDate: string
  calendarDates: number[]
  randomMissions: TodoRealLifeAction[]
  getMissionPriority: (mission: TodoRealLifeAction, profile?: UserProfile) => number
}

export const DashboardSidebar = ({
  isOpen,
  isLaptop,
  onClose,
  dustData,
  locationInfo,
  currentTime,
  isLoading,
  error,
  userProfile,
  onNavigateToProfile,
  currentDate,
  calendarDates,
  randomMissions,
  getMissionPriority
}: DashboardSidebarProps) => {
  return (
    <aside className={`right-sidebar ${!isOpen ? 'collapsed' : ''} ${!isLaptop ? 'mobile-overlay' : ''}`}>
      <div className="sidebar-header">
        <h2>상세 정보</h2>
        <button className="sidebar-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="sidebar-content">
        {/* 미세먼지 정보 섹션 */}
        <DustInfo 
          dustData={dustData || undefined}
          location={locationInfo?.address || undefined}
          time={currentTime}
          isLoading={isLoading}
          error={error || undefined}
        />

        {/* 프로필 정보 섹션 - 데스크톱에서만 표시 */}
        {isLaptop && (
          <ProfileInfo 
            profile={userProfile?.profile}
            onEditClick={onNavigateToProfile}
          />
        )}

        {/* 활동 섹션 */}
        <div className="activity-section">
          <h3>오늘의 미션</h3>
          <div className="activity-date">{currentDate}</div>
          
          <Calendar dates={calendarDates} />
          
          <MissionList 
            missions={randomMissions}
            userProfile={userProfile?.profile}
            getMissionPriority={getMissionPriority}
          />
        </div>
      </div>
    </aside>
  )
}

