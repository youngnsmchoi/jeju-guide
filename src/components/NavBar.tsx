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
      <div className="max-w-lg mx-auto flex items-center px-3 py-2 gap-1">
        {/* 로고 — 클릭하면 홈으로 이동 (브랜드명이라 언어 무관) */}
        <button
          onClick={() => router.push('/')}
          className="shrink-0 min-w-0 truncate text-xs font-bold text-gray-800 hover:text-emerald-700 transition-colors">
          Korea Convenience Store Guide
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
