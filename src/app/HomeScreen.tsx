'use client'
// 홈 화면 — 결제 방법 배너 → K-Ramen Picks → Vibe 추천 순서

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { RamenItem, Lang } from '@/lib/types'
import RamenList from '@/components/RamenList'

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const HERO: Record<Lang, { title: string; sub: string }> = {
  ko: { title: 'K-Ramen Picks', sub: '제주 편의점 라면 가이드' },
  en: { title: 'K-Ramen Picks', sub: 'Jeju Convenience Store Ramen Guide' },
  zh: { title: 'K-Ramen Picks', sub: '济州便利店拉面指南' },
  ja: { title: 'K-Ramen Picks', sub: '済州コンビニラーメンガイド' },
}

const PAYMENT: Record<Lang, { label: string; sub: string }> = {
  ko: { label: '💳 편의점 결제 방법', sub: '봉투 질문에 당황하지 마세요' },
  en: { label: '💳 How to Pay', sub: "Don't get caught off guard at checkout" },
  zh: { label: '💳 如何付款', sub: '不要在收银台慌乱' },
  ja: { label: '💳 お会計の方法', sub: 'レジで慌てないために' },
}

const VIBE: Record<Lang, string> = {
  ko: '🎯 Vibe로 추천받기',
  en: '🎯 Find my ramen by Vibe',
  zh: '🎯 用Vibe推荐',
  ja: '🎯 Vibeでおすすめ',
}

const RAMEN_SECTION: Record<Lang, string> = {
  ko: '🍜 K-Ramen Picks',
  en: '🍜 K-Ramen Picks',
  zh: '🍜 K-Ramen Picks',
  ja: '🍜 K-Ramen Picks',
}

export default function HomeScreen({ items }: { items: RamenItem[] }) {
  const { lang, setLang } = useLang()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-800">{HERO[lang].title}</h1>
          <div className="flex gap-2">
            {LANG_LABELS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors
                  ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <div className="bg-emerald-700 text-white text-center py-6 px-4">
        <p className="text-xs text-emerald-200 mb-1">{HERO[lang].sub}</p>
        <h2 className="text-xl font-bold">{HERO[lang].title}</h2>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {/* ① 결제 방법 */}
        <button onClick={() => router.push('/guide/payment')}
          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between hover:border-emerald-300 hover:shadow-sm transition-all">
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">{PAYMENT[lang].label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{PAYMENT[lang].sub}</p>
          </div>
          <span className="text-gray-300 text-lg">›</span>
        </button>

        {/* ② K-Ramen Picks */}
        <p className="text-xs font-semibold text-gray-400 px-1">{RAMEN_SECTION[lang]}</p>
        <RamenList items={items} lang={lang} />

        {/* ③ Vibe 추천 */}
        <button onClick={() => router.push('/vibe')}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
          {VIBE[lang]}
        </button>
      </main>
    </div>
  )
}
