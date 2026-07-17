'use client'
// 편의점 디저트/간식 가이드 — 카테고리 필터 + 한국인 추천 인기템 카드

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { SnackItem, Lang } from '@/lib/types'
import { getSnackField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  ingredientsLink: string
  priceUnknown: string
  whyPopularLabel: string
  categoryAll: string
}> = {
  ko: {
    intro: '한국인이라면 다 아는 편의점 스테디셀러. 여행 중 딱 한 번만 먹어본다면 이 목록부터 시작하세요.',
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    priceUnknown: '가격 확인 중',
    whyPopularLabel: '💡 왜 유명한가요',
    categoryAll: '전체',
  },
  en: {
    intro: 'Steady-selling convenience store classics every Korean knows. If you\'re only trying a few things, start with this list.',
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    priceUnknown: 'Price TBD',
    whyPopularLabel: '💡 Why it\'s famous',
    categoryAll: 'All',
  },
  zh: {
    intro: '韩国人都熟悉的便利店长销商品。如果只想尝试几样，从这份清单开始吧。',
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    priceUnknown: '价格待确认',
    whyPopularLabel: '💡 为什么有名',
    categoryAll: '全部',
  },
  ja: {
    intro: '韓国人なら誰でも知っているコンビニのロングセラー。旅行中に少しだけ試すならこのリストから。',
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    priceUnknown: '価格確認中',
    whyPopularLabel: '💡 人気の理由',
    categoryAll: 'すべて',
  },
}

const CATEGORY_LABEL: Record<Lang, Record<string, string>> = {
  ko: { drink: '🥤 음료', ice_cream: '🍦 아이스크림', snack: '🍪 과자', bread: '🍞 빵' },
  en: { drink: '🥤 Drinks', ice_cream: '🍦 Ice Cream', snack: '🍪 Snacks', bread: '🍞 Bread' },
  zh: { drink: '🥤 饮料', ice_cream: '🍦 冰淇淋', snack: '🍪 零食', bread: '🍞 面包' },
  ja: { drink: '🥤 飲み物', ice_cream: '🍦 アイス', snack: '🍪 お菓子', bread: '🍞 パン' },
}

const CATEGORIES = ['drink', 'ice_cream', 'snack', 'bread'] as const

export default function SnacksView({ items }: { items: SnackItem[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? items : items.filter(item => item.category === filter)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 성분 확인 링크 */}
        <a
          href="/guide/ingredients"
          className="block bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-colors"
        >
          <p className="text-sm font-bold text-amber-800">{L.ingredientsLink}</p>
        </a>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
              ${filter === 'all' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
            {L.categoryAll}
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
                ${filter === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
              {CATEGORY_LABEL[lang][cat]}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">{getSnackField(item, 'name', lang)}</h2>
                <span className="text-sm font-semibold text-gray-800">
                  {item.price_krw ? `₩${item.price_krw.toLocaleString()}` : L.priceUnknown}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{getSnackField(item, 'flavor_desc', lang)}</p>
              {getSnackField(item, 'why_popular', lang) && (
                <p className="text-xs text-emerald-700 leading-relaxed bg-emerald-50 rounded-lg px-2.5 py-1.5">
                  <span className="font-semibold">{L.whyPopularLabel}: </span>
                  {getSnackField(item, 'why_popular', lang)}
                </p>
              )}
              {getSnackField(item, 'allergen_note', lang) && (
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-2">
                  {getSnackField(item, 'allergen_note', lang)}
                </p>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
