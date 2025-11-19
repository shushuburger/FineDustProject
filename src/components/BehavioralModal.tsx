import { parseMessage, getExplanationTypeLabel } from '@/shared/utils/messageParser'

interface BehavioralGuide {
  title: string
  content: string[]
  profileApplied: string[]
  priority: number
}

interface BehavioralModalProps {
  isOpen: boolean
  guides: BehavioralGuide[]
  dustMood: { emoji: string; text: string; color: string; bgColor: string } | null
  onClose: () => void
}

export const BehavioralModal = ({ isOpen, guides, dustMood, onClose }: BehavioralModalProps) => {
  if (!isOpen) return null

  return (
    <div className="behavioral-modal-overlay" onClick={onClose}>
      <div className="behavioral-modal-content behavioral-modal-content-all" onClick={(e) => e.stopPropagation()}>
        <div 
          className="behavioral-modal-header"
          style={dustMood ? {
            backgroundColor: dustMood.bgColor,
            borderBottomColor: dustMood.color
          } : {}}
        >
          <div>
            <h2 className="behavioral-modal-title">전체 행동 방안</h2>
            <p className="behavioral-modal-subtitle">프로필에 맞는 행동 방안이 상단에 표시됩니다</p>
          </div>
          <button className="behavioral-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="behavioral-modal-body behavioral-modal-body-all">
          {guides.map((guide, guideIndex) => (
            <div 
              key={guideIndex} 
              className="behavioral-guide-section"
              style={guide.profileApplied.length > 0 && dustMood ? {
                background: `linear-gradient(135deg, ${dustMood.bgColor} 0%, #f8fafc 100%)`,
                borderColor: dustMood.color,
                borderWidth: '2px'
              } : {}}
            >
              <div className="behavioral-guide-header">
                <h3 
                  className="behavioral-guide-title"
                  style={guide.profileApplied.length > 0 && dustMood ? {
                    color: dustMood.color
                  } : {}}
                >
                  {guide.title}
                </h3>
                {guide.profileApplied.length > 0 && (
                  <div className="behavioral-modal-profile-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>프로필 반영: {guide.profileApplied.join(', ')}</span>
                  </div>
                )}
              </div>
              <div className="behavioral-guide-content">
                {guide.content.map((item, index) => {
                  const parsed = parseMessage(item)
                  
                  // 링크만 있는 경우
                  if (parsed.isLink && !parsed.action) {
                    return (
                      <p 
                        key={index} 
                        className="behavioral-modal-text"
                        style={dustMood ? { borderLeftColor: dustMood.color } : {}}
                      >
                        {parsed.linkUrl && (
                          <a 
                            href={parsed.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="behavioral-modal-link"
                            style={dustMood ? { color: dustMood.color } : {}}
                          >
                            {parsed.linkText}
                          </a>
                        )}
                      </p>
                    )
                  }
                  
                  // 일반 메시지 (action + explanation)
                  return (
                    <div 
                      key={index} 
                      className="behavioral-modal-text"
                      style={dustMood ? { borderLeftColor: dustMood.color } : {}}
                    >
                      <div className="behavioral-modal-action">{parsed.action}</div>
                      {parsed.isLink && parsed.linkUrl && (
                        <a 
                          href={parsed.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="behavioral-modal-link"
                          style={dustMood ? { color: dustMood.color } : {}}
                        >
                          {parsed.linkText}
                        </a>
                      )}
                      {parsed.explanation && parsed.explanationType && (
                        <>
                          <div className={`behavioral-modal-explanation-label behavioral-modal-explanation-label-${parsed.explanationType}`}>
                            {getExplanationTypeLabel(parsed.explanationType)}
                          </div>
                          <div className="behavioral-modal-explanation-text">{parsed.explanation}</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

