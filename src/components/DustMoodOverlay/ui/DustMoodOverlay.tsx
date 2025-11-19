import type { DustMoodOverlayProps } from '../model/types'

export const DustMoodOverlay = ({ dustMood, onWidthChange }: DustMoodOverlayProps) => {
  if (!dustMood) return null

  return (
    <div 
      ref={(el) => {
        if (el && onWidthChange) {
          const width = el.offsetWidth
          onWidthChange(width)
        }
      }}
      className="dust-mood-overlay"
      style={{
        backgroundColor: dustMood.bgColor,
        color: dustMood.color,
        borderColor: dustMood.color
      }}
    >
      <div className="mood-emoji">{dustMood.emoji}</div>
      <div className="mood-text">{dustMood.text}</div>
    </div>
  )
}

