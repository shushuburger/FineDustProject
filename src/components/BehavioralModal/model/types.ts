export interface BehavioralGuide {
  title: string
  content: string[]
  profileApplied: string[]
  priority: number
}

export interface BehavioralModalProps {
  isOpen: boolean
  guides: BehavioralGuide[]
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  onClose: () => void
}

