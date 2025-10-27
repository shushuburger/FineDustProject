/**
 * 웹 브라우저 알림 유틸리티
 */

/**
 * 알림 권한 요청
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

/**
 * 서비스 워커 등록 및 백그라운드 알림 스케줄링
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      // 알림 권한 먼저 요청
      await requestNotificationPermission()
      
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker 등록됨:', registration.scope)
      console.log('✅ 알림 권한:', Notification.permission)
    } catch (error) {
      console.error('❌ Service Worker 등록 실패:', error)
    }
  }
}

/**
 * 브라우저 닫힌 시점을 감지해서 알림 스케줄링
 * 중복 실행 방지를 위한 플래그
 */
let hasListenerAdded = false
let currentMissionTitle: string | undefined = undefined

/**
 * 미션 제목만 업데이트
 */
export const updateNotificationMission = (missionTitle: string) => {
  currentMissionTitle = missionTitle
  console.log('📝 미션 알림 내용 업데이트:', missionTitle)
}

export const scheduleNotificationOnUnload = (delay: number = 10000, missionTitle?: string) => {
  // 미션 제목 설정
  if (missionTitle) {
    currentMissionTitle = missionTitle
  }

  // 이미 이벤트 리스너가 등록되었으면 리턴
  if (hasListenerAdded) {
    console.log('⚠️ 이벤트 리스너가 이미 등록되어 있습니다.')
    return
  }

  const beforeUnloadHandler = () => {
    console.log('🚪 페이지 닫힘 감지 - 알림 스케줄링 시작')
    console.log('현재 알림 상태:', Notification.permission)
    
    // Service Worker가 활성화되어 있으면 알림 스케줄링
    if ('serviceWorker' in navigator) {
      // Service Worker로 메시지 전송 (페이지 닫힌 후 실행됨)
      if (navigator.serviceWorker.controller) {
        const message = {
          type: 'SCHEDULE_NOTIFICATION',
          delay: delay,
          missionTitle: currentMissionTitle
        }
        
        navigator.serviceWorker.controller.postMessage(message)
        console.log('📤 Service Worker로 알림 요청 전송:', message)
      } else {
        console.warn('⚠️ Service Worker controller가 없습니다')
      }
    } else {
      console.warn('⚠️ Service Worker가 지원되지 않습니다')
    }
  }
  
  // beforeunload만 사용 (페이지를 완전히 닫을 때만)
  window.addEventListener('beforeunload', beforeUnloadHandler)
  hasListenerAdded = true
  
  console.log('✅ 페이지 언로드 감지 설정 완료 (브라우저를 닫을 때만 알림 표시)')
}

