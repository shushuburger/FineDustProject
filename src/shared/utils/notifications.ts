/**
 * 웹 브라우저 알림 유틸리티
 */

/**
 * 알림 권한 요청
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
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
    } catch (error) {
      // silent
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
    } catch (error) {
      // silent
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
    return
  }

  // beforeunload 이벤트 등록 - 브라우저를 닫을 때만 알림 스케줄링
  const beforeUnloadHandler = () => {
    
    // Service Worker로 메시지 전송
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const message = {
        type: 'SCHEDULE_NOTIFICATION',
        delay: delay,
        missionTitle: currentMissionTitle
      }
      
      try {
        navigator.serviceWorker.controller.postMessage(message)
      } catch (error) {
        // silent
      }
    }
  }
  
  window.addEventListener('beforeunload', beforeUnloadHandler)
  hasListenerAdded = true
}

