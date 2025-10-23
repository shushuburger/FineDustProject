import { House3D } from '@/widgets/House3D'
import { DustInfo } from '@/widgets/DustInfo/DustInfo'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react'
import { fetchDustData, getCurrentLocation, formatCurrentTime, getPM10Grade } from '@/shared/api/dustApi'
import type { DustData, LocationInfo, DustGrade } from '@/shared/types/api'
import './Dashboard.css'

export const Dashboard = () => {
  const isLaptop = useMediaQuery({ minWidth: 1024 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // 위치 정보 및 미세먼지 데이터 상태
  const [dustData, setDustData] = useState<DustData | null>(null)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(formatCurrentTime())
  const [dustMood, setDustMood] = useState<{ emoji: string; text: string; color: string; bgColor: string } | null>(null)

  // 미세먼지 등급에 따른 표정과 색상 설정
  const getDustMood = (grade: DustGrade) => {
    const moodMap: Record<DustGrade, { emoji: string; text: string; color: string; bgColor: string }> = {
      '매우 좋음': { 
        emoji: '😊', 
        text: '상쾌한 하루!', 
        color: '#4285F4', 
        bgColor: '#D0E8F2' 
      },
      '좋음': { 
        emoji: '🙂', 
        text: '좋은 공기!', 
        color: '#1976D2', 
        bgColor: '#E3F2FD' 
      },
      '양호': { 
        emoji: '😐', 
        text: '괜찮아요', 
        color: '#22B14C', 
        bgColor: '#F1F8E9' 
      },
      '보통': { 
        emoji: '😕', 
        text: '조금 주의', 
        color: '#B5E61D', 
        bgColor: '#FFF8E1' 
      },
      '주의': { 
        emoji: '😟', 
        text: '마스크 권장', 
        color: '#FFD400', 
        bgColor: '#FFF3E0' 
      },
      '나쁨': { 
        emoji: '😰', 
        text: '실외 활동 자제', 
        color: '#FF7F27', 
        bgColor: '#FFEBEE' 
      },
      '매우 나쁨': { 
        emoji: '😱', 
        text: '실외 금지!', 
        color: '#F52020', 
        bgColor: '#FCE4EC' 
      }
    };
    return moodMap[grade] || { emoji: '😐', text: '정보 없음', color: '#6B7280', bgColor: '#F9FAFB' };
  };

  // 위치 정보 및 미세먼지 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // 미세먼지 데이터와 위치 정보를 병렬로 가져오기
        const [dustApiData, location] = await Promise.all([
          fetchDustData(),
          getCurrentLocation()
        ])
        
        // 현재 위치의 미세먼지 데이터 찾기
        const currentDustData = dustApiData[location.address]
        
        setDustData(currentDustData || null)
        setLocationInfo(location)
        setCurrentTime(formatCurrentTime())
        
        // 표정 상태 업데이트
        if (currentDustData?.PM10 !== undefined) {
          const pm10Grade = getPM10Grade(currentDustData.PM10);
          const mood = getDustMood(pm10Grade);
          setDustMood(mood);
        }
        
      } catch (err) {
        console.error('데이터 로딩 실패:', err)
        setError(err instanceof Error ? err.message : '데이터를 불러올 수 없습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    
    // 1분마다 시간 업데이트
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime())
    }, 60000)

    return () => clearInterval(interval)
  }, [])


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
                    <span>{locationInfo?.address || '위치 정보 로딩 중...'}</span>
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
                  
                  {/* 미세먼지 표정 오버레이 */}
                  {dustMood && (
                    <div 
                      className="dust-mood-overlay"
                      style={{
                        backgroundColor: dustMood.bgColor,
                        color: dustMood.color,
                        borderColor: dustMood.color
                      }}
                    >
                      <div className="mood-emoji">{dustMood.emoji}</div>
                      <div className="mood-text">{dustMood.text}</div>
                    </div>
                  )}
                </main>

                {/* 모바일에서 사이드바 오버레이 배경 */}
                {!isLaptop && isSidebarOpen && (
                  <div 
                    className="mobile-sidebar-backdrop" 
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                {/* 오른쪽 사이드바 - 데스크톱에서는 항상 표시, 모바일에서는 오버레이로 */}
                <aside className={`right-sidebar ${!isSidebarOpen ? 'collapsed' : ''} ${!isLaptop ? 'mobile-overlay' : ''}`}>
                      <div className="sidebar-header">
                        <h2>상세 정보</h2>
                        <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
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
            
            {/* 사이드바가 접혔을 때 보여줄 토글 버튼 - 데스크톱에서만 */}
            {isLaptop && !isSidebarOpen && (
              <button className="sidebar-toggle-expanded" onClick={() => setIsSidebarOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
  )
}
