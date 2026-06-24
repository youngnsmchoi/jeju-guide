'use client'
// 홈 화면 — 4개 카테고리 카드 + 언어 선택

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/context/LangContext'
import { getTitle } from '@/lib/types'
import type { Category, Lang } from '@/lib/types'

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const HERO_TEXT: Record<Lang, { title: string; sub: string }> = {
  ko: { title: '서귀포 스마트 생존 가이드', sub: '현지 생활의 모든 것을 2번의 클릭으로' },
  en: { title: 'Seogwipo Smart Survival Guide', sub: 'Everything you need in 2 clicks' },
  zh: { title: '西归浦智能生存指南', sub: '两次点击解决所有问题' },
  ja: { title: '西帰浦スマート生存ガイド', sub: '2クリックで現地生活のすべてを解決' },
}

export default function HomePage() {
  const { lang, setLang } = useLang()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('jeju_categories')
      .select('*')
      .order('order_num')
      .then(({ data, error }) => {
        console.log('categories:', data, error)
        if (data) setCategories(data)
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
        <div className="text-3xl mb-1">🌊</div>
        <h1 className="text-xl font-bold mb-1">{hero.title}</h1>
        <p className="text-emerald-200 text-sm">{hero.sub}</p>
      </div>

      {/* 카테고리 카드 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-400 py-20">불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/category/${cat.slug}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-emerald-200 transition-all active:scale-95"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
                  {getTitle(cat, lang)}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
