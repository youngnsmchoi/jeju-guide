'use client'
// Best 5 추천 — 운영자 픽 라면 순위 카드 (DB 연동)

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  title: string
  intro: string
  badge: string
}> = {
  ko: {
    title: 'Best 5 추천',
    intro: '편의점에서 꼭 먹어봐야 할 라면 5개를 골랐습니다.',
    badge: '운영자 픽',
  },
  en: {
    title: 'Best 5 Picks',
    intro: '5 ramen you must try at a convenience store.',
    badge: "Editor's Pick",
  },
  zh: {
    title: 'Best 5 推荐',
    intro: '在便利店必须尝试的5款拉面。',
    badge: '编辑推荐',
  },
  ja: {
    title: 'Best 5 おすすめ',
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
  ramen_items?: { manufacturer_url: string | null; price_krw: number | null } | null
}

const OFFICIAL_PAGE_LABEL: Record<Lang, string> = {
  ko: '📋 제품 상세 정보',
  en: '📋 Product Details',
  zh: '📋 产品详情',
  ja: '📋 製品詳細情報',
}

const USD_RATE = 1380

const APPROX_PRICE_LABEL: Record<Lang, (usd: string) => string> = {
  ko: (usd) => `약 $${usd} · 환율 변동 가능`,
  en: (usd) => `approx. $${usd} · rate may vary`,
  zh: (usd) => `约 $${usd} · 汇率可能变动`,
  ja: (usd) => `約 $${usd} · レートは変動あり`,
}

function SpicyBadge({ level }: { level: number }) {
  if (level === 0) return <span className="text-xs text-gray-400">🌿 Not spicy</span>
  return <span className="text-xs text-red-400">{'🌶️'.repeat(Math.min(level, 5))}</span>
}

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function Best5View({ picks }: { picks: Best5Pick[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

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

            {pick.ramen_items?.price_krw != null && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">₩{pick.ramen_items.price_krw.toLocaleString()}</span>
                <span className="text-xs text-gray-400">({APPROX_PRICE_LABEL[lang]((pick.ramen_items.price_krw / USD_RATE).toFixed(2))})</span>
              </div>
            )}

            {pick.ramen_items?.manufacturer_url && (
              <a
                href={pick.ramen_items.manufacturer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 hover:bg-emerald-100 transition-colors"
              >{OFFICIAL_PAGE_LABEL[lang]} →</a>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}
