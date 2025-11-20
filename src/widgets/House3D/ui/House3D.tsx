import Spline from '@splinetool/react-spline'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { Application } from '@splinetool/runtime'
import { parseMessage, getExplanationTypeLabel } from '@/shared/utils/messageParser'
import { useBehavioralModal } from '../model/hooks'
import { getDustColor, getDustBgColor } from '../model/utils'
import { SPLINE_SCENE_URL } from '../model/constants'
import type { House3DProps } from '../model/types'
import './House3D.css'

export const House3D = ({ pm10Value, userHealth, userAge, userChild, userPet }: House3DProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1.5)
  const [splineApp, setSplineApp] = useState<Application | null>(null)
  const [nowSelectedObject, setNowSelectedObject] = useState<string>('none')
  const isLaptop = useMediaQuery({ minWidth: 1024 })

  const {
    showModal,
    modalContent,
    modalTitle,
    modalProfileApplied,
    isReadyForModal,
    closeModal
  } = useBehavioralModal({
    splineApp,
    isLoading,
    nowSelectedObject,
    pm10Value,
    userHealth,
    userAge,
    userChild,
    userPet
  })

  const handleSplineLoad = (app: Application) => {
    setSplineApp(app)
    setIsLoading(false)
  }

  const handleContainerClick = () => {
    if (splineApp && isReadyForModal) {
      try {
        const value = splineApp.getVariable('nowObject')
        console.log('nowObject:', value)
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
  }

  const handleModalClose = () => {
    closeModal()
    setNowSelectedObject('none')
  }

  return (
    <main className={`house-3d-main ${!isLaptop ? 'mobile-layout' : ''}`}>
      <div 
        className="house-3d-container"
        onClick={handleContainerClick}
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
          scene={SPLINE_SCENE_URL}
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
        <div className="behavioral-modal-overlay" onClick={handleModalClose}>
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
              <button className="behavioral-modal-close" onClick={handleModalClose}>
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

