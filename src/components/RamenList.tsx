'use client'
// 라면 레코드를 세로 스크롤 카드 목록으로 렌더링

import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'

const GLOSSARY: Record<Lang, { title: string; toggle: string; terms: { ko: string; tr: string; desc: string }[] }> = {
  ko: {
    title: '📖 라면 용어 사전',
    toggle: '접기',
    terms: [
      { ko: '컵라면', tr: 'Cup Noodle', desc: '뜨거운 물만 부으면 되는 용기형' },
      { ko: '봉지라면', tr: 'Bag Ramen', desc: '냄비에 끓여 먹는 봉지형' },
      { ko: '비빔면', tr: 'Cold Mix Noodle', desc: '차갑게 비벼 먹는 면' },
      { ko: '볶음면', tr: 'Stir-fry Noodle', desc: '소스에 볶아 먹는 건면' },
      { ko: '짜장면', tr: 'Black Bean Noodle', desc: '짜장 소스 면 요리' },
      { ko: '짬뽕', tr: 'Spicy Seafood Noodle', desc: '해물 매운 국물 면' },
    ],
  },
  en: {
    title: '📖 Ramen Glossary',
    toggle: 'Close',
    terms: [
      { ko: '컵라면', tr: 'Cup Noodle', desc: 'Just add hot water — no cooking needed' },
      { ko: '봉지라면', tr: 'Bag Ramen', desc: 'Boil in a pot' },
      { ko: '비빔면', tr: 'Cold Mix Noodle', desc: 'Served cold, mixed with sauce' },
      { ko: '볶음면', tr: 'Stir-fry Noodle', desc: 'Dry noodle tossed in sauce' },
      { ko: '짜장면', tr: 'Black Bean Noodle', desc: 'Noodles in black bean sauce' },
      { ko: '짬뽕', tr: 'Spicy Seafood Noodle', desc: 'Spicy broth with seafood' },
    ],
  },
  zh: {
    title: '📖 拉面术语表',
    toggle: '收起',
    terms: [
      { ko: '컵라면', tr: '杯面', desc: '只需加热水，无需烹饪' },
      { ko: '봉지라면', tr: '袋面', desc: '用锅煮食' },
      { ko: '비빔면', tr: '凉拌面', desc: '冷食，拌酱食用' },
      { ko: '볶음면', tr: '炒面', desc: '干面拌酱食用' },
      { ko: '짜장면', tr: '炸酱面', desc: '黑豆酱拌面' },
      { ko: '짬뽕', tr: '炒码面', desc: '辣味海鲜汤面' },
    ],
  },
  ja: {
    title: '📖 ラーメン用語集',
    toggle: '閉じる',
    terms: [
      { ko: '컵라면', tr: 'カップ麺', desc: 'お湯を注ぐだけ — 調理不要' },
      { ko: '봉지라면', tr: '袋麺', desc: '鍋で茹でて食べる' },
      { ko: '비빔면', tr: '冷やし混ぜ麺', desc: '冷たくしてソースと混ぜる' },
      { ko: '볶음면', tr: '炒め麺', desc: 'ソースで和える乾麺' },
      { ko: '짜장면', tr: 'ジャージャー麺', desc: '黒豆ソースの麺料理' },
      { ko: '짬뽕', tr: 'チャンポン', desc: '辛い海鮮スープ麺' },
    ],
  },
}

const SORT_LABEL: Record<Lang, { default: string; spicy: string }> = {
  ko: { default: '추천순', spicy: '맵기순' },
  en: { default: 'Recommended', spicy: 'Spiciest' },
  zh: { default: '推荐顺序', spicy: '辣度排序' },
  ja: { default: 'おすすめ順', spicy: '辛さ順' },
}

const FILTER_LABEL: Record<Lang, { all: string; cup: string; bag: string }> = {
  ko: { all: '전체', cup: '컵라면', bag: '봉지라면' },
  en: { all: 'All', cup: 'Cup', bag: 'Bag' },
  zh: { all: '全部', cup: '杯面', bag: '袋面' },
  ja: { all: 'すべて', cup: 'カップ', bag: '袋' },
}

const PREP_TIME_LABEL: Record<Lang, (min: number) => string> = {
  ko: (min) => `권장 조리 시간: ${min}분`,
  en: (min) => `Recommended prep time: ${min} min`,
  zh: (min) => `推荐烹饪时间：${min}分钟`,
  ja: (min) => `推奨調理時間: ${min}分`,
}

const HEAT_SOURCE_LABEL: Record<string, Record<Lang, string>> = {
  hot_water: { ko: '뜨거운 물만', en: 'Hot water only', zh: '仅需热水', ja: 'お湯のみ' },
  microwave: { ko: '전자레인지', en: 'Microwave', zh: '微波炉', ja: '電子レンジ' },
  stovetop: { ko: '냄비 필요', en: 'Stovetop required', zh: '需要锅', ja: '鍋が必要' },
}

const OFFICIAL_PAGE_LABEL: Record<Lang, string> = {
  ko: '📋 제품 상세 정보',
  en: '📋 Product Details',
  zh: '📋 产品详情',
  ja: '📋 製品詳細情報',
}

const SPICY_GUIDE: Record<Lang, { title: string; levels: { icon: string; label: string; desc: string }[] }> = {
  ko: {
    title: '🌶️ 맵기 기준',
    levels: [
      { icon: '😊', label: '순함', desc: '신라면보다 약함' },
      { icon: '🌶️', label: '보통', desc: '신라면 수준' },
      { icon: '🌶️🌶️', label: '매움', desc: '신라면보다 강함' },
      { icon: '🌶️🌶️🌶️', label: '극매움', desc: '불닭 수준' },
    ],
  },
  en: {
    title: '🌶️ Spice guide',
    levels: [
      { icon: '😊', label: 'Mild', desc: 'Less than Shin Ramyun' },
      { icon: '🌶️', label: 'Medium', desc: 'Shin Ramyun level' },
      { icon: '🌶️🌶️', label: 'Hot', desc: 'Hotter than Shin Ramyun' },
      { icon: '🌶️🌶️🌶️', label: 'Extreme', desc: 'Buldak level' },
    ],
  },
  zh: {
    title: '🌶️ 辣度参考',
    levels: [
      { icon: '😊', label: '微辣', desc: '比辛拉面辣度低' },
      { icon: '🌶️', label: '中辣', desc: '辛拉面水平' },
      { icon: '🌶️🌶️', label: '辣', desc: '比辛拉面更辣' },
      { icon: '🌶️🌶️🌶️', label: '极辣', desc: '火鸡面水平' },
    ],
  },
  ja: {
    title: '🌶️ 辛さの目安',
    levels: [
      { icon: '😊', label: '辛くない', desc: '辛ラーメンより弱め' },
      { icon: '🌶️', label: '普通', desc: '辛ラーメンと同レベル' },
      { icon: '🌶️🌶️', label: '辛い', desc: '辛ラーメンより強め' },
      { icon: '🌶️🌶️🌶️', label: '激辛', desc: 'ブルダックレベル' },
    ],
  },
}

const USD_RATE = 1380
const RATE_DATE = 'Jun 2026'

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
  const [typeFilter, setTypeFilter] = useState<'all' | 'cup' | 'bag'>('all')

  if (items.length === 0) {
    return <p className="text-center text-gray-400 py-20">등록된 라면이 없습니다.</p>
  }

  const filteredItems = typeFilter === 'all' ? items : items.filter(item => item.noodle_type === typeFilter)
  const sortedItems = sortBySpicy
    ? [...filteredItems].sort((a, b) => (b.spicy_level ?? 0) - (a.spicy_level ?? 0))
    : filteredItems

  const guide = SPICY_GUIDE[lang]
  const glossary = GLOSSARY[lang]
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  return (
    <div className="px-4 py-5 space-y-5">
      {/* 라면 용어 사전 — 토글 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setGlossaryOpen(o => !o)}
          className="w-full px-4 py-3 flex items-center justify-between text-left">
          <p className="text-sm font-bold text-gray-800">{glossary.title}</p>
          <span className="text-xs text-gray-400">{glossaryOpen ? glossary.toggle : '▾'}</span>
        </button>
        {glossaryOpen && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-3 grid grid-cols-1 gap-2">
            {glossary.terms.map((term, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xs font-bold text-emerald-700 w-16 shrink-0">{term.ko}</span>
                <span className="text-xs font-semibold text-gray-700 w-24 shrink-0">{term.tr}</span>
                <span className="text-xs text-gray-400">{term.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 맵기 범례 */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-orange-800 mb-3">{guide.title}</p>
        <div className="grid grid-cols-2 gap-2">
          {guide.levels.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm w-16 shrink-0">{l.icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-800">{l.label}</p>
                <p className="text-xs text-gray-500">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {(['all', 'cup', 'bag'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
                ${typeFilter === t
                  ? t === 'cup' ? 'bg-blue-500 text-white' : t === 'bag' ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500'}`}>
              {FILTER_LABEL[lang][t]}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setSortBySpicy(false)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
              ${!sortBySpicy ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {SORT_LABEL[lang].default}
          </button>
          <button onClick={() => setSortBySpicy(true)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
              ${sortBySpicy ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
            🌶️ {SORT_LABEL[lang].spicy}
          </button>
        </div>
      </div>
      {sortedItems.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {item.image_url && (
            <div className="relative w-full h-48 overflow-hidden bg-gray-50">
              <img src={item.image_url} alt="" className="w-full h-full object-contain" />
              {item.noodle_type && (
                <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-md
                  ${item.noodle_type === 'cup' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`}>
                  {item.noodle_type === 'cup' ? 'Cup' : 'Bag'}
                </span>
              )}
            </div>
          )}
          <div className="p-4 space-y-3">
            {item.noodle_type && !item.image_url && (
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md
                ${item.noodle_type === 'cup' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`}>
                {item.noodle_type === 'cup' ? 'Cup' : 'Bag'}
              </span>
            )}
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-gray-900">{getRamenField(item, 'name', lang)}</h2>
              {!!item.spicy_level && <SpicyLevel level={item.spicy_level} />}
            </div>
            {item.manufacturer_url && (
              <a
                href={item.manufacturer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 hover:bg-emerald-100 transition-colors"
              >{OFFICIAL_PAGE_LABEL[lang]} →</a>
            )}

            {getRamenField(item, 'flavor_desc', lang) && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{FIELD_LABEL.flavor_desc[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'flavor_desc', lang)}</p>
              </div>
            )}

            {getRamenField(item, 'comparison', lang) && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{FIELD_LABEL.comparison[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'comparison', lang)}</p>
              </div>
            )}

            {getRamenField(item, 'popularity', lang) && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{FIELD_LABEL.popularity[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'popularity', lang)}</p>
              </div>
            )}

            {getRamenField(item, 'texture', lang) && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{FIELD_LABEL.texture[lang]}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{getRamenField(item, 'texture', lang)}</p>
              </div>
            )}

            {item.price_krw != null && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm font-semibold text-gray-800">₩{item.price_krw.toLocaleString()}</span>
                <span className="text-xs text-gray-400">(≈ ${(item.price_krw / USD_RATE).toFixed(2)} · {RATE_DATE})</span>
              </div>
            )}

            {item.prep_time != null && (
              <p className="flex items-center gap-1.5 text-sm text-emerald-700 font-medium">
                <Clock size={16} />
                {PREP_TIME_LABEL[lang](item.prep_time)}
                {item.heat_source && (
                  <span className="text-gray-400 font-normal">· {HEAT_SOURCE_LABEL[item.heat_source][lang]}</span>
                )}
              </p>
            )}

          </div>
        </div>
      ))}
    </div>
  )
}
