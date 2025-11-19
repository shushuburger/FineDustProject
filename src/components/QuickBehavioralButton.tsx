interface QuickBehavioralButtonProps {
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  buttonWidth?: number
  onClick: () => void
}

export const QuickBehavioralButton = ({ dustMood, buttonWidth, onClick }: QuickBehavioralButtonProps) => {
  if (!dustMood) return null

  return (
    <button 
      className="quick-behavioral-button"
      onClick={onClick}
      title="프로필에 맞는 행동 방안 바로보기"
      style={{
        ...(buttonWidth ? { width: `${buttonWidth}px` } : {}),
        ...(dustMood ? {
          backgroundColor: dustMood.bgColor,
          color: dustMood.color,
          borderColor: dustMood.color
        } : {})
      }}
    >
      <span>행동 방안 바로보기</span>
    </button>
  )
}

