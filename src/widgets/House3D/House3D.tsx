import Spline from '@splinetool/react-spline'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { Application } from '@splinetool/runtime'
import behavioralGuidelines from '@/assets/data/behavioral_guidelines.json'
import { getPM10Grade } from '@/shared/api/dustApi'
import type { DustGrade } from '@/shared/types/api'
import { parseMessage, getExplanationTypeLabel } from '@/shared/utils/messageParser'
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

  // 미세먼지 등급에 따른 색상 가져오기
  const getDustColor = (pm10?: number): string => {
    if (!pm10) return '#10b981'
    const grade = getPM10Grade(pm10)
    const colorMap: Record<DustGrade, string> = {
      '매우 좋음': '#4285F4',
      '좋음': '#1976D2',
      '양호': '#22B14C',
      '보통': '#B5E61D',
      '주의': '#FFD400',
      '나쁨': '#FF7F27',
      '매우 나쁨': '#F52020'
    }
    return colorMap[grade] || '#10b981'
  }

  // 미세먼지 등급에 따른 배경색 가져오기
  const getDustBgColor = (pm10?: number): string => {
    if (!pm10) return '#E3F2FD'
    const grade = getPM10Grade(pm10)
    const bgColorMap: Record<DustGrade, string> = {
      '매우 좋음': '#D0E8F2',
      '좋음': '#E3F2FD',
      '양호': '#F1F8E9',
      '보통': '#FFF8E1',
      '주의': '#FFF3E0',
      '나쁨': '#FFEBEE',
      '매우 나쁨': '#FCE4EC'
    }
    return bgColorMap[grade] || '#E3F2FD'
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
        plant: '식물',
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
            <div 
              className="behavioral-modal-header"
              style={{
                backgroundColor: getDustBgColor(pm10Value),
                borderBottomColor: getDustColor(pm10Value)
              }}
            >
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
                const parsed = parseMessage(item)
                
                // 링크만 있는 경우
                if (parsed.isLink && !parsed.action) {
                  return (
                    <p 
                      key={index} 
                      className="behavioral-modal-text"
                      style={{ borderLeftColor: getDustColor(pm10Value) }}
                    >
                      {parsed.linkUrl && (
                        <a 
                          href={parsed.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="behavioral-modal-link"
                          style={{ color: getDustColor(pm10Value) }}
                        >
                          {parsed.linkText}
                        </a>
                      )}
                    </p>
                  )
                }
                
                // 일반 메시지 (action + explanation)
                return (
                  <div 
                    key={index} 
                    className="behavioral-modal-text"
                    style={{ borderLeftColor: getDustColor(pm10Value) }}
                  >
                    <div className="behavioral-modal-action">{parsed.action}</div>
                    {parsed.isLink && parsed.linkUrl && (
                      <a 
                        href={parsed.linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="behavioral-modal-link"
                        style={{ color: getDustColor(pm10Value) }}
                      >
                        {parsed.linkText}
                      </a>
                    )}
                    {parsed.explanation && parsed.explanationType && (
                      <>
                        <div className={`behavioral-modal-explanation-label behavioral-modal-explanation-label-${parsed.explanationType}`}>
                          {getExplanationTypeLabel(parsed.explanationType)}
                        </div>
                        <div className="behavioral-modal-explanation-text">{parsed.explanation}</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
