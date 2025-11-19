import { useState, useEffect } from 'react'
import type { Application } from '@splinetool/runtime'
import behavioralGuidelines from '@/shared/assets/data/behavioral_guidelines.json'
import { getDustLevel } from './utils'
import { OBJECT_NAMES, MODAL_READY_DELAY } from './constants'

interface UseBehavioralModalProps {
  splineApp: Application | null
  isLoading: boolean
  nowSelectedObject: string
  pm10Value?: number
  userHealth?: string
  userAge?: string
  userChild?: string
  userPet?: string
}

export const useBehavioralModal = ({
  splineApp,
  isLoading,
  nowSelectedObject,
  pm10Value,
  userHealth,
  userAge,
  userChild,
  userPet
}: UseBehavioralModalProps) => {
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<string[]>([])
  const [modalTitle, setModalTitle] = useState('')
  const [modalProfileApplied, setModalProfileApplied] = useState<string[]>([])
  const [isReadyForModal, setIsReadyForModal] = useState(false)

  // 스플라인 로드 후 초기값 설정 및 모달 활성화
  useEffect(() => {
    if (!splineApp || isLoading) return

    const timer = setTimeout(() => {
      setIsReadyForModal(true)
    }, MODAL_READY_DELAY)

    return () => clearTimeout(timer)
  }, [splineApp, isLoading, nowSelectedObject])

  // nowSelectedObject가 변경되면 모달 표시
  useEffect(() => {
    if (!isReadyForModal || !splineApp) return

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
      
      setModalTitle(OBJECT_NAMES[nowSelectedObject] || nowSelectedObject)
      setModalContent(content)
      setModalProfileApplied(profileApplied)
      setShowModal(true)
    }
  }, [nowSelectedObject, isReadyForModal, splineApp, pm10Value, userHealth, userAge, userChild, userPet])

  const closeModal = () => {
    setShowModal(false)
  }

  return {
    showModal,
    modalContent,
    modalTitle,
    modalProfileApplied,
    isReadyForModal,
    closeModal
  }
}

