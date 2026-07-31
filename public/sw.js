// 오프라인 대비 저장 — 즐겨찾기 페이지를 캐시해두고, 오프라인일 때 캐시로 응답하는 서비스워커
// 저장한 내용은 사용자가 직접 삭제하기 전까지 계속 유지된다 (자동 만료 없음)
const CACHE_NAME = 'offline-favorites-v1'
const META_CACHE_NAME = 'offline-favorites-meta'
const META_KEY = 'https://offline-meta.local/saved-at'

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

self.addEventListener('message', (event) => {
  if (event.data?.type === 'MARK_SAVED') {
    event.waitUntil(
      caches.open(META_CACHE_NAME).then((cache) =>
        cache.put(META_KEY, new Response(String(Date.now())))
      )
    )
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      Promise.all([caches.delete(CACHE_NAME), caches.delete(META_CACHE_NAME)]).then(() => {
        event.source?.postMessage({ type: 'CLEAR_DONE' })
      })
    )
  }
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
