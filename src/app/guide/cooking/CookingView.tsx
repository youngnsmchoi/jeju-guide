'use client'
// 라면 끓이는 법 — 컵/봉지/비벼먹기 탭 전환

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Item, Lang } from '@/lib/types'
import { getContent } from '@/lib/types'
import BlockRenderer from '@/components/BlockRenderer'

type Tab = 'cup' | 'bag' | 'dry'

const LABEL: Record<Lang, {
  title: string; back: string
  cup: string; bag: string; dry: string
  comingSoon: string
}> = {
  ko: { title: '라면 끓이는 법', back: '← 뒤로', cup: '☕ 컵라면', bag: '🍜 봉지라면', dry: '🥢 비벼먹기', comingSoon: '준비 중입니다.' },
  en: { title: 'How to Cook', back: '← Back', cup: '☕ Cup', bag: '🍜 Bag', dry: '🥢 Dry Style', comingSoon: 'Coming soon.' },
  zh: { title: '如何烹饪', back: '← 返回', cup: '☕ 杯面', bag: '🍜 袋面', dry: '🥢 干拌', comingSoon: '即将推出。' },
  ja: { title: '作り方', back: '← 戻る', cup: '☕ カップ', bag: '🍜 袋', dry: '🥢 まぜそば', comingSoon: '準備中です。' },
}

const TABS: Tab[] = ['cup', 'bag', 'dry']

function TabContent({ item, lang, emptyEmoji, comingSoon }: {
  item: Item | null; lang: Lang; emptyEmoji: string; comingSoon: string
}) {
  if (!item || (!getContent(item, lang) && !item.image_url && !(Array.isArray(item.blocks) && item.blocks.length > 0))) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-4xl mb-3">{emptyEmoji}</span>
        <p className="text-gray-400 text-sm">{comingSoon}</p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {item.image_url && (
        <img src={item.image_url} alt="" className="w-full rounded-2xl object-cover max-h-48" />
      )}
      {getContent(item, lang) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {getContent(item, lang)}
        </div>
      )}
      {Array.isArray(item.blocks) && item.blocks.length > 0 && (
        <BlockRenderer blocks={item.blocks} lang={lang} />
      )}
    </div>
  )
}

export default function CookingView({ cupItem, bagItem, dryItem }: {
  cupItem: Item | null; bagItem: Item | null; dryItem: Item | null
}) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]
  const [tab, setTab] = useState<Tab>('cup')

  const tabLabel = (t: Tab) => t === 'cup' ? L.cup : t === 'bag' ? L.bag : L.dry

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="w-12" />
        </div>
        <div className="max-w-lg mx-auto flex gap-2 mt-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors
                ${tab === t ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {tabLabel(t)}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        {tab === 'cup' && <TabContent item={cupItem} lang={lang} emptyEmoji="☕" comingSoon={L.comingSoon} />}
        {tab === 'bag' && <TabContent item={bagItem} lang={lang} emptyEmoji="🍜" comingSoon={L.comingSoon} />}
        {tab === 'dry' && <TabContent item={dryItem} lang={lang} emptyEmoji="🥢" comingSoon={L.comingSoon} />}
      </main>
    </div>
  )
}
