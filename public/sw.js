// Service Worker for Background Notifications

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker 설치됨')
  event.waitUntil(self.skipWaiting())
})

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화됨')
  event.waitUntil(clients.claim())
  
  // 활성화 시 즉시 알림 체크
  checkForPendingNotification()
})

// 활성화 후 pending 알림 체크
function checkForPendingNotification() {
  console.log('📋 Pending 알림 체크 시작...')
  
  setTimeout(() => {
    console.log('✅ Service Worker 백그라운드 작동 중')
    
    // 모든 클라이언트에게 준비 완료 메시지 전송
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_READY' })
      })
    })
  }, 1000)
}

// 메시지 받기 (클라이언트에서 알림 스케줄)
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker가 메시지 받음:', event.data)
  
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { delay, missionTitle } = event.data
    console.log('⏰ 알림 스케줄링:', { delay, missionTitle })
    
    // 알림 정보를 IndexedDB에 저장
    saveNotificationSchedule({
      delay,
      missionTitle,
      scheduledTime: Date.now() + delay
    })
  }
})

// 알림 스케줄링 정보 저장
async function saveNotificationSchedule(data) {
  // IndexedDB 사용이 복잡하므로 간단하게 IndexedDB에 직접 저장
  try {
    const db = await openNotificationDB()
    const transaction = db.transaction(['notifications'], 'readwrite')
    const store = transaction.objectStore('notifications')
    
    await store.put({
      id: 'current',
      ...data,
      created: Date.now()
    })
    
    console.log('💾 알림 스케줄 정보 저장됨')
  } catch (error) {
    console.error('❌ 저장 실패:', error)
  }
}

// IndexedDB 열기
function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotificationDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id' })
        store.createIndex('scheduledTime', 'scheduledTime', { unique: false })
      }
    }
  })
}

// 주기적으로 알림 체크 (1초마다)
setInterval(async () => {
  try {
    const db = await openNotificationDB()
    const transaction = db.transaction(['notifications'], 'readonly')
    const store = transaction.objectStore('notifications')
    const notificationData = await store.get('current')
    
    if (notificationData && notificationData.scheduledTime) {
      const now = Date.now()
      const { scheduledTime, missionTitle } = notificationData
      
      if (now >= scheduledTime - 100 && now <= scheduledTime + 100) {
        // 알림 시간이 되었으면 표시
        showNotificationForMission(missionTitle)
        
        // 스케줄 정보 삭제
        const deleteTransaction = db.transaction(['notifications'], 'readwrite')
        const deleteStore = deleteTransaction.objectStore('notifications')
        await deleteStore.delete('current')
      }
    }
  } catch (error) {
    // IndexedDB 접근 실패 시 무시
  }
}, 1000)

// 알림 표시
function showNotificationForMission(missionTitle) {
  const title = missionTitle ? `오늘의 미션: ${missionTitle}` : '오늘의 미션을 수행해보세요!'
  const body = missionTitle 
    ? '지금 바로 시작해보세요 🎯' 
    : '매일 새로운 미세먼지 대응 미션을 확인해보세요 🌱'
  
  console.log('🔔 알림 표시 중...', title)
  
  self.registration.showNotification(title, {
    body: body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'daily-mission',
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200]
  }).then(() => {
    console.log('✅ 알림 표시 완료')
  }).catch((error) => {
    console.error('❌ 알림 표시 실패:', error)
  })
}

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

