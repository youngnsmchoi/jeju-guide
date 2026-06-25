'use client'
// 홈 화면 — 4개 카테고리 카드 + 언어 선택

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bus, Store, Compass, Cross, type LucideIcon } from 'lucide-react'
import { useLang } from '@/context/LangContext'
import { getTitle } from '@/lib/types'
import type { Category, Lang } from '@/lib/types'

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const HERO_TEXT: Record<Lang, { title: string }> = {
  ko: { title: '제주도 여행 가이드' },
  en: { title: 'Jeju Travel Guide' },
  zh: { title: '济州岛旅行指南' },
  ja: { title: '済州島旅行ガイド' },
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  transport: Bus,
  living: Store,
  local: Compass,
  essential: Cross,
}

export default function HomePage() {
  const { lang, setLang } = useLang()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
        setLoading(false)
      })
  }, [])

  const hero = HERO_TEXT[lang]

  return (
    <div className="min-h-screen flex flex-col">
      {/* 언어 선택 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex justify-end gap-2">
          {LANG_LABELS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors
                ${lang === l.code
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* 히어로 */}
      <div className="bg-emerald-700 text-white text-center py-10 px-4">
        <h1 className="text-xl font-bold">{hero.title}</h1>
      </div>

      {/* 카테고리 카드 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-400 py-20">불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug]
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/category/${cat.slug}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-emerald-200 transition-all active:scale-95"
                >
                  {Icon && <Icon className="w-8 h-8 text-emerald-700" strokeWidth={1.5} />}
                  <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
                    {getTitle(cat, lang)}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
