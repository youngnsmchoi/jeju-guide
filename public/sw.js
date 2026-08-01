// 오프라인 대비 저장 — "지금 저장하기"로 명시적으로 요청받은 즐겨찾기 페이지만 캐시해두고,
// 오프라인일 때 캐시로 응답하는 서비스워커. 저장한 내용은 사용자가 직접 삭제하기 전까지 유지된다.
const CACHE_NAME = 'offline-favorites-v1'
const META_CACHE_NAME = 'offline-favorites-meta'
const META_KEY = 'https://offline-meta.local/saved-at'

// 지금 이 세션에서 "저장하기"가 진행 중인 동안만 true — 이 동안의 요청만 캐시에 담는다
let capturing = false

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok && capturing) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return res
      })
      .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'START_CAPTURE') {
    capturing = true
  }
  if (event.data?.type === 'STOP_CAPTURE') {
    capturing = false
  }
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
