'use client'
// 편의점 핫바(어묵바/소시지바) 가이드 — 사는 법 안내 + 종류별 정보 카드

import { useLang } from '@/context/LangContext'
import type { HotbarItem, Lang } from '@/lib/types'
import { getHotbarField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  howToBuyTitle: string
  howToBuySteps: string[]
  ingredientsLink: string
  typesTitle: string
  typesNote: string
  priceUnknown: string
}> = {
  ko: {
    intro: '계산대 옆 온장고에 꽂혀 있는 즉석 간식입니다. 가볍게 먹기 좋아 여행 중 부담 없이 시도할 수 있습니다.',
    howToBuyTitle: '🔥 사는 법',
    howToBuySteps: [
      '계산대 근처 온장고에서 원하는 꼬치를 직접 꺼내세요.',
      '계산대로 가져가 계산하세요. 데워져 있어 바로 먹을 수 있습니다.',
      '케첩·머스터드 소스가 옆에 비치되어 있다면 무료로 이용 가능합니다.',
    ],
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    typesTitle: '🍢 핫바 종류',
    typesNote: '아래는 편의점에서 흔히 볼 수 있는 대표 유형입니다. 매장·시기에 따라 실제 상품명과 구성은 다를 수 있어요.',
    priceUnknown: '가격 확인 중',
  },
  en: {
    intro: 'A grab-and-go snack kept warm in a heated case near the register. Easy and low-commitment to try while traveling.',
    howToBuyTitle: '🔥 How to buy',
    howToBuySteps: [
      'Pick your skewer directly from the heated case near the register.',
      'Bring it to the counter to pay. It\'s already warm, so you can eat right away.',
      'If ketchup or mustard is available nearby, it\'s free to use.',
    ],
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    typesTitle: '🍢 Hotbar Types',
    typesNote: 'These are common types found at convenience stores. Actual product names and contents may vary by store and season.',
    priceUnknown: 'Price TBD',
  },
  zh: {
    intro: '放在收银台旁保温柜里的即食小吃，方便轻松，很适合旅行途中随手尝试。',
    howToBuyTitle: '🔥 购买方法',
    howToBuySteps: [
      '直接从收银台附近的保温柜中取出想要的串。',
      '拿到收银台结账，已经加热好可以直接食用。',
      '如果旁边备有番茄酱或芥末，可以免费使用。',
    ],
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    typesTitle: '🍢 关东煮/串类种类',
    typesNote: '以下是便利店常见的代表类型，实际商品名称和构成可能因门店、季节而异。',
    priceUnknown: '价格待确认',
  },
  ja: {
    intro: 'レジ横の温蔵ケースに入っている手軽なおやつです。気軽に試せるので旅行中にもぴったり。',
    howToBuyTitle: '🔥 買い方',
    howToBuySteps: [
      'レジ近くの温蔵ケースから欲しい串を直接取り出します。',
      'レジに持って行って会計します。すでに温かいのですぐ食べられます。',
      'ケチャップやマスタードが近くにあれば無料で使えます。',
    ],
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    typesTitle: '🍢 ホットバーの種類',
    typesNote: '以下はコンビニでよく見かける代表的なタイプです。実際の商品名や内容は店舗・時期により異なる場合があります。',
    priceUnknown: '価格確認中',
  },
}

export default function HotbarView({ items }: { items: HotbarItem[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 사는 법 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.howToBuyTitle}</p>
          <ol className="space-y-2">
            {L.howToBuySteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 성분 확인 링크 */}
        <a
          href="/guide/link-ingredients"
          className="block bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-colors"
        >
          <p className="text-sm font-bold text-amber-800">{L.ingredientsLink}</p>
        </a>

        {/* 핫바 종류 목록 */}
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
                <h2 className="text-base font-bold text-gray-900">{getHotbarField(item, 'name', lang)}</h2>
                <span className="text-sm font-semibold text-gray-800">
                  {item.price_krw ? `₩${item.price_krw.toLocaleString()}` : L.priceUnknown}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{getHotbarField(item, 'flavor_desc', lang)}</p>
              {getHotbarField(item, 'allergen_note', lang) && (
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-2">
                  {getHotbarField(item, 'allergen_note', lang)}
                </p>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
