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

/**
 * Service Worker로 알림 스케줄링 메시지 전송
 */
export const scheduleBackgroundNotification = async (delay: number = 10000, missionTitle?: string) => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      
      const message = {
        type: 'SCHEDULE_NOTIFICATION',
        delay: delay,
        missionTitle: missionTitle || currentMissionTitle
      }
      
      // Service Worker로 메시지 전송
      registration.active?.postMessage(message)
      console.log('📤 Service Worker로 알림 스케줄 요청 전송:', message)
    } catch (error) {
      console.error('❌ Service Worker 메시지 전송 실패:', error)
    }
  }
}

export const scheduleNotificationOnUnload = (delay: number = 10000, missionTitle?: string) => {
  // 미션 제목 설정
  if (missionTitle) {
    currentMissionTitle = missionTitle
  }

  // 이미 설정되었으면 리턴
  if (hasListenerAdded) {
    console.log('⚠️ 이미 알림 스케줄링이 설정되어 있습니다.')
    return
  }

  // beforeunload 이벤트 등록 - 브라우저를 닫을 때만 알림 스케줄링
  const beforeUnloadHandler = () => {
    console.log('🚪 브라우저 닫힘 감지 - 알림 스케줄링 시작')
    console.log('현재 알림 권한:', Notification.permission)
    
    // Service Worker로 메시지 전송
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const message = {
        type: 'SCHEDULE_NOTIFICATION',
        delay: delay,
        missionTitle: currentMissionTitle
      }
      
      try {
        navigator.serviceWorker.controller.postMessage(message)
        console.log('📤 Service Worker로 알림 요청 전송:', message)
      } catch (error) {
        console.error('❌ 메시지 전송 실패:', error)
      }
    }
  }
  
  window.addEventListener('beforeunload', beforeUnloadHandler)
  hasListenerAdded = true
  
  console.log('✅ 브라우저 닫힘 감지 설정 완료 (브라우저 닫은 후 10초 뒤 알림 표시)')
}

