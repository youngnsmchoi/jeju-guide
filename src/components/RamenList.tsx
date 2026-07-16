'use client'
// 라면 레코드를 세로 스크롤 카드 목록으로 렌더링

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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

const SPICY_FILTER_LABEL: Record<Lang, { all: string; mild: string; medium: string; hot: string; extreme: string }> = {
  ko: { all: '전체', mild: '😊 순함', medium: '🌶️ 보통', hot: '🌶️🌶️ 매움', extreme: '🌶️🌶️🌶️ 극매움' },
  en: { all: 'All', mild: '😊 Mild', medium: '🌶️ Medium', hot: '🌶️🌶️ Hot', extreme: '🌶️🌶️🌶️ Extreme' },
  zh: { all: '全部', mild: '😊 微辣', medium: '🌶️ 中辣', hot: '🌶️🌶️ 辣', extreme: '🌶️🌶️🌶️ 极辣' },
  ja: { all: 'すべて', mild: '😊 辛くない', medium: '🌶️ 普通', hot: '🌶️🌶️ 辛い', extreme: '🌶️🌶️🌶️ 激辛' },
}

const PRICE_FILTER_LABEL: Record<Lang, { all: string; low: string; mid: string; high: string }> = {
  ko: { all: '전체', low: '~2,000원', mid: '2,000~3,000원', high: '3,000원~' },
  en: { all: 'All', low: '~₩2,000', mid: '₩2,000~3,000', high: '₩3,000~' },
  zh: { all: '全部', low: '~2,000韩元', mid: '2,000~3,000韩元', high: '3,000韩元~' },
  ja: { all: 'すべて', low: '~2,000ウォン', mid: '2,000~3,000ウォン', high: '3,000ウォン~' },
}

const SEARCH_PLACEHOLDER: Record<Lang, string> = {
  ko: '라면 이름으로 검색',
  en: 'Search by name',
  zh: '按名称搜索',
  ja: '名前で検索',
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

const LOG_LABEL: Record<Lang, string> = {
  ko: '📝 먹어봤어요',
  en: '📝 I tried this',
  zh: '📝 我吃过了',
  ja: '📝 食べました',
}

const SPICY_GUIDE: Record<Lang, { title: string; levels: { icon: string; label: string; desc: string }[] }> = {
  ko: {
    title: '🌶️ 맵기 기준',
    levels: [
      { icon: '😊', label: '순함', desc: '2,000 SHU 이하' },
      { icon: '🌶️', label: '보통', desc: '2,000~4,000 SHU (신라면 3,400 SHU)' },
      { icon: '🌶️🌶️', label: '매움', desc: '4,000~6,000 SHU' },
      { icon: '🌶️🌶️🌶️', label: '극매움', desc: '6,000 SHU 이상 (불닭 계열)' },
    ],
  },
  en: {
    title: '🌶️ Spice guide',
    levels: [
      { icon: '😊', label: 'Mild', desc: '2,000 SHU or less' },
      { icon: '🌶️', label: 'Medium', desc: '2,000–4,000 SHU (Shin Ramyun: 3,400 SHU)' },
      { icon: '🌶️🌶️', label: 'Hot', desc: '4,000–6,000 SHU' },
      { icon: '🌶️🌶️🌶️', label: 'Extreme', desc: '6,000+ SHU (Buldak line)' },
    ],
  },
  zh: {
    title: '🌶️ 辣度参考',
    levels: [
      { icon: '😊', label: '微辣', desc: '2,000 SHU 以下' },
      { icon: '🌶️', label: '中辣', desc: '2,000~4,000 SHU（辛拉面：3,400 SHU）' },
      { icon: '🌶️🌶️', label: '辣', desc: '4,000~6,000 SHU' },
      { icon: '🌶️🌶️🌶️', label: '极辣', desc: '6,000 SHU 以上（火鸡面系列）' },
    ],
  },
  ja: {
    title: '🌶️ 辛さの目安',
    levels: [
      { icon: '😊', label: '辛くない', desc: '2,000 SHU 以下' },
      { icon: '🌶️', label: '普通', desc: '2,000〜4,000 SHU（辛ラーメン：3,400 SHU）' },
      { icon: '🌶️🌶️', label: '辛い', desc: '4,000〜6,000 SHU' },
      { icon: '🌶️🌶️🌶️', label: '激辛', desc: '6,000 SHU 以上（プルダック系）' },
    ],
  },
}

const USD_RATE = 1380
const RATE_DATE = 'Jun 2026'

// 매운맛 SHU(스코빌 지수) — 라면어워즈 랭킹 등 근거 확인된 라면만 표시
const SHU_BY_ID: Record<number, { shu: string; sourceUrl: string }> = {
  24: { shu: '5,013 SHU', sourceUrl: 'https://www.ramenawards.com/2024-korea-spiciest-instant-ramen-noodles-ranking-top-1-to-50/' },   // 열라면
  9: { shu: '5,013 SHU', sourceUrl: 'https://www.ramenawards.com/2024-korea-spiciest-instant-ramen-noodles-ranking-top-1-to-50/' },    // 열라면 용기
  25: { shu: '4,404 SHU', sourceUrl: 'https://www.ramenawards.com/2024-korea-spiciest-instant-ramen-noodles-ranking-top-1-to-50/' },   // 불닭볶음면
  10: { shu: '4,404 SHU', sourceUrl: 'https://www.ramenawards.com/2024-korea-spiciest-instant-ramen-noodles-ranking-top-1-to-50/' },   // 큰컵 불닭볶음면
  30: { shu: '9,413 SHU', sourceUrl: 'https://www.ramenawards.com/2024-korea-spiciest-instant-ramen-noodles-ranking-top-1-to-50/' },   // 틈새라면 빨계떡
  27: { shu: '8,706 SHU', sourceUrl: 'https://www.ramenawards.com/2024-korea-spiciest-instant-ramen-noodles-ranking-top-1-to-50/' },   // 핵불닭볶음면
}

const SHU_LABEL: Record<Lang, string> = {
  ko: '출처',
  en: 'Source',
  zh: '来源',
  ja: '出典',
}

const SPICE_NOTE: Record<Lang, string> = {
  ko: '💡 SHU(스코빌 지수)가 표시된 라면은 공식 자료 기준입니다. 나머지 라면의 🌶️ 표시는 편집자 참고 추정치입니다.',
  en: '💡 Ramen with an SHU number are based on published sources. The 🌶️ scale on other items is an editorial estimate.',
  zh: '💡 标有SHU（史高维尔指数）的拉面基于公开资料。其他拉面的🌶️标记为编辑参考估算。',
  ja: '💡 SHU（スコヴィル値）が表示されているラーメンは公式資料に基づいています。その他の🌶️表示は編集部の参考推定値です。',
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
  const router = useRouter()
  const [sortBySpicy, setSortBySpicy] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'cup' | 'bag'>('all')
  const [spicyFilter, setSpicyFilter] = useState<'all' | 'mild' | 'medium' | 'hot' | 'extreme'>('all')
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all')
  const [query, setQuery] = useState('')

  if (items.length === 0) {
    return <p className="text-center text-gray-400 py-20">등록된 라면이 없습니다.</p>
  }

  const q = query.trim().toLowerCase()
  const filteredItems = items.filter(item => {
    if (typeFilter !== 'all' && item.noodle_type !== typeFilter) return false
    if (spicyFilter !== 'all') {
      const level = item.spicy_level ?? 0
      if (spicyFilter === 'mild' && level > 2) return false
      if (spicyFilter === 'medium' && level !== 3) return false
      if (spicyFilter === 'hot' && level !== 4) return false
      if (spicyFilter === 'extreme' && level < 5) return false
    }
    if (priceFilter !== 'all') {
      const price = item.price_krw ?? 0
      if (priceFilter === 'low' && price > 2000) return false
      if (priceFilter === 'mid' && (price < 2000 || price > 3000)) return false
      if (priceFilter === 'high' && price < 3000) return false
    }
    if (q) return (getRamenField(item, 'name', lang) ?? '').toLowerCase().includes(q)
    return true
  })
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
        <p className="text-xs text-orange-700 mt-3 pt-3 border-t border-orange-200 leading-relaxed">{SPICE_NOTE[lang]}</p>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={SEARCH_PLACEHOLDER[lang]}
          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400"
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
            ✕
          </button>
        )}
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

      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1">
        {(['all', 'mild', 'medium', 'hot', 'extreme'] as const).map(s => (
          <button key={s} onClick={() => setSpicyFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors
              ${spicyFilter === s ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {SPICY_FILTER_LABEL[lang][s]}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1">
        {(['all', 'low', 'mid', 'high'] as const).map(p => (
          <button key={p} onClick={() => setPriceFilter(p)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors
              ${priceFilter === p ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {PRICE_FILTER_LABEL[lang][p]}
          </button>
        ))}
      </div>
      {sortedItems.length === 0 && (
        <p className="text-center text-gray-400 py-10 text-sm">
          {query ? `"${query}" — ` : ''}{lang === 'ko' ? '검색 결과가 없습니다.' : lang === 'en' ? 'No results found.' : lang === 'zh' ? '没有找到结果。' : '検索結果がありません。'}
        </p>
      )}
      {sortedItems.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {item.image_url && (
            <div className="relative w-full h-48 overflow-hidden bg-gray-50">
              <Image src={item.image_url} alt="" fill sizes="(max-width: 640px) 100vw, 500px" className="object-contain" />
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
            {SHU_BY_ID[item.id] && (
              <p className="text-xs text-red-500 font-semibold -mt-2">
                🌶️ {SHU_BY_ID[item.id].shu}
                <a href={SHU_BY_ID[item.id].sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 font-normal underline underline-offset-2 ml-1">
                  ({SHU_LABEL[lang]})
                </a>
              </p>
            )}
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

            <button
              onClick={() => router.push(`/ramen-log?ramen_id=${item.id}`)}
              className="w-full text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-100 transition-colors text-left">
              {LOG_LABEL[lang]}
            </button>

          </div>
        </div>
      ))}
    </div>
  )
}
