'use client'
// 편의점 삼각김밥 가이드 — 포장 뜯는 법 안내 + 맛 종류별 정보 카드

import { useLang } from '@/context/LangContext'
import type { GimbapItem, Lang } from '@/lib/types'
import { getGimbapField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  howToOpenTitle: string
  howToOpenSteps: string[]
  ingredientsLink: string
  flavorsTitle: string
  priceUnknown: string
}> = {
  ko: {
    intro: '겉보기엔 다 비슷해 보이지만, 포장 뜯는 법을 모르면 밥이 흩어지고 김이 눅눅해집니다.',
    howToOpenTitle: '📦 포장 뜯는 법 (3단계)',
    howToOpenSteps: [
      '포장 앞면에 적힌 숫자 순서(①→②→③)를 확인하세요.',
      '① 스티커를 먼저 떼어내고, ② 비닐을 양쪽으로 잡아당겨 벗겨냅니다.',
      '③ 마지막 비닐을 아래로 당겨 빼면 김이 밥을 감싼 채로 완성됩니다.',
    ],
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    flavorsTitle: '🍙 맛 종류',
    priceUnknown: '가격 확인 중',
  },
  en: {
    intro: 'They all look similar, but if you don\'t know how to unwrap it, the rice falls apart and the seaweed gets soggy.',
    howToOpenTitle: '📦 How to unwrap (3 steps)',
    howToOpenSteps: [
      'Check the numbers printed on the front (①→②→③).',
      '① Peel off the sticker first, ② pull the plastic apart from both sides.',
      '③ Pull the last strip of plastic down and out — the seaweed wraps around the rice automatically.',
    ],
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    flavorsTitle: '🍙 Flavors',
    priceUnknown: 'Price TBD',
  },
  zh: {
    intro: '外观看起来都差不多，但如果不知道怎么拆包装，米饭会散开，海苔也会变软。',
    howToOpenTitle: '📦 拆包装方法（3步）',
    howToOpenSteps: [
      '确认包装正面印刷的数字顺序（①→②→③）。',
      '① 先撕掉贴纸，② 把两侧的塑料膜向外拉开。',
      '③ 最后把剩下的塑料膜向下抽出，海苔就会自动包裹住米饭。',
    ],
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    flavorsTitle: '🍙 口味种类',
    priceUnknown: '价格待确认',
  },
  ja: {
    intro: '見た目はどれも似ていますが、開け方を知らないとご飯が崩れたり海苔が湿ったりします。',
    howToOpenTitle: '📦 包装の開け方（3ステップ）',
    howToOpenSteps: [
      'パッケージ正面の数字の順番（①→②→③）を確認します。',
      '① シールを先にはがし、② 両側のフィルムを引っ張って剥がします。',
      '③ 最後のフィルムを下に引き抜くと、海苔がご飯を包んだ状態で完成します。',
    ],
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    flavorsTitle: '🍙 味の種類',
    priceUnknown: '価格確認中',
  },
}

export default function GimbapView({ items }: { items: GimbapItem[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]

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

        {/* 포장 뜯는 법 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.howToOpenTitle}</p>
          <ol className="space-y-2">
            {L.howToOpenSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 맛 종류 목록 */}
        <p className="text-base font-bold text-gray-900 pt-2">{L.flavorsTitle}</p>
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">{getGimbapField(item, 'name', lang)}</h2>
                <span className="text-sm font-semibold text-gray-800">
                  {item.price_krw ? `₩${item.price_krw.toLocaleString()}` : L.priceUnknown}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{getGimbapField(item, 'flavor_desc', lang)}</p>
              {getGimbapField(item, 'allergen_note', lang) && (
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-2">
                  {getGimbapField(item, 'allergen_note', lang)}
                </p>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
