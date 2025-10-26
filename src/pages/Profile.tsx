import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { ProfileCategory, UserProfile } from '@/shared/types/profile'
import profileCategories from '@/assets/data/profileCategories.json'
import './Profile.css'

interface ProfileProps {
  onNavigateToDashboard?: () => void
}

export const Profile = ({ onNavigateToDashboard }: ProfileProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [userName, setUserName] = useState('Shopia W.')
  const [isEditingName, setIsEditingName] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<ProfileCategory | null>(null)
  const [tempSelected, setTempSelected] = useState<string>('')

  const handleOptionSelect = (category: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSave = () => {
    const newProfile: UserProfile = {
      ageGroup: selectedOptions['연령대'],
      child: selectedOptions['아이'],
      pet: selectedOptions['반려견'],
      health: selectedOptions['건강']
    }
    localStorage.setItem('userProfile', JSON.stringify(newProfile))
    alert('프로필이 저장되었습니다!')
    onNavigateToDashboard?.()
  }

  // 데스크톱 레이아웃
  if (!isMobile) {
    return (
      <div className="smart-home-profile">
        {/* 상단 헤더 */}
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
            <div className="profile-name-edit">
              {isEditingName ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="name-edit-input"
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingName(false)
                    }
                  }}
                />
              ) : (
                <h1 className="profile-name-only" onClick={() => setIsEditingName(true)} style={{ cursor: 'pointer' }}>
                  {userName}
                  <button className="edit-name-button" onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </h1>
              )}
            </div>
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
                <div key={category.category} className="profile-category-card">
                  <h3 className="category-title">{category.category}</h3>
                  <div className="category-options">
                    {category.options.map((option) => {
                      const isSelected = selectedOptions[category.category] === option.value
                      return (
                        <button
                          key={option.value}
                          className={`option-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleOptionSelect(category.category, option.value)}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="save-section">
            <button className="save-button-large" onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 모바일 레이아웃
  return (
    <div className="profile-page-mobile">
      <div className="profile-container-mobile">
        {/* 백 버튼 */}
        <button className="back-button-mobile" onClick={onNavigateToDashboard}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 프로필 사진 및 기본 정보 */}
        <div className="profile-header-mobile">
          <div className="profile-picture-wrapper">
            <div className="profile-picture-mobile"></div>
           </div>
           <div className="mobile-name-edit">
             {isEditingName ? (
               <input
                 type="text"
                 value={userName}
                 onChange={(e) => setUserName(e.target.value)}
                 className="mobile-name-input"
                 autoFocus
                 onBlur={() => setIsEditingName(false)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     setIsEditingName(false)
                   }
                 }}
               />
             ) : (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                 <h1 className="user-name-mobile">{userName}</h1>
                 <button className="edit-name-button-mobile" onClick={() => setIsEditingName(true)}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                     <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </button>
               </div>
             )}
           </div>
         </div>

        {/* 카테고리 섹션 */}
        <div className="profile-categories-mobile">
          {(profileCategories as ProfileCategory[]).map((category) => {
            const selectedOption = category.options.find(opt => opt.value === selectedOptions[category.category])
            return (
              <div key={category.category} className="category-item-mobile">
                <button 
                  className="category-header-mobile"
                  onClick={() => {
                    setCurrentCategory(category)
                    setTempSelected(selectedOptions[category.category] || '')
                    setModalOpen(true)
                  }}
                >
                  <div className="category-header-left">
                    <h3 className="category-title-mobile">{category.category}</h3>
                    {selectedOption && (
                      <span className="category-selected-mobile">{selectedOption.label}</span>
                    )}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        {/* 모달 */}
        {modalOpen && currentCategory && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{currentCategory.category} 선택</h2>
                <button className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="modal-options">
                {currentCategory.options.map((option) => {
                  const isSelected = tempSelected === option.value
                  return (
                    <button
                      key={option.value}
                      className={`modal-option-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => setTempSelected(option.value)}
                    >
                      <div className="modal-option-label">{option.label}</div>
                      <div className="modal-option-recommendation">{option.recommendation}</div>
                    </button>
                  )
                })}
              </div>

              <div className="modal-actions">
                <button className="modal-confirm-button" onClick={() => {
                  handleOptionSelect(currentCategory.category, tempSelected)
                  setModalOpen(false)
                }}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 저장 버튼 */}
        <div className="mobile-actions">
          <button className="save-button-mobile" onClick={handleSave}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  )
}

