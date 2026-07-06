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
  hotWaterTitle: string
  hotWaterSteps: string[]
  eatPlaceTitle: string
  eatPlaceSteps: string[]
}> = {
  ko: {
    title: '라면 끓이는 법', back: '← 뒤로', cup: '☕ 컵라면', bag: '🍜 봉지라면', dry: '🥢 비벼먹기', comingSoon: '준비 중입니다.',
    hotWaterTitle: '💧 뜨거운 물 받는 법',
    hotWaterSteps: [
      '카운터 옆 온수기를 찾으세요. (대부분 편의점에 비치)',
      '컵라면 뚜껑을 반쯤 열고 표시선까지 물을 부으세요.',
      '뚜껑을 닫고 3~5분 기다리세요. (뚜껑 위에 소스 봉지를 올려두면 좋아요)',
    ],
    eatPlaceTitle: '🪑 어디서 먹나요?',
    eatPlaceSteps: [
      '대부분의 편의점에 이트인(eat-in) 공간이 있습니다.',
      '카운터에서 "이트인 되나요?" 라고 물어보세요.',
      '이트인 공간이 없으면 근처 공원·벤치를 이용하세요.',
    ],
  },
  en: {
    title: 'How to Cook', back: '← Back', cup: '☕ Cup', bag: '🍜 Bag', dry: '🥢 Dry Style', comingSoon: 'Coming soon.',
    hotWaterTitle: '💧 How to get hot water',
    hotWaterSteps: [
      'Find the hot water dispenser near the counter. (Available at most convenience stores)',
      'Open the lid halfway and fill water to the marked line.',
      'Close the lid and wait 3–5 minutes. (Place the sauce packet on top to keep it warm)',
    ],
    eatPlaceTitle: '🪑 Where to eat',
    eatPlaceSteps: [
      'Most convenience stores have an eat-in seating area.',
      'Ask the cashier: "Can I eat here?"',
      'If there\'s no seating, look for a nearby park or bench.',
    ],
  },
  zh: {
    title: '如何烹饪', back: '← 返回', cup: '☕ 杯面', bag: '🍜 袋面', dry: '🥢 干拌', comingSoon: '即将推出。',
    hotWaterTitle: '💧 如何接热水',
    hotWaterSteps: [
      '在收银台旁找热水机。(大多数便利店都有)',
      '将杯盖半开，加水至标示线。',
      '盖上盖子等待3~5分钟。(可以把酱料包放在盖子上保温)',
    ],
    eatPlaceTitle: '🪑 在哪里吃',
    eatPlaceSteps: [
      '大多数便利店都有堂食区域。',
      '可以问收银员："可以在这里吃吗？"',
      '如果没有堂食区，可以去附近的公园或长椅。',
    ],
  },
  ja: {
    title: '作り方', back: '← 戻る', cup: '☕ カップ', bag: '🍜 袋', dry: '🥢 まぜそば', comingSoon: '準備中です。',
    hotWaterTitle: '💧 お湯の注ぎ方',
    hotWaterSteps: [
      'レジ横のお湯サーバーを探してください。(ほとんどのコンビニにあります)',
      'フタを半分開けて、表示線までお湯を注いでください。',
      'フタを閉めて3〜5分待ちます。(ソースの袋をフタの上に置くと保温できます)',
    ],
    eatPlaceTitle: '🪑 どこで食べる？',
    eatPlaceSteps: [
      'ほとんどのコンビニにイートインスペースがあります。',
      '店員に「ここで食べられますか？」と聞いてみましょう。',
      'イートインがない場合は、近くの公園やベンチを利用してください。',
    ],
  },
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

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {tab === 'cup' && (
          <>
            <TabContent item={cupItem} lang={lang} emptyEmoji="☕" comingSoon={L.comingSoon} />
            {/* 온수기 사용법 */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-bold text-blue-800">{L.hotWaterTitle}</p>
              <ol className="space-y-2">
                {L.hotWaterSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-blue-700">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* 먹는 장소 */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-bold text-emerald-800">{L.eatPlaceTitle}</p>
              <ol className="space-y-2">
                {L.eatPlaceSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-emerald-700">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
        {tab === 'bag' && <TabContent item={bagItem} lang={lang} emptyEmoji="🍜" comingSoon={L.comingSoon} />}
        {tab === 'dry' && <TabContent item={dryItem} lang={lang} emptyEmoji="🥢" comingSoon={L.comingSoon} />}
      </main>
    </div>
  )
}
