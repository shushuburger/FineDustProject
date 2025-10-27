// Service Worker for Background Notifications

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker 설치됨')
  self.skipWaiting()
})

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화됨')
  event.waitUntil(clients.claim())
})

// 메시지 받기 (클라이언트에서 알림 스케줄)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { delay, missionTitle } = event.data
    
    // 알림 스케줄링
    setTimeout(() => {
      const title = missionTitle ? `오늘의 미션: ${missionTitle}` : '오늘의 미션을 수행해보세요!'
      const body = missionTitle 
        ? '지금 바로 시작해보세요 🎯' 
        : '매일 새로운 미세먼지 대응 미션을 확인해보세요 🌱'
      
      self.registration.showNotification(title, {
        body: body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-mission',
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200]
      })
    }, delay)
  }
})

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이미 열린 탭이 있으면 포커스
      for (const client of clientList) {
        if (client.url === self.location.origin && 'focus' in client) {
          return client.focus()
        }
      }
      // 없으면 새 탭 열기
      if (clients.openWindow) {
        return clients.openWindow(self.location.origin)
      }
    })
  )
})

console.log('✅ Service Worker 실행 중... (페이지 닫힐 때만 알림 표시)')

