export interface DustMoodOverlayProps {
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  onWidthChange?: (width: number) => void
}

