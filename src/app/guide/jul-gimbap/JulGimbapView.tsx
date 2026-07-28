'use client'
// 편의점 김밥 가이드 — 종류별 구성/정보 카드

import { useLang } from '@/context/LangContext'
import type { JulGimbapItem, Lang } from '@/lib/types'
import { getJulGimbapField } from '@/lib/types'
import NavBar from '@/components/NavBar'
import FlavorCategoryList, { buildFlavorCategories } from '@/components/FlavorCategoryList'
import WordGlossary, { type GlossaryWord } from '@/components/WordGlossary'

const FLAVOR_CATEGORIES = buildFlavorCategories({
  mild: { ko: '참치김밥', en: 'Tuna Gimbap', zh: '金枪鱼紫菜卷', ja: 'ツナ海苔巻き' },
  meat: { ko: '진짜 소불고기김밥, 치즈김밥 등', en: 'Beef bulgogi gimbap, cheese gimbap, etc.', zh: '真烤牛肉紫菜卷、芝士紫菜卷等', ja: '本物の牛プルコギ海苔巻き、チーズ海苔巻きなど' },
  spicy: { ko: '전주비빔김밥 등', en: 'Jeonju bibim gimbap, etc.', zh: '全州拌饭紫菜卷等', ja: '全州ビビン海苔巻きなど' },
})

const LABEL: Record<Lang, {
  intro: string
  howToOpenTitle: string
  howToOpenSteps: string[]
  ingredientsLink: string
  typesTitle: string
  typesNote: string
  compositionLabel: string
  priceUnknown: string
}> = {
  ko: {
    intro: '삼각김밥보다 크고 든든한 한 끼용 김밥입니다. 속 재료에 따라 맛이 크게 달라집니다.',
    howToOpenTitle: '📦 포장 뜯기 · 데우는 법',
    howToOpenSteps: [
      '포장지 상단이나 하단의 절취선을 찾아 가볍게 잡아당겨 벗기세요.',
      '전자레인지에 데울 땐 겉 포장지를 살짝 뜯은 상태로 30~40초만 데우세요. 밥이 촉촉해지고 속 재료의 풍미가 살아납니다.',
    ],
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    typesTitle: '🍙 김밥 종류',
    typesNote: '아래는 편의점에서 흔히 볼 수 있는 대표 유형입니다. 매장·시기에 따라 실제 상품명과 구성은 다를 수 있어요.',
    compositionLabel: '구성',
    priceUnknown: '가격 확인 중',
  },
  en: {
    intro: 'A bigger, heartier roll than triangle gimbap. The flavor changes a lot depending on the filling.',
    howToOpenTitle: '📦 Unwrapping & heating',
    howToOpenSteps: [
      'Find the perforated line at the top or bottom of the wrapper and gently pull it open.',
      'To microwave, leave the outer wrapper slightly open and heat for just 30-40 seconds. This keeps the rice moist and brings out the filling\'s flavor.',
    ],
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    typesTitle: '🍙 Gimbap Roll Types',
    typesNote: 'These are common types found at convenience stores. Actual product names and contents may vary by store and season.',
    compositionLabel: 'What\'s inside',
    priceUnknown: 'Price TBD',
  },
  zh: {
    intro: '比饭团更大更有饱腹感的一餐紫菜卷，口味根据馅料不同差异很大。',
    howToOpenTitle: '📦 拆包装·加热方法',
    howToOpenSteps: [
      '找到包装上下方的切割线，轻轻拉开。',
      '用微波炉加热时，外包装稍微撕开一点，只加热30~40秒即可，米饭会更湿润，馅料风味也会更好。',
    ],
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    typesTitle: '🍙 紫菜卷种类',
    typesNote: '以下是便利店常见的代表类型，实际商品名称和构成可能因门店、季节而异。',
    compositionLabel: '内含',
    priceUnknown: '价格待确认',
  },
  ja: {
    intro: 'おにぎりより大きく食べ応えのある海苔巻き。中身によって味が大きく変わります。',
    howToOpenTitle: '📦 包装の開け方・温め方',
    howToOpenSteps: [
      '包装の上下にあるミシン目を見つけて、軽く引っ張って開けてください。',
      '電子レンジで温める場合は、外側の包装を少し開けた状態で30〜40秒だけ温めてください。ご飯がしっとりし、具材の風味も引き立ちます。',
    ],
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    typesTitle: '🍙 海苔巻きの種類',
    typesNote: '以下はコンビニでよく見かける代表的なタイプです。実際の商品名や内容は店舗・時期により異なる場合があります。',
    compositionLabel: '内容',
    priceUnknown: '価格確認中',
  },
}

const WORDS: GlossaryWord[] = [
  { word: '참치', meaning: { ko: '참치 (생선)', en: 'Tuna (fish)', zh: '金枪鱼', ja: 'ツナ（魚）' } },
  { word: '소불고기', meaning: { ko: '간장 양념 소고기', en: 'Soy-marinated beef', zh: '酱油腌制的牛肉', ja: '醤油ダレの牛肉' } },
  { word: '치즈', meaning: { ko: '치즈', en: 'Cheese', zh: '芝士', ja: 'チーズ' } },
  { word: '전주비빔', meaning: { ko: '고추장 비빔 채소·나물', en: 'Gochujang-mixed vegetables', zh: '辣椒酱拌蔬菜', ja: 'コチュジャン和え野菜' } },
  { word: '매운/매콤', meaning: { ko: '매운맛', en: 'Spicy', zh: '辣味', ja: '辛い' } },
]

export default function JulGimbapView({ items }: { items: JulGimbapItem[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 포장 뜯기 · 데우는 법 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.howToOpenTitle}</p>
          <ol className="space-y-2">
            {L.howToOpenSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 맛 카테고리 3단계 (부드러운 맛 / 익숙한 고기맛 / 매운맛) */}
        <FlavorCategoryList categories={FLAVOR_CATEGORIES} />

        {/* 성분 확인 링크 */}
        <a
          href="/guide/link-ingredients"
          className="block bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-colors"
        >
          <p className="text-sm font-bold text-amber-800">{L.ingredientsLink}</p>
        </a>

        {/* 김밥 종류 목록 */}
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

        <WordGlossary words={WORDS} />
      </main>
    </div>
  )
}
