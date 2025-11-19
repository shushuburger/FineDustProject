interface SaveButtonProps {
  onClick: () => void
  isMobile?: boolean
}

export const SaveButton = ({ onClick, isMobile }: SaveButtonProps) => {
  if (isMobile) {
    return (
      <div className="mobile-actions">
        <button className="save-button-mobile" onClick={onClick}>
          저장하기
        </button>
      </div>
    )
  }

  return (
    <div className="save-section">
      <button className="save-button-large" onClick={onClick}>
        저장하기
      </button>
    </div>
  )
}

