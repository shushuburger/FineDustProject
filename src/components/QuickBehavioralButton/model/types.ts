export interface QuickBehavioralButtonProps {
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  buttonWidth?: number
  onClick: () => void
}

