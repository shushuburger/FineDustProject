import Spline from '@splinetool/react-spline'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import './House3D.css'

export const House3D = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const isLaptop = useMediaQuery({ minWidth: 1024 })


  return (
    <main className="house-3d-main">
      <div className="content-header">
        <h1>Home</h1>
        <h2>Backyard</h2>
      </div>
      
      <div className="tabs">
        <button className="tab active">
          <span className="tab-number">1</span>
          <span className="tab-label">Flow</span>
        </button>
        <button className="tab">
          <span className="tab-number">2</span>
          <span className="tab-label">Flow</span>
        </button>
        <button className="tab">
          <span className="tab-label">Garage</span>
        </button>
      </div>
      
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
          style={{ width: '100%', height: '100%' }}
          onLoad={() => {
            console.log('Spline scene loaded successfully')
            setIsLoading(false)
          }}
          onError={(error) => {
            console.error('Spline loading error:', error)
            setHasError(true)
            setIsLoading(false)
          }}
        />
        
        {isLaptop && (
          <div className="controls-info">
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
    </main>
  )
}
