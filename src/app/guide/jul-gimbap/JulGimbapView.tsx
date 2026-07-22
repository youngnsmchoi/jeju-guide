'use client'
// 편의점 줄김밥 가이드 — 종류별 구성/정보 카드

import { useLang } from '@/context/LangContext'
import type { JulGimbapItem, Lang } from '@/lib/types'
import { getJulGimbapField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  ingredientsLink: string
  typesTitle: string
  typesNote: string
  compositionLabel: string
  priceUnknown: string
}> = {
  ko: {
    intro: '삼각김밥보다 크고 든든한 한 끼용 김밥입니다. 속 재료에 따라 맛이 크게 달라집니다.',
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    typesTitle: '🍙 줄김밥 종류',
    typesNote: '아래는 편의점에서 흔히 볼 수 있는 대표 유형입니다. 매장·시기에 따라 실제 상품명과 구성은 다를 수 있어요.',
    compositionLabel: '구성',
    priceUnknown: '가격 확인 중',
  },
  en: {
    intro: 'A bigger, heartier roll than triangle gimbap. The flavor changes a lot depending on the filling.',
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    typesTitle: '🍙 Gimbap Roll Types',
    typesNote: 'These are common types found at convenience stores. Actual product names and contents may vary by store and season.',
    compositionLabel: 'What\'s inside',
    priceUnknown: 'Price TBD',
  },
  zh: {
    intro: '比饭团更大更有饱腹感的一餐紫菜卷，口味根据馅料不同差异很大。',
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    typesTitle: '🍙 紫菜卷种类',
    typesNote: '以下是便利店常见的代表类型，实际商品名称和构成可能因门店、季节而异。',
    compositionLabel: '内含',
    priceUnknown: '价格待确认',
  },
  ja: {
    intro: 'おにぎりより大きく食べ応えのある海苔巻き。中身によって味が大きく変わります。',
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    typesTitle: '🍙 海苔巻きの種類',
    typesNote: '以下はコンビニでよく見かける代表的なタイプです。実際の商品名や内容は店舗・時期により異なる場合があります。',
    compositionLabel: '内容',
    priceUnknown: '価格確認中',
  },
}

export default function JulGimbapView({ items }: { items: JulGimbapItem[] }) {
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

        {/* 줄김밥 종류 목록 */}
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
                <h2 className="text-base font-bold text-gray-900">{getJulGimbapField(item, 'name', lang)}</h2>
                <span className="text-sm font-semibold text-gray-800">
                  {item.price_krw ? `₩${item.price_krw.toLocaleString()}` : L.priceUnknown}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{getJulGimbapField(item, 'flavor_desc', lang)}</p>
              {getJulGimbapField(item, 'composition', lang) && (
                <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-2.5 py-1.5">
                  <span className="font-semibold">{L.compositionLabel}: </span>
                  {getJulGimbapField(item, 'composition', lang)}
                </p>
              )}
              {getJulGimbapField(item, 'allergen_note', lang) && (
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-2">
                  {getJulGimbapField(item, 'allergen_note', lang)}
                </p>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
