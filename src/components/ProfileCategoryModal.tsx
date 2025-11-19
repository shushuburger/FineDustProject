import { useState, useEffect } from 'react'
import type { ProfileCategory } from '@/shared/types/profile'

interface ProfileCategoryModalProps {
  isOpen: boolean
  category: ProfileCategory | null
  initialSelectedValue: string
  onClose: () => void
  onConfirm: (category: string, value: string) => void
}

export const ProfileCategoryModal = ({
  isOpen,
  category,
  initialSelectedValue,
  onClose,
  onConfirm
}: ProfileCategoryModalProps) => {
  const [tempSelected, setTempSelected] = useState(initialSelectedValue)

  useEffect(() => {
    if (isOpen) {
      setTempSelected(initialSelectedValue)
    }
  }, [isOpen, initialSelectedValue])

  if (!isOpen || !category) return null

  const handleConfirm = () => {
    onConfirm(category.category, tempSelected)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{category.category} 선택</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-options">
          {category.options.map((option) => {
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
          <button className="modal-confirm-button" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

