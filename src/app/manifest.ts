// PWA 매니페스트 — 홈 화면에 추가했을 때 앱처럼 보이도록 하는 설정
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Korea Convenience Store Guide',
    short_name: 'CVS Guide',
    description: "Real answers for when you're stuck at a Korean convenience store.",
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#047857',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
