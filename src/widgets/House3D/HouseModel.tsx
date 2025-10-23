import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export const HouseModel = () => {
  const houseRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (houseRef.current) {
      // 부드러운 회전 애니메이션
      houseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group ref={houseRef}>
      {/* 집 기반 */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[6, 1, 4]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      
      {/* 1층 벽 */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* 2층 벽 */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* 지붕 */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      
      {/* 문 */}
      <mesh position={[0, 0.5, 1.51]} castShadow>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      
      {/* 창문들 */}
      <mesh position={[-1.5, 1.5, 1.51]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[1.5, 1.5, 1.51]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[-1, 3.5, 1.51]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[1, 3.5, 1.51]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* 발코니 */}
      <mesh position={[2.2, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 1.5]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      
      {/* 발코니 난간 */}
      <mesh position={[2.2, 3, 0.5]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      
      <mesh position={[2.2, 3, -0.5]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      
      <mesh position={[1.7, 3, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 1.5]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      
      <mesh position={[2.7, 3, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 1.5]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      
      {/* 수영장 */}
      <mesh position={[0, -0.3, -2.5]} receiveShadow>
        <boxGeometry args={[3, 0.4, 1.5]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.8} />
      </mesh>
      
      {/* 수영장 가장자리 */}
      <mesh position={[0, -0.1, -2.5]} castShadow>
        <boxGeometry args={[3.2, 0.2, 1.7]} />
        <meshStandardMaterial color="#0891b2" />
      </mesh>
      
      {/* 나무들 */}
      <mesh position={[-3, 0, 2]} castShadow>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      <mesh position={[3, 0, 2]} castShadow>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      <mesh position={[-3, 0, -2]} castShadow>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      <mesh position={[3, 0, -2]} castShadow>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  )
}
