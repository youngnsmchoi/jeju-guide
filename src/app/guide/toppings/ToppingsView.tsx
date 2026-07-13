'use client'
// 꿀조합 커스터마이징 — 라면별 편의점 토핑 조합 카드 (DB 연동)

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  title: string
  intro: string
  tip: string
  tipDesc: string
  where: string
  whereDesc: string
}> = {
  ko: {
    title: '꿀조합 커스터마이징',
    intro: '편의점 라면, 이것 하나만 더 넣으면 완전히 달라집니다.',
    tip: '💡 편의점에서 바로 구할 수 있어요',
    tipDesc: '계란, 치즈 슬라이스, 삼각김밥 모두 편의점 냉장코너에 있습니다.',
    where: '🍳 조리 방법',
    whereDesc: '계란은 컵라면 뚜껑 위에 올려 뜨거운 물 붓고 3분 → 반숙. 치즈는 면 위에 바로 올리세요.',
  },
  en: {
    title: 'Topping Combos',
    intro: 'One topping from the fridge section — totally different ramen.',
    tip: '💡 All available in-store',
    tipDesc: 'Eggs, cheese slices, and rice balls are in the refrigerated section of any convenience store.',
    where: '🍳 How to prep',
    whereDesc: 'Egg: place on cup lid, pour hot water, wait 3 min → soft-boiled. Cheese: lay directly on top of the noodles.',
  },
  zh: {
    title: '黄金搭配',
    intro: '便利店里加一样，拉面完全不同。',
    tip: '💡 便利店内均可购买',
    tipDesc: '鸡蛋、芝士片和饭团都在便利店冷藏区。',
    where: '🍳 烹饪方法',
    whereDesc: '鸡蛋：放在杯面盖上，倒热水，等3分钟→溏心蛋。芝士：直接放在面条上。',
  },
  ja: {
    title: 'トッピング組み合わせ',
    intro: 'コンビニのトッピングを一つ足すだけで、まったく別のラーメンに。',
    tip: '💡 コンビニで全部そろう',
    tipDesc: '卵、チーズスライス、おにぎりはどのコンビニの冷蔵コーナーにもあります。',
    where: '🍳 作り方',
    whereDesc: '卵：カップ麺のふたの上に置いてお湯を注ぎ3分→半熟。チーズ：麺の上にそのまま乗せる。',
  },
}

export type ToppingCombo = {
  id: number
  order_num: number
  ramen_ko: string
  ramen_en: string | null
  ramen_zh: string | null
  ramen_ja: string | null
  toppings: string
  reason_ko: string | null
  reason_en: string | null
  reason_zh: string | null
  reason_ja: string | null
  spicy: number
}

type Topping = '🥚' | '🧀' | '🍙'

const TOPPING_NAME: Record<Lang, Record<Topping, string>> = {
  ko: { '🥚': '계란', '🧀': '치즈 슬라이스', '🍙': '삼각김밥' },
  en: { '🥚': 'Egg', '🧀': 'Cheese slice', '🍙': 'Rice ball' },
  zh: { '🥚': '鸡蛋', '🧀': '芝士片', '🍙': '饭团' },
  ja: { '🥚': '卵', '🧀': 'チーズスライス', '🍙': 'おにぎり' },
}

function SpicyBadge({ level }: { level: number }) {
  if (level === 0) return <span className="text-xs text-gray-400">🌿 Not spicy</span>
  return <span className="text-xs text-red-400">{'🌶️'.repeat(Math.min(level, 5))}</span>
}

function parseToppings(raw: string): Topping[] {
  try {
    return JSON.parse(raw) as Topping[]
  } catch {
    return []
  }
}

export default function ToppingsView({ combos }: { combos: ToppingCombo[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {combos.map((combo) => {
          const toppings = parseToppings(combo.toppings)
          return (
            <div key={combo.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">{combo[`ramen_${lang}`] || combo.ramen_ko}</h2>
                <SpicyBadge level={combo.spicy} />
              </div>

              <div className="flex gap-2 flex-wrap">
                {toppings.map((t, j) => (
                  <span key={j} className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
                    {t} {TOPPING_NAME[lang][t]}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{combo[`reason_${lang}`] || combo.reason_ko}</p>
            </div>
          )
        })}

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-bold text-emerald-800 mb-1">{L.tip}</p>
          <p className="text-xs text-emerald-700 leading-relaxed">{L.tipDesc}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-bold text-amber-800 mb-1">{L.where}</p>
          <p className="text-xs text-amber-700 leading-relaxed">{L.whereDesc}</p>
        </div>
      </main>
    </div>
  )
}
