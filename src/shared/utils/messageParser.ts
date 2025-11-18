/**
 * 행동 방안 메시지를 파싱하여 action과 explanation을 분리하고,
 * explanationType을 자동 감지하는 유틸리티
 */

export type ExplanationType = 
  | 'purpose'      // 목적/효과
  | 'evidence'     // 근거/과학적 설명
  | 'mechanism'    // 작동 메커니즘
  | 'warning'       // 주의사항/위험

export interface ParsedMessage {
  action: string
  explanation?: string
  explanationType?: ExplanationType
  isLink?: boolean
  linkUrl?: string
  linkText?: string
}

/**
 * 설명문의 타입을 자동 감지
 */
function detectExplanationType(explanation: string): ExplanationType {
  const text = explanation
  
  // 근거/과학적 설명
  if (text.includes('근거') || text.includes('권장됨') || text.includes('초래할 수 있음') || 
      text.includes('유발함') || text.includes('유발할 수 있음') || text.includes('악화') ||
      text.includes('저하') || text.includes('감소') || text.includes('증가')) {
    return 'evidence'
  }
  
  // 주의사항/위험
  if (text.includes('위험') || text.includes('부작용') || text.includes('피하세요') || 
      text.includes('금지') || text.includes('치명적') || text.includes('재비산') ||
      text.includes('가능') || text.includes('수 있음') || text.includes('날릴 수')) {
    return 'warning'
  }
  
  // 작동 메커니즘
  if (text.includes('씻어내') || text.includes('제거') || text.includes('배출') ||
      text.includes('순환') || text.includes('보조') || text.includes('기여') ||
      text.includes('작동') || text.includes('메커니즘') || text.includes('물리적으로')) {
    return 'mechanism'
  }
  
  // 기본값: 목적/효과 (모든 나머지, "왜 해야 하는가", "경우", "때" 등 포함)
  return 'purpose'
}

/**
 * 메시지를 파싱하여 action과 explanation을 분리
 */
export function parseMessage(message: string): ParsedMessage {
  // 정보 링크만 있는 경우 (질병관리청, 대한천식알레르기학회) - 먼저 체크
  if (message.startsWith('질병관리청') || message.startsWith('대한천식')) {
    const parts = message.split(' 정보:')
    const url = parts[1]?.trim()
    const displayText = message.includes('질병관리청') ? '질병관리청 바로가기' : '대한천식알레르기학회 바로가기'
    
    return {
      action: '',
      isLink: true,
      linkUrl: url,
      linkText: displayText
    }
  }
  
  // 구매 링크가 있는지 확인
  if (message.includes('구매 링크:')) {
    const linkMatch = message.match(/(.+?)(구매 링크:)\s*(https?:\/\/[^\s]+)/)
    if (linkMatch) {
      const text = linkMatch[1].trim()
      const url = linkMatch[3].trim()
      
      let linkText = '구매 링크'
      if (text.includes('마스크')) linkText = '마스크 사러 가기'
      else if (text.includes('필터')) linkText = '공기청정기 필터 사러 가기'
      else if (text.includes('코 세척')) linkText = '코 세척 식염수 사러 가기'
      else if (text.includes('진공')) linkText = 'HEPA 진공청소기 사러 가기'
      else if (text.includes('식물')) linkText = '반려식물 사러 가기'
      
      // 구매 링크만 있는 경우 (action이 비어있거나 매우 짧은 경우)
      // action을 비우고 링크만 표시
      return {
        action: '',
        isLink: true,
        linkUrl: url,
        linkText
      }
    }
  }
  
  // 괄호가 있는지 확인
  const bracketMatch = message.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  
  if (bracketMatch) {
    const action = bracketMatch[1].trim()
    let explanation = bracketMatch[2].trim()
    
    // "왜 해야 하는가:" 형식 처리
    const whyMatch = explanation.match(/^왜 해야 하는가:\s*(.+)$/)
    if (whyMatch) {
      explanation = whyMatch[1].trim()
    }
    
    const explanationType = detectExplanationType(explanation)
    
    return {
      action,
      explanation,
      explanationType
    }
  }
  
  // 괄호가 없는 경우
  return {
    action: message.trim()
  }
}

/**
 * 설명 타입에 따른 한글 라벨
 */
export function getExplanationTypeLabel(type: ExplanationType): string {
  const labels: Record<ExplanationType, string> = {
    purpose: '왜 해야 하나요? 하면 무엇이 좋나요?',
    evidence: '왜 해야 하나요?',
    mechanism: '왜 해야 하나요?',
    warning: '반드시 지켜야 하는 이유!'
  }
  return labels[type]
}

/**
 * 설명 타입에 따른 아이콘 이름 (SVG path)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getExplanationTypeIcon(_type: ExplanationType): string {
  // 각 타입별로 다른 아이콘을 반환할 수 있지만, 일단 간단하게 처리
  return 'M12 2L2 7L12 12L22 7L12 2Z'
}

