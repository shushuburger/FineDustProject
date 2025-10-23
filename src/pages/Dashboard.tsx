import { House3D } from '@/widgets/House3D'
import { useMediaQuery } from 'react-responsive'
import { useState } from 'react'
import './Dashboard.css'

export const Dashboard = () => {
  const isLaptop = useMediaQuery({ minWidth: 1024 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className={`smart-home-dashboard ${!isLaptop ? 'mobile-layout' : ''}`}>
      {/* 상단 헤더 */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="brand-logo">
            <span>Finedust</span>
          </div>
          <div className="address">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>401 Magnetic Drive Unit 2</span>
          </div>
        </div>
        
        <div className="header-center">
        </div>
        
        <div className="header-right">
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="user-profile">
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

      <div className="dashboard-content">
        {/* 중앙 메인 콘텐츠 */}
        <main className="main-content">
          <House3D />
        </main>

        {/* 오른쪽 사이드바 - 데스크톱에서만 표시 */}
        {isLaptop && (
          <>
            <aside className={`right-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
              <div className="sidebar-header">
                <h2>Smart Home Security Systems</h2>
                <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="sidebar-content">
                {/* 멤버 섹션 */}
                <div className="members-section">
                  <h3>Members</h3>
                  <div className="members-list">
                    <div className="member-avatar blonde"></div>
                    <div className="member-avatar initials">Gb</div>
                    <div className="member-avatar brunette1"></div>
                    <div className="member-avatar brunette2"></div>
                    <div className="member-avatar more">+3</div>
                  </div>
                </div>
                
                {/* 활동 섹션 */}
                <div className="activity-section">
                  <h3>Activity</h3>
                  <div className="activity-date">December 03, 2023</div>
                  
                  {/* 캘린더 */}
                  <div className="calendar">
                    <div className="calendar-header">
                      <div className="day">Su</div>
                      <div className="day">Mo</div>
                      <div className="day">Tu</div>
                      <div className="day">We</div>
                      <div className="day">Th</div>
                      <div className="day">Fr</div>
                      <div className="day">Sa</div>
                    </div>
                    <div className="calendar-dates">
                      <div className="date">11</div>
                      <div className="date">12</div>
                      <div className="date">13</div>
                      <div className="date active">14</div>
                      <div className="date">15</div>
                      <div className="date">16</div>
                      <div className="date">17</div>
                    </div>
                  </div>
                  
                  {/* 활동 타임라인 */}
                  <div className="activity-timeline">
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">07:00 am</div>
                        <div className="timeline-card purple">
                          <div className="card-title">Home</div>
                          <div className="card-text">Back Door was Closed</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">08:00 am</div>
                        <div className="timeline-card white">
                          <div className="card-title">Home</div>
                          <div className="card-text">Back Door was Opened</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            
            {/* 사이드바가 접혔을 때 보여줄 토글 버튼 */}
            {!isSidebarOpen && (
              <button className="sidebar-toggle-expanded" onClick={() => setIsSidebarOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
