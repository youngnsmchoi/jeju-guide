'use client'
// 편의점 도시락 가이드 — 데우는 법 안내 + 종류별 구성/정보 카드

import { useLang } from '@/context/LangContext'
import type { DosirakItem, Lang } from '@/lib/types'
import { getDosirakField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  howToHeatTitle: string
  howToHeatSteps: string[]
  ingredientsLink: string
  typesTitle: string
  typesNote: string
  compositionLabel: string
  priceUnknown: string
}> = {
  ko: {
    intro: '도시락은 종류마다 구성이 달라서, 뭐가 들었는지 미리 알고 고르면 훨씬 만족스럽습니다.',
    howToHeatTitle: '🔥 데우는 법 (전자레인지)',
    howToHeatSteps: [
      '뚜껑을 완전히 닫지 말고 한쪽 모서리를 살짝 들어 올려 김이 빠질 틈을 만드세요.',
      '별도 소스 봉지가 있다면 반드시 먼저 꺼내세요 (전자레인지에 넣으면 안 됩니다).',
      '전자레인지에 표시된 시간(보통 1~2분) 동안 데운 뒤, 소스를 다시 뿌려 드세요.',
    ],
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    typesTitle: '🍱 도시락 종류',
    typesNote: '아래는 편의점에서 흔히 볼 수 있는 대표 유형입니다. 매장·시기에 따라 실제 상품명과 구성은 다를 수 있어요.',
    compositionLabel: '구성',
    priceUnknown: '가격 확인 중',
  },
  en: {
    intro: 'Each bento has different contents, so knowing what\'s inside beforehand makes for a better choice.',
    howToHeatTitle: '🔥 How to heat (microwave)',
    howToHeatSteps: [
      'Don\'t close the lid all the way — lift one corner slightly so steam can escape.',
      'If there\'s a separate sauce packet, take it out first (never microwave it).',
      'Heat for the time printed on the label (usually 1-2 min), then pour the sauce back on.',
    ],
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    typesTitle: '🍱 Bento Types',
    typesNote: 'These are common types found at convenience stores. Actual product names and contents may vary by store and season.',
    compositionLabel: 'What\'s inside',
    priceUnknown: 'Price TBD',
  },
  zh: {
    intro: '每种便当的构成都不同，提前了解里面有什么，选起来会更满意。',
    howToHeatTitle: '🔥 加热方法（微波炉）',
    howToHeatSteps: [
      '不要完全盖紧盖子，稍微掀起一角留出蒸汽排出的缝隙。',
      '如果有单独的酱料包，请务必先取出（不可放入微波炉加热）。',
      '按标签上标注的时间（通常1~2分钟）加热后，再淋上酱料食用。',
    ],
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    typesTitle: '🍱 便当种类',
    typesNote: '以下是便利店常见的代表类型，实际商品名称和构成可能因门店、季节而异。',
    compositionLabel: '内含',
    priceUnknown: '价格待确认',
  },
  ja: {
    intro: '弁当は種類ごとに中身が違うので、事前に知っておくとより満足のいく選択ができます。',
    howToHeatTitle: '🔥 温め方（電子レンジ）',
    howToHeatSteps: [
      'フタは完全に閉めず、片隅を少し持ち上げて蒸気の抜け道を作ります。',
      '別添えのソース袋がある場合は必ず先に取り出してください（電子レンジに入れないでください）。',
      '表示された時間（通常1〜2分）温めた後、ソースをかけてお召し上がりください。',
    ],
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    typesTitle: '🍱 弁当の種類',
    typesNote: '以下はコンビニでよく見かける代表的なタイプです。実際の商品名や内容は店舗・時期により異なる場合があります。',
    compositionLabel: '内容',
    priceUnknown: '価格確認中',
  },
}

export default function DosirakView({ items }: { items: DosirakItem[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 성분 확인 링크 */}
        <a
          href="/guide/link-ingredients"
          className="block bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-colors"
        >
          <p className="text-sm font-bold text-amber-800">{L.ingredientsLink}</p>
        </a>

        {/* 데우는 법 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.howToHeatTitle}</p>
          <ol className="space-y-2">
            {L.howToHeatSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 도시락 종류 목록 */}
        <div className="pt-2">
          <p className="text-base font-bold text-gray-900">{L.typesTitle}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{L.typesNote}</p>
        </div>
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">{getDosirakField(item, 'name', lang)}</h2>
                <span className="text-sm font-semibold text-gray-800">
                  {item.price_krw ? `₩${item.price_krw.toLocaleString()}` : L.priceUnknown}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{getDosirakField(item, 'flavor_desc', lang)}</p>
              {getDosirakField(item, 'composition', lang) && (
                <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-2.5 py-1.5">
                  <span className="font-semibold">{L.compositionLabel}: </span>
                  {getDosirakField(item, 'composition', lang)}
                </p>
              )}
              {getDosirakField(item, 'allergen_note', lang) && (
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-2">
                  {getDosirakField(item, 'allergen_note', lang)}
                </p>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
