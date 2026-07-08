'use client'
// 라면 끓이는 법 — 컵/봉지/비벼먹기 탭 전환

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Item, Lang } from '@/lib/types'
import { getContent } from '@/lib/types'
import BlockRenderer from '@/components/BlockRenderer'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

type Tab = 'cup' | 'bag' | 'dry'

const LABEL: Record<Lang, {
  title: string
  cup: string; bag: string; dry: string
  comingSoon: string
  hotWaterTitle: string
  hotWaterSteps: string[]
  eatPlaceTitle: string
  eatPlaceSteps: string[]
}> = {
  ko: {
    title: '라면 끓이는 법', cup: '컵라면', bag: '봉지라면', dry: '비벼먹기', comingSoon: '준비 중입니다.',
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
    title: 'How to Cook', cup: 'Cup', bag: 'Bag', dry: 'Dry Style', comingSoon: 'Coming soon.',
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
    title: '如何烹饪', cup: '杯面', bag: '袋面', dry: '干拌', comingSoon: '即将推出。',
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
    title: '作り方', cup: 'カップ', bag: '袋', dry: 'まぜそば', comingSoon: '準備中です。',
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

const BAG_STEPS: Record<Lang, { title: string; desc: string }[]> = {
  ko: [
    { title: '물 550ml 끓이기', desc: '냄비에 물 550ml를 넣고 끓이세요.' },
    { title: '면과 스프 넣기', desc: '물이 끓으면 면과 스프를 함께 넣으세요.' },
    { title: '3~4분 끓이기', desc: '중불에서 3~4분간 끓이며 가끔 저어주세요.' },
    { title: '그릇에 담기', desc: '불을 끄고 그릇에 담아 바로 드세요.' },
  ],
  en: [
    { title: '1. Boil 550ml Water', desc: 'Pour 550ml of water into a pot and bring to a boil.' },
    { title: '2. Add Noodle & Seasoning', desc: 'Once boiling, add the noodles and soup base together.' },
    { title: '3. Cook & Stir', desc: 'Boil for 3–4 minutes over medium heat, stirring occasionally.' },
    { title: '4. Serve & Enjoy', desc: 'Turn off heat, pour into a bowl and serve immediately.' },
  ],
  zh: [
    { title: '1. 烧550ml水', desc: '锅中加入550ml水，大火烧开。' },
    { title: '2. 放入面条和汤料', desc: '水开后，同时放入面条和汤料包。' },
    { title: '3. 煮3~4分钟', desc: '中火煮3~4分钟，偶尔搅拌一下。' },
    { title: '4. 盛碗享用', desc: '关火，盛入碗中立即享用。' },
  ],
  ja: [
    { title: '1. 水550mlを沸かす', desc: '鍋に水550mlを入れて沸騰させてください。' },
    { title: '2. 麺とスープを入れる', desc: '沸騰したら麺とスープの素を一緒に入れてください。' },
    { title: '3. 3〜4分煮る', desc: '中火で3〜4分煮ながら、時々かき混ぜてください。' },
    { title: '4. 器に盛る', desc: '火を止めて器に盛り、すぐにお召し上がりください。' },
  ],
}

const DRY_STEPS: Record<Lang, { title: string; desc: string }[]> = {
  ko: [
    { title: '물 적게 끓이기', desc: '봉지라면보다 물을 적게 넣으세요. (약 100~150ml 적게)' },
    { title: '면만 넣기', desc: '물이 끓으면 면만 넣으세요. 스프는 아직 넣지 마세요.' },
    { title: '물 따라내기', desc: '면이 익으면 물을 최대한 따라내세요. 조금만 남겨도 됩니다.' },
    { title: '소스 비벼서 완성', desc: '스프·소스를 넣고 면에 골고루 비벼서 바로 드세요.' },
  ],
  en: [
    { title: '1. Boil Less Water', desc: 'Use less water than for regular bag ramen. (Approx. 100~150ml less)' },
    { title: '2. Add Noodle Only', desc: 'Once boiling, add only the noodles. Save the seasoning for later.' },
    { title: '3. Drain Water', desc: 'Once noodles are cooked, drain most of the water, leaving just a little.' },
    { title: '4. Mix Sauce & Serve', desc: 'Add the seasoning sauce and mix thoroughly until fully coated. Serve and enjoy.' },
  ],
  zh: [
    { title: '1. 少加水', desc: '比普通袋面少加100~150ml水。' },
    { title: '2. 只放面条', desc: '水开后只放面条，暂时不放调料包。' },
    { title: '3. 倒掉水', desc: '面条煮熟后，把水大部分倒掉，留一点点即可。' },
    { title: '4. 拌酱享用', desc: '加入调料酱，充分拌匀后立即享用。' },
  ],
  ja: [
    { title: '1. 水を少なめに沸かす', desc: '袋麺より水を少なめに。(約100〜150ml少なく)' },
    { title: '2. 麺だけ入れる', desc: '沸騰したら麺だけ入れてください。スープの素はまだ入れません。' },
    { title: '3. 水を切る', desc: '麺が茹で上がったら、水をできるだけ切ってください。少し残してもOK。' },
    { title: '4. ソースを混ぜて完成', desc: 'スープの素・ソースを入れて麺全体によく混ぜ、すぐにお召し上がりください。' },
  ],
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
  const L = LABEL[lang]
  const [tab, setTab] = useState<Tab>('cup')

  const tabLabel = (t: Tab) => t === 'cup' ? L.cup : t === 'bag' ? L.bag : L.dry

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-lg mx-auto flex gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors
                ${tab === t ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {tabLabel(t)}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-20 space-y-4">
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
        {tab === 'bag' && (
          <div className="space-y-4">
            {BAG_STEPS[lang].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <img src={`/cooking/bag-${i + 1}.png`} alt={step.title} className="w-full object-cover" />
                <div className="px-4 py-3 flex gap-3 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'dry' && (
          <div className="space-y-4">
            {DRY_STEPS[lang].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <img src={`/cooking/dry-${i + 1}.png`} alt={step.title} className="w-full object-cover" />
                <div className="px-4 py-3 flex gap-3 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
