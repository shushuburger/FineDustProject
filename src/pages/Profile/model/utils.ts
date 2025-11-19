// localStorage에서 저장된 데이터 불러오기
export const loadSavedProfile = () => {
  try {
    const saved = localStorage.getItem('userProfile')
    if (saved) {
      const profile = JSON.parse(saved)
      return {
        userName: profile.userName || 'Shopia W.',
        selectedOptions: profile.selectedOptions || {}
      }
    }
  } catch (error) {
    console.error('프로필 로드 실패:', error)
  }
  return { userName: 'Shopia W.', selectedOptions: {} }
}

