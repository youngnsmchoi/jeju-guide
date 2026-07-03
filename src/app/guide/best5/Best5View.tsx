'use client'
// Best 5 추천 — 운영자 픽 라면 순위 카드 (DB 연동)

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, {
  title: string
  back: string
  intro: string
  badge: string
}> = {
  ko: {
    title: 'Best 5 추천',
    back: '← 뒤로',
    intro: '편의점에서 꼭 먹어봐야 할 라면 5개를 골랐습니다.',
    badge: '운영자 픽',
  },
  en: {
    title: 'Best 5 Picks',
    back: '← Back',
    intro: '5 ramen you must try at a convenience store.',
    badge: "Editor's Pick",
  },
  zh: {
    title: 'Best 5 推荐',
    back: '← 返回',
    intro: '在便利店必须尝试的5款拉面。',
    badge: '编辑推荐',
  },
  ja: {
    title: 'Best 5 おすすめ',
    back: '← 戻る',
    intro: 'コンビニで絶対食べてほしいラーメン5選。',
    badge: 'エディターズピック',
  },
}

export type Best5Pick = {
  id: number
  rank_num: number
  name_ko: string
  name_en: string | null
  name_zh: string | null
  name_ja: string | null
  noodle_type: 'cup' | 'bag'
  spicy: number
  tag_ko: string | null
  tag_en: string | null
  tag_zh: string | null
  tag_ja: string | null
  reason_ko: string | null
  reason_en: string | null
  reason_zh: string | null
  reason_ja: string | null
}

function SpicyBadge({ level }: { level: number }) {
  if (level === 0) return <span className="text-xs text-gray-400">🌿 Not spicy</span>
  return <span className="text-xs text-red-400">{'🌶️'.repeat(Math.min(level, 5))}</span>
}

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function Best5View({ picks }: { picks: Best5Pick[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600 leading-relaxed flex-1">{L.intro}</p>
          <span className="shrink-0 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{L.badge}</span>
        </div>

        {picks.map((pick, i) => (
          <div key={pick.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{MEDAL[i] ?? `${i + 1}.`}</span>
                <h2 className="text-base font-bold text-gray-900">{pick[`name_${lang}`] || pick.name_ko}</h2>
              </div>
              <SpicyBadge level={pick.spicy} />
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md
                ${pick.noodle_type === 'cup' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                {pick.noodle_type === 'cup' ? 'Cup' : 'Bag'}
              </span>
              <span className="text-xs text-emerald-700 font-medium">{pick[`tag_${lang}`] || pick.tag_ko}</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{pick[`reason_${lang}`] || pick.reason_ko}</p>
          </div>
        ))}
      </main>
    </div>
  )
}
