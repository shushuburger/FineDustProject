import type { MobileDustControlsProps } from '../model/types'
import { GRADE_BUTTONS, ACTUAL_VALUE_BUTTON } from '../model/constants'

export const MobileDustControls = ({
  isOpen,
  testPm10,
  onToggle,
  onClose,
  onTestPm10Change
}: MobileDustControlsProps) => {
  return (
    <>
      <button
        className="mobile-dust-control-toggle"
        onClick={onToggle}
        title="미세먼지 등급 조정"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="m296-80-56-56 240-240 240 240-56 56-184-184L296-80Zm184-504L240-824l56-56 184 184 184-184 56 56-240 240Z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="mobile-dust-control-panel">
          <div className="mobile-dust-control-header">
            <span>미세먼지 등급 조정</span>
            <button 
              className="mobile-dust-control-close"
              onClick={onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="mobile-dust-control-buttons">
            {GRADE_BUTTONS.map((btn) => (
              <button 
                key={btn.value}
                onClick={() => onTestPm10Change(btn.value)} 
                className={`mobile-dust-button ${testPm10 === btn.value ? 'active' : ''}`}
                style={{ background: btn.color }}
                title={btn.title}
              >
                {btn.label}
              </button>
            ))}
            <button 
              onClick={() => onTestPm10Change(ACTUAL_VALUE_BUTTON.value)} 
              className={`mobile-dust-button ${testPm10 === null ? 'active' : ''}`}
              style={{ background: ACTUAL_VALUE_BUTTON.color }}
              title={ACTUAL_VALUE_BUTTON.title}
            >
              {ACTUAL_VALUE_BUTTON.label}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

