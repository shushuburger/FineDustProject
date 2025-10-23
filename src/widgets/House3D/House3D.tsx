import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { HouseModel } from './HouseModel'
import { OverlayIcons } from './OverlayIcons'
import './House3D.css'

export const House3D = () => {
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
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          shadows
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Environment preset="sunset" />
          
          <HouseModel />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Canvas>
        
        <OverlayIcons />
        
        <div className="view-control">
          <button className="view-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  )
}
