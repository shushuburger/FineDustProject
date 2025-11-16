import Spline from '@splinetool/react-spline'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { Application } from '@splinetool/runtime'
import behavioralGuidelines from '@/assets/data/behavioral_guidelines.json'
import './House3D.css'

interface House3DProps {
  pm10Value?: number
  userHealth?: string
  userAge?: string
  userChild?: string
  userPet?: string
}

export const House3D = ({ pm10Value, userHealth, userAge, userChild, userPet }: House3DProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1.5)
  const [splineApp, setSplineApp] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<string[]>([])
  const [modalTitle, setModalTitle] = useState('')
  const [modalProfileApplied, setModalProfileApplied] = useState<string[]>([])
  const [isReadyForModal, setIsReadyForModal] = useState(false)
  const [nowSelectedObject, setNowSelectedObject] = useState<string>('none') // 현재 선택된 요소
  const isLaptop = useMediaQuery({ minWidth: 1024 })

  // PM10 값에 따라 행동 방안 등급 결정
  const getDustLevel = (pm10?: number): 'good' | 'moderate' | 'bad' | 'very_bad' => {
    if (!pm10) return 'moderate'
    if (pm10 <= 30) return 'good'
    if (pm10 <= 80) return 'moderate'
    if (pm10 <= 150) return 'bad'
    return 'very_bad'
  }

  // 스플라인 로드 후 초기값 설정 및 모달 활성화
  useEffect(() => {
    if (!splineApp || isLoading) return

    // 1초 후 모달 활성화 (초기값은 이미 'none'으로 설정됨)
    const timer = setTimeout(() => {
      setIsReadyForModal(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [splineApp, isLoading, nowSelectedObject])

  // nowSelectedObject가 변경되면 모달 표시
  useEffect(() => {
    if (!isReadyForModal || !splineApp) return

    // nowSelectedObject가 'none'이 아니고, 행동 방안 데이터에 해당하는 요소일 때 모달 표시
    if (nowSelectedObject !== 'none' && behavioralGuidelines.guides[nowSelectedObject as keyof typeof behavioralGuidelines.guides]) {
      const dustLevel = getDustLevel(pm10Value)
      const guide = behavioralGuidelines.guides[nowSelectedObject as keyof typeof behavioralGuidelines.guides]
      let content = [...guide.baseMessages[dustLevel]]
      const profileApplied: string[] = []
      
      // 조건부 메시지 추가
      if ('conditionalMessages' in guide && guide.conditionalMessages) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const conditionalMsgs = guide.conditionalMessages as any
        
        // 건강 상태 확인
        if (userHealth && conditionalMsgs[`health_${userHealth}`]) {
          const healthMsg = conditionalMsgs[`health_${userHealth}`]
          if (healthMsg[dustLevel]) {
            content = [...content, ...healthMsg[dustLevel]]
            profileApplied.push('건강 상태')
          }
        }
        
        // 반려견 확인
        if (userPet === 'dog' && conditionalMsgs.pet_dog) {
          const petMsg = conditionalMsgs.pet_dog
          if (petMsg[dustLevel]) {
            content = [...content, ...petMsg[dustLevel]]
            profileApplied.push('반려동물')
          }
        }
        
        // 연령대 확인
        if (userAge) {
          // senior를 elderly로 매핑
          const ageKey = userAge === 'senior' ? 'age_elderly' : `age_${userAge}`
          if (conditionalMsgs[ageKey]) {
            const ageMsg = conditionalMsgs[ageKey]
            if (ageMsg[dustLevel]) {
              content = [...content, ...ageMsg[dustLevel]]
              profileApplied.push('연령대')
            }
          }
        }
        
        // 아이 확인
        if (userChild && userChild !== 'none' && conditionalMsgs.child) {
          const childMsg = conditionalMsgs.child
          if (childMsg[dustLevel]) {
            content = [...content, ...childMsg[dustLevel]]
            profileApplied.push('아이')
          }
        }
      }
      
      // 객체 이름을 한글로 변환
      const objectNames: Record<string, string> = {
        window: '창문',
        dog: '반려견',
        plants: '식물',
        sofa: '가구',
        light: '조명',
        stove: '가스레인지',
        sink: '세면대',
        fan: '공기청정기',
        door: '출입문',
        refrigeator: '냉장고',
        clean: '청소'
      }
      
      setModalTitle(objectNames[nowSelectedObject] || nowSelectedObject)
      setModalContent(content)
      setModalProfileApplied(profileApplied)
      setShowModal(true)
    }
  }, [nowSelectedObject, isReadyForModal, splineApp, pm10Value, userHealth, userAge, userChild, userPet])

  const handleSplineLoad = (app: Application) => {
    setSplineApp(app)
    setIsLoading(false)
  }


  return (
    <main className={`house-3d-main ${!isLaptop ? 'mobile-layout' : ''}`}>
      <div 
        className="house-3d-container"
        onClick={() => {
          // Spline 영역 클릭 시 nowObject 변수 값을 가져와서 nowSelectedObject에 저장
          if (splineApp && isReadyForModal) {
            try {
              const value = splineApp.getVariable('nowObject')
              if (value !== undefined) {
                const objectName = String(value)
                setNowSelectedObject(objectName)
              } else {
                setNowSelectedObject('none')
              }
            } catch {
              setNowSelectedObject('none')
            }
          }
        }}
      >
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>3D 모델 로딩 중...</p>
          </div>
        )}
        
        {hasError && (
          <div className="error-overlay">
            <p>3D 모델을 불러올 수 없습니다.</p>
            <button onClick={() => window.location.reload()}>새로고침</button>
          </div>
        )}
        
        <Spline
          scene="https://prod.spline.design/LZVviCy6ekslUYeT/scene.splinecode"
          style={{ 
            width: `${zoomLevel * 100}%`, 
            height: `${zoomLevel * 100}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onLoad={handleSplineLoad}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
        
        {isLaptop && (
          <div className="controls-info">
            <div className="zoom-control">
              <label htmlFor="zoom-slider">Zoom: {Math.round(zoomLevel * 100)}%</label>
              <input
                id="zoom-slider"
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="zoom-slider"
              />
            </div>
            <div className="control-item">
              <span className="control-key">WASD</span>
              <span className="control-desc">이동</span>
            </div>
            <div className="control-item">
              <span className="control-key">방향키</span>
              <span className="control-desc">화면 회전</span>
            </div>
          </div>
        )}
      </div>

      {/* 행동 방안 모달 */}
      {showModal && (
        <div className="behavioral-modal-overlay" onClick={() => {
          setShowModal(false)
          // 모달을 닫으면 nowSelectedObject를 none으로 설정
          setNowSelectedObject('none')
        }}>
          <div className="behavioral-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="behavioral-modal-header">
              <div>
                <h2 className="behavioral-modal-title">{modalTitle}</h2>
                {modalProfileApplied.length > 0 && (
                  <div className="behavioral-modal-profile-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>프로필 반영: {modalProfileApplied.join(', ')}</span>
                  </div>
                )}
              </div>
              <button className="behavioral-modal-close" onClick={() => {
                setShowModal(false)
                // 모달을 닫으면 nowSelectedObject를 none으로 설정
                setNowSelectedObject('none')
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="behavioral-modal-body">
              {modalContent.map((item, index) => {
                // 링크가 있는지 확인하고 파싱
                if (item.includes('구매 링크:')) {
                  const parts = item.split('구매 링크:')
                  const text = parts[0].trim()
                  const url = parts[1]?.trim()
                  const displayText = text.includes('마스크') ? '마스크 사러 가기' : 
                                     text.includes('필터') ? '공기청정기 필터 사러 가기' :
                                     text.includes('코 세척') ? '코 세척 식염수 사러 가기' :
                                     text.includes('진공') ? 'HEPA 진공청소기 사러 가기' :
                                     text.includes('식물') ? '반려식물 사러 가기' : '구매 링크'
                  
                  return (
                    <p key={index} className="behavioral-modal-text">
                      {text && <span>{text}</span>}
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="behavioral-modal-link">
                          {displayText}
                        </a>
                      )}
                    </p>
                  )
                }
                
                // 정보 링크 처리 (질병관리청, 대한천식알레르기학회 등)
                if (item.includes(' 정보:') || item.startsWith('질병관리청') || item.startsWith('대한천식')) {
                  const parts = item.split(' 정보:')
                  const url = parts[1]?.trim()
                  const displayText = item.includes('질병관리청') ? '질병관리청 바로가기' :
                                     item.includes('대한천식') ? '대한천식알레르기학회 바로가기' : '바로가기'
                  
                  return (
                    <p key={index} className="behavioral-modal-text">
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="behavioral-modal-link">
                          {displayText}
                        </a>
                      )}
                    </p>
                  )
                }
                
                return <p key={index} className="behavioral-modal-text">{item}</p>
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
