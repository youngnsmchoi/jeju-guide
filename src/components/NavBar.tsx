'use client'
// 상단 네비게이션 바 — 홈 버튼, 위로 버튼, 언어 선택

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LangSelector from './LangSelector'

export default function NavBar() {
  const router = useRouter()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center px-3 py-2 gap-1">
        {/* 홈 버튼 */}
        <button
          onClick={() => router.push('/')}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors">
          ← 홈
        </button>

        {/* 위로 버튼 — 스크롤 200px 이상일 때만 표시 */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="shrink-0 px-2 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors">
            ↑
          </button>
        )}

        <div className="flex-1" />

        <div className="w-px h-4 bg-gray-200 shrink-0" />

        {/* 언어 선택 */}
        <LangSelector />
      </div>
    </header>
  )
}
