import Spline from '@splinetool/react-spline'
import { useState, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { Application } from '@splinetool/runtime'
import behavioralGuidelines from '@/assets/data/behavioral_guidelines.json'
import './House3D.css'

interface House3DProps {
  pm10Value?: number
}

export const House3D = ({ pm10Value }: House3DProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1.5)
  const [splineApp, setSplineApp] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<string[]>([])
  const [modalTitle, setModalTitle] = useState('')
  const [isReadyForModal, setIsReadyForModal] = useState(false)
  const isLaptop = useMediaQuery({ minWidth: 1024 })
  const prevObjectRef = useRef<string | null>(null)
  const firstChangeSkippedRef = useRef(false)

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

    // 1초 후 현재 값을 초기값으로 설정하고 모달 활성화
    const timer = setTimeout(() => {
      try {
        const value = splineApp.getVariable('nowObject')
        if (value !== undefined) {
          prevObjectRef.current = String(value)
        } else {
          prevObjectRef.current = 'none'
        }
        setIsReadyForModal(true)
        firstChangeSkippedRef.current = false // 초기화 시 리셋
      } catch (error) {
        prevObjectRef.current = 'none'
        setIsReadyForModal(true)
        firstChangeSkippedRef.current = false
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [splineApp, isLoading])

  // Spline 변수 변화 감지 및 모달 표시
  useEffect(() => {
    if (!splineApp || !isReadyForModal) return

    const interval = setInterval(() => {
      try {
        const value = splineApp.getVariable('nowObject')
        if (value !== undefined) {
          const objectName = String(value)
          const prevObject = prevObjectRef.current
          
          // 값이 실제로 바뀌었을 때
          if (objectName !== prevObject) {
            // 첫 번째 변화는 무시 (초기 설정으로 인한 변화)
            if (!firstChangeSkippedRef.current) {
              firstChangeSkippedRef.current = true
              prevObjectRef.current = objectName
              return
            }
            
            // 현재 값이 'none'이 아니고, 행동 방안 데이터에 해당하는 요소일 때 모달 표시
            if (objectName !== 'none' && behavioralGuidelines.guides[objectName as keyof typeof behavioralGuidelines.guides]) {
              const dustLevel = getDustLevel(pm10Value)
              const guide = behavioralGuidelines.guides[objectName as keyof typeof behavioralGuidelines.guides]
              const content = guide[dustLevel]
              
              // 객체 이름을 한글로 변환
              const objectNames: Record<string, string> = {
                window: '창문',
                dog: '반려견',
                plants: '식물',
                sofa: '가구',
                light: '조명',
                stove: '가스레인지',
                sink: '싱크대',
                fan: '공기청정기',
                door: '출입문',
                refrigeator: '냉장고',
                floor: '바닥',
                smoking_area: '흡연 부스',
                entrance: '현관'
              }
              
              setModalTitle(objectNames[objectName] || objectName)
              setModalContent(content)
              setShowModal(true)
            }
            
            // 이전 값 업데이트
            prevObjectRef.current = objectName
          }
        }
      } catch (error) {
        // 변수 읽기 실패는 무시
      }
    }, 500)

    return () => clearInterval(interval)
  }, [splineApp, pm10Value, isReadyForModal])

  const handleSplineLoad = (app: Application) => {
    setSplineApp(app)
    setIsLoading(false)
  }


  return (
    <main className={`house-3d-main ${!isLaptop ? 'mobile-layout' : ''}`}>
      <div className="house-3d-container">
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
          scene="https://prod.spline.design/yngEEta52QDzGews/scene.splinecode"
          style={{ 
            width: `${zoomLevel * 100}%`, 
            height: `${zoomLevel * 100}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onLoad={handleSplineLoad}
          onError={(error) => {
            console.error('❌ Spline loading error:', error)
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
        <div className="behavioral-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="behavioral-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="behavioral-modal-header">
              <h2 className="behavioral-modal-title">{modalTitle}</h2>
              <button className="behavioral-modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="behavioral-modal-body">
              {modalContent.map((item, index) => (
                <p key={index} className="behavioral-modal-text">{item}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
