'use client'
// 라면 레코드를 세로 스크롤 카드 목록으로 렌더링

import { useState } from 'react'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'

const SORT_LABEL: Record<Lang, { default: string; spicy: string }> = {
  ko: { default: '추천순', spicy: '맵기순' },
  en: { default: 'Recommended', spicy: 'Spiciest' },
  zh: { default: '推荐顺序', spicy: '辣度排序' },
  ja: { default: 'おすすめ順', spicy: '辛さ順' },
}

const PREP_TIME_LABEL: Record<Lang, (min: number) => string> = {
  ko: (min) => `권장 조리 시간: ${min}분`,
  en: (min) => `Recommended prep time: ${min} min`,
  zh: (min) => `推荐烹饪时间：${min}分钟`,
  ja: (min) => `推奨調理時間: ${min}分`,
}

const FIELD_LABEL: Record<'flavor_desc' | 'comparison' | 'popularity' | 'texture', Record<Lang, string>> = {
  flavor_desc: { ko: '맛', en: 'Flavor', zh: '味道', ja: '味' },
  comparison: { ko: '비슷한 맛', en: 'Tastes like', zh: '相似口味', ja: '似た味' },
  popularity: { ko: '인기 국가', en: 'Popular in', zh: '受欢迎地区', ja: '人気の地域' },
  texture: { ko: '식감 특징', en: 'Texture', zh: '口感', ja: '食感' },
}

function SpicyLevel({ level }: { level: number }) {
  return (
    <span className="text-sm tracking-tight" aria-label={`spicy level ${level}`}>
      {'🌶️'.repeat(level)}
    </span>
  )
}

export default function RamenList({ items, lang }: { items: RamenItem[]; lang: Lang }) {
  const [sortBySpicy, setSortBySpicy] = useState(false)

  if (items.length === 0) {
    return <p className="text-center text-gray-400 py-20">등록된 라면이 없습니다.</p>
  }

  const sortedItems = sortBySpicy
    ? [...items].sort((a, b) => (b.spicy_level ?? 0) - (a.spicy_level ?? 0))
    : items

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setSortBySpicy(false)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
            ${!sortBySpicy ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
        >{SORT_LABEL[lang].default}</button>
        <button
          onClick={() => setSortBySpicy(true)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
            ${sortBySpicy ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
        >🌶️ {SORT_LABEL[lang].spicy}</button>
      </div>
      {sortedItems.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {item.image_url && (
            <div className="w-full aspect-video overflow-hidden bg-gray-50">
              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 -mx-4 -mt-4 px-4 py-3 mb-1 bg-orange-50/70 border-b border-orange-100">
              <h2 className="text-base font-bold text-gray-900">{getRamenField(item, 'name', lang)}</h2>
              {!!item.spicy_level && <SpicyLevel level={item.spicy_level} />}
            </div>

            {getRamenField(item, 'flavor_desc', lang) && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{FIELD_LABEL.flavor_desc[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'flavor_desc', lang)}</p>
              </div>
            )}

            {getRamenField(item, 'comparison', lang) && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{FIELD_LABEL.comparison[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'comparison', lang)}</p>
              </div>
            )}

            {getRamenField(item, 'popularity', lang) && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{FIELD_LABEL.popularity[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'popularity', lang)}</p>
              </div>
            )}

            {getRamenField(item, 'texture', lang) && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{FIELD_LABEL.texture[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'texture', lang)}</p>
              </div>
            )}

            {item.prep_time != null && (
              <p className="text-sm text-emerald-700 font-medium">⏱ {PREP_TIME_LABEL[lang](item.prep_time)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
