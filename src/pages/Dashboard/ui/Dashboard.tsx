import { House3D } from '@/widgets/House3D'
import { ProfileInfo } from '@/widgets/ProfileInfo'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react'
import { getPM10Grade } from '@/shared/api/dustApi'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { ProfileModal } from '@/components/ProfileModal'
import { BehavioralModal } from '@/components/BehavioralModal'
import { MobileDustControls } from '@/components/MobileDustControls'
import { DustMoodOverlay } from '@/components/DustMoodOverlay'
import { QuickBehavioralButton } from '@/components/QuickBehavioralButton'
import { useDashboardData, useUserProfile, useBehavioralGuides } from '../model/hooks'
import { getDustMood, getMissionPriority, getRandomMissions, getTodayDateString } from '../model/utils'
import type { DashboardProps, BehavioralGuide } from '../model/types'
import todoListData from '@/shared/assets/data/todoList.json'
import '../Dashboard.css'

export const Dashboard = ({ onNavigateToProfile }: DashboardProps) => {
  const isLaptop = useMediaQuery({ minWidth: 1024 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showBehavioralModal, setShowBehavioralModal] = useState(false)
  const [behavioralModalGuides, setBehavioralModalGuides] = useState<BehavioralGuide[]>([])
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined)
  const [showMobileDustControls, setShowMobileDustControls] = useState(false)

  const {
    dustData,
    locationInfo,
    isLoading,
    error,
    currentTime,
    currentDate,
    calendarDates,
    dustMood,
    randomMissions,
    testPm10,
    userProfile,
    setDustMood,
    setRandomMissions,
    setTestPm10,
    setUserProfile
  } = useDashboardData()

  const {
    userProfile: profileState,
    showProfileModal,
    setShowProfileModal
  } = useUserProfile()

  // 프로필 상태 동기화
  useEffect(() => {
    if (profileState) {
      setUserProfile(profileState)
    }
  }, [profileState, setUserProfile])

  const { getAllBehavioralGuides } = useBehavioralGuides(testPm10, dustData, userProfile || profileState)

  // 프로필 저장 감지 및 미션 업데이트
  useEffect(() => {
    const checkProfileAndUpdateMissions = () => {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
          setUserProfile(profile)
          setShowProfileModal(false)
          
          // 프로필이 변경되면 미션을 다시 선택 (프로필 반영)
          const todayDate = getTodayDateString()
          const newMissions = getRandomMissions(
            todoListData.realLifeActions,
            5,
            todayDate,
            profile.profile
          )
          setRandomMissions(newMissions)
          localStorage.setItem('dailyMissions', JSON.stringify({ date: todayDate, missions: newMissions }))
        } catch (error) {
          console.error('프로필 정보 파싱 오류:', error)
        }
      }
    }

    // 초기 로딩
    checkProfileAndUpdateMissions()

    // storage 이벤트 리스너 추가 (다른 탭에서 변경 감지)
    window.addEventListener('storage', checkProfileAndUpdateMissions)

    // 주기적으로 체크 (같은 탭에서 변경 감지)
    const interval = setInterval(checkProfileAndUpdateMissions, 500)
    
    return () => {
      window.removeEventListener('storage', checkProfileAndUpdateMissions)
      clearInterval(interval)
    }
  }, [setUserProfile, setShowProfileModal, setRandomMissions])

  // 테스트용 PM10 값이 변경될 때 dustMood 업데이트
  useEffect(() => {
    if (testPm10 !== null) {
      const pm10Grade = getPM10Grade(testPm10)
      const mood = getDustMood(pm10Grade)
      setDustMood(mood)
    } else if (dustData?.PM10 !== undefined) {
      const pm10Grade = getPM10Grade(dustData.PM10)
      const mood = getDustMood(pm10Grade)
      setDustMood(mood)
    }
  }, [testPm10, dustData, setDustMood])

  // 행동 방안 바로보기 버튼 클릭 핸들러
  const handleShowBehavioralGuide = () => {
    const guides = getAllBehavioralGuides()
    setBehavioralModalGuides(guides)
    setShowBehavioralModal(true)
  }

  return (
    <>
      {/* 프로필 설정 모달 */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onNavigateToProfile={onNavigateToProfile}
      />

      <div className={`smart-home-dashboard ${!isLaptop ? 'mobile-layout' : ''}`}>
        <DashboardHeader
          locationInfo={locationInfo}
          dustMood={dustMood}
          isLaptop={isLaptop}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateToProfile={onNavigateToProfile}
          onTestPm10Change={setTestPm10}
        />

        <div className="dashboard-content">
          {/* 중앙 메인 콘텐츠 */}
          <main className="main-content">
            <House3D 
              pm10Value={testPm10 ?? dustData?.PM10}
              userHealth={userProfile?.profile?.health}
              userAge={userProfile?.profile?.ageGroup}
              userChild={userProfile?.profile?.child}
              userPet={userProfile?.profile?.pet}
            />
            
            {/* 미세먼지 표정 오버레이 및 행동 방안 버튼 컨테이너 */}
            <div className="mood-and-button-container">
              <DustMoodOverlay 
                dustMood={dustMood}
                onWidthChange={(width) => {
                  if (userProfile?.profile && width !== buttonWidth) {
                    setButtonWidth(width)
                  }
                }}
              />
              {userProfile?.profile && (
                <QuickBehavioralButton
                  dustMood={dustMood}
                  buttonWidth={buttonWidth}
                  onClick={handleShowBehavioralGuide}
                />
              )}
            </div>

            {/* 모바일 프로필 정보 오버레이 */}
            {!isLaptop && (
              <div className="profile-overlay-mobile">
                <ProfileInfo 
                  profile={userProfile?.profile}
                  onEditClick={onNavigateToProfile}
                />
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

          <DashboardSidebar
            isOpen={isSidebarOpen}
            isLaptop={isLaptop}
            onClose={() => setIsSidebarOpen(false)}
            dustData={dustData}
            locationInfo={locationInfo}
            currentTime={currentTime}
            isLoading={isLoading}
            error={error}
            userProfile={userProfile}
            onNavigateToProfile={onNavigateToProfile}
            currentDate={currentDate}
            calendarDates={calendarDates}
            randomMissions={randomMissions}
            getMissionPriority={getMissionPriority}
          />
      
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

      {!isLaptop && (
        <MobileDustControls
          isOpen={showMobileDustControls}
          testPm10={testPm10}
          onToggle={() => setShowMobileDustControls(!showMobileDustControls)}
          onClose={() => setShowMobileDustControls(false)}
          onTestPm10Change={setTestPm10}
        />
      )}

      <BehavioralModal
        isOpen={showBehavioralModal}
        guides={behavioralModalGuides}
        dustMood={dustMood}
        onClose={() => setShowBehavioralModal(false)}
      />
    </>
  )
}

