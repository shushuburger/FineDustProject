import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { ProfileCategory, UserProfile } from '@/shared/types/profile'
import profileCategories from '@/shared/assets/data/profileCategories.json'
import { Toast } from '@/shared/ui/Toast'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ProfileNameEditor } from '@/components/ProfileNameEditor'
import { ProfileCategoryCard } from '@/components/ProfileCategoryCard'
import { ProfileCategoryModal } from '@/components/ProfileCategoryModal'
import { ProfileCategoryList } from '@/components/ProfileCategoryList'
import { SaveButton } from '@/components/SaveButton'
import { loadSavedProfile } from '../model/utils'
import type { ProfileProps } from '../model/types'
import '../Profile.css'

export const Profile = ({ onNavigateToDashboard }: ProfileProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  
  const { userName: initialUserName, selectedOptions: initialOptions } = loadSavedProfile()
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions)
  const [userName, setUserName] = useState(initialUserName)
  const [isEditingName, setIsEditingName] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null)
  const [showToast, setShowToast] = useState(false)

  const handleOptionSelect = (category: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSave = () => {
    const profile: UserProfile = {
      ageGroup: selectedOptions['연령대'],
      child: selectedOptions['아이'],
      pet: selectedOptions['반려견'],
      health: selectedOptions['건강']
    }
    
    const profileData = {
      userName: userName,
      selectedOptions: selectedOptions,
      profile
    }
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    setShowToast(true)
    
    // 토스트 표시 후 대시보드로 이동
    setTimeout(() => {
      onNavigateToDashboard?.()
    }, 1500)
  }

  // 데스크톱 레이아웃
  if (!isMobile) {
    return (
      <>
        {showToast && <Toast message="프로필이 저장되었습니다!" type="success" onClose={() => setShowToast(false)} />}
        <div className="smart-home-profile">
          <ProfileHeader onNavigateToDashboard={onNavigateToDashboard} />

          <div className="profile-content-wrapper">
            {/* 커버 이미지 */}
            <div className="cover-image">
              <div className="cover-gradient"></div>
            </div>

            {/* 프로필 헤더 */}
            <div className="profile-header-section-simple">
              <div className="profile-avatar-large">
                <div className="avatar-circle-large"></div>
              </div>
              <ProfileNameEditor
                userName={userName}
                isEditing={isEditingName}
                onUserNameChange={setUserName}
                onEditStart={() => setIsEditingName(true)}
                onEditEnd={() => setIsEditingName(false)}
              />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="profile-content-grid">
              {/* 왼쪽 열 - 소개 */}
              <div className="profile-sidebar">
                <div className="info-card">
                  <h3>Introduction</h3>
                  <p>안녕하세요! 나에게 맞는 맞춤형 미세먼지 정보를 받아보세요. 프로필을 설정하여 더 정확한 정보를 제공받으실 수 있습니다.</p>
                </div>

                {/* 프로필 설정 섹션 */}
                {(profileCategories as ProfileCategory[]).map((category) => (
                  <ProfileCategoryCard
                    key={category.category}
                    category={category}
                    selectedValue={selectedOptions[category.category]}
                    onSelect={(value) => handleOptionSelect(category.category, value)}
                  />
                ))}
              </div>
            </div>

            <SaveButton onClick={handleSave} />
          </div>
        </div>
      </>
    )
  }

  // 모바일 레이아웃
  return (
    <>
      {showToast && <Toast message="프로필이 저장되었습니다!" type="success" onClose={() => setShowToast(false)} />}
      <div className="profile-page-mobile">
        <div className="profile-container-mobile">
          <ProfileHeader onNavigateToDashboard={onNavigateToDashboard} isMobile />

          {/* 프로필 사진 및 기본 정보 */}
          <div className="profile-header-mobile">
            <div className="profile-picture-wrapper">
              <div className="profile-picture-mobile"></div>
            </div>
            <ProfileNameEditor
              userName={userName}
              isEditing={isEditingName}
              onUserNameChange={setUserName}
              onEditStart={() => setIsEditingName(true)}
              onEditEnd={() => setIsEditingName(false)}
              isMobile
            />
          </div>

          <ProfileCategoryList
            categories={profileCategories as ProfileCategory[]}
            selectedOptions={selectedOptions}
            onCategoryClick={(category) => {
              setCurrentCategory(category)
              setModalOpen(true)
            }}
          />

          <ProfileCategoryModal
            isOpen={modalOpen}
            category={currentCategory}
            initialSelectedValue={selectedOptions[currentCategory?.category || ''] || ''}
            onClose={() => setModalOpen(false)}
            onConfirm={(category, value) => {
              handleOptionSelect(category, value)
              setModalOpen(false)
            }}
          />

          <SaveButton onClick={handleSave} isMobile />
        </div>
      </div>
    </>
  )
}

