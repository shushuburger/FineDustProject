interface MobileDustControlsProps {
  isOpen: boolean
  testPm10: number | null
  onToggle: () => void
  onClose: () => void
  onTestPm10Change: (value: number | null) => void
}

export const MobileDustControls = ({
  isOpen,
  testPm10,
  onToggle,
  onClose,
  onTestPm10Change
}: MobileDustControlsProps) => {
  const gradeButtons = [
    { value: 10, label: '매우 좋음', color: '#4285F4', title: '매우 좋음 (0-15)' },
    { value: 20, label: '좋음', color: '#1976D2', title: '좋음 (16-30)' },
    { value: 40, label: '양호', color: '#22B14C', title: '양호 (31-55)' },
    { value: 70, label: '보통', color: '#B5E61D', title: '보통 (56-80)' },
    { value: 100, label: '주의', color: '#FFD400', title: '주의 (81-115)' },
    { value: 130, label: '나쁨', color: '#FF7F27', title: '나쁨 (116-150)' },
    { value: 200, label: '매우 나쁨', color: '#F52020', title: '매우 나쁨 (151+)' }
  ]

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
            {gradeButtons.map((btn) => (
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
              onClick={() => onTestPm10Change(null)} 
              className={`mobile-dust-button ${testPm10 === null ? 'active' : ''}`}
              style={{ background: '#64748b' }}
              title="실제 데이터 사용"
            >
              실제값
            </button>
          </div>
        </div>
      )}
    </>
  )
}

