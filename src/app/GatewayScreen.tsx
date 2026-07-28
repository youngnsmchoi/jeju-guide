'use client'
// 관문 페이지 — 짧은 소개 + 언어별 바로가기 링크 (검색엔진에 4개 언어 진입점 제공)

import Link from 'next/link'

const CONTENT: {
  code: 'ko' | 'en' | 'zh' | 'ja'
  flag: string
  label: string
  tagline: string
}[] = [
  { code: 'ko', flag: '🇰🇷', label: '한국어', tagline: '외국인을 위한 한국 편의점 실전 가이드' },
  { code: 'en', flag: '🇺🇸', label: 'English', tagline: "Real answers for when you're stuck at a Korean convenience store" },
  { code: 'zh', flag: '🇨🇳', label: '中文', tagline: '为外国游客准备的韩国便利店实用指南' },
  { code: 'ja', flag: '🇯🇵', label: '日本語', tagline: '外国人観光客のための韓国コンビニ実践ガイド' },
]

export default function GatewayScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-emerald-700 text-white text-center py-8 px-4 space-y-2">
        <h1 className="text-lg font-bold leading-snug">Korea Convenience Store Guide</h1>
        <p className="text-xs text-emerald-200">Pick your language to get started</p>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-3">
        {CONTENT.map(({ code, flag, label, tagline }) => (
          <Link
            key={code}
            href={`/${code}`}
            className="block bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-4 hover:bg-emerald-50 transition-colors"
          >
            <p className="text-base font-bold text-gray-900">{flag} {label}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tagline}</p>
          </Link>
        ))}
      </main>
    </div>
  )
}
