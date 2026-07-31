// 오프라인 대비 저장 — 즐겨찾기 페이지를 캐시해두고, 오프라인일 때 캐시로 응답하는 서비스워커
const CACHE_NAME = 'offline-favorites-v1'

// 페이지가 로드될 때 실제로 쓰인 모든 요청(이미지 포함)을 가로채 캐시에 담아둔다
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return res
      })
      .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
  )
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
