'use client'
// PWA 설치(홈 화면에 추가)가 가능하려면 활성 서비스워커가 필요해서, 페이지 로드 시 등록만 해둔다
// (실제 오프라인 캐싱은 "인터넷 안 될 때도 보기" 저장 버튼을 눌렀을 때만 동작)

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
