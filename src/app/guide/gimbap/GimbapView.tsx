'use client'
// 편의점 삼각김밥 가이드 — 포장 뜯는 법(고정 지식) + 실물로 직접 확인하는 법 안내
// 삼각김밥은 신상품 회전이 빠르고 편의점 브랜드마다 취급 상품이 달라 DB 목록 대신
// 대표 예시 몇 개만 하드코딩하고, 실제 상품 정보는 매장에서 직접 확인하도록 안내

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  howToOpenLink: string
  examplesTitle: string
  examplesNote: string
  howToCheckTitle: string
  priceCheckTitle: string
  priceCheckDesc: string
  ingredientsLink: string
  wordsTitle: string
  wordsNote: string
}> = {
  ko: {
    intro: '겉보기엔 다 비슷해 보이지만, 포장 뜯는 법을 모르면 밥이 흩어지고 김이 눅눅해집니다.',
    howToOpenLink: '📦 포장 뜯는 법 (실물 사진으로 보기) →',
    examplesTitle: '🍙 대표 맛 예시',
    examplesNote: '편의점마다, 시기마다 파는 맛이 계속 바뀝니다. 아래는 거의 항상 볼 수 있는 스테디셀러 2가지입니다.',
    howToCheckTitle: '🔍 매장에서 직접 확인하는 법',
    priceCheckTitle: '💰 가격 확인',
    priceCheckDesc: '포장 앞면 하단 또는 매대에 붙은 가격표에 표시되어 있습니다. 대부분 ₩1,500~₩2,000 사이입니다.',
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    wordsTitle: '📖 포장에서 자주 보이는 한글 단어',
    wordsNote: '맛 이름 앞에 붙는 이 단어들만 알아도 대략적인 맛을 짐작할 수 있습니다.',
  },
  en: {
    intro: 'They all look similar, but if you don\'t know how to unwrap it, the rice falls apart and the seaweed gets soggy.',
    howToOpenLink: '📦 How to unwrap (see real photos) →',
    examplesTitle: '🍙 Popular examples',
    examplesNote: 'Flavors change constantly by store and season. Here are two steady sellers you\'ll almost always find.',
    howToCheckTitle: '🔍 How to check in-store',
    priceCheckTitle: '💰 Checking the price',
    priceCheckDesc: 'Printed on the bottom front of the package or on the shelf price tag. Most cost between ₩1,500-₩2,000.',
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    wordsTitle: '📖 Common Korean words on the package',
    wordsNote: 'Knowing these words in front of the flavor name gives you a rough idea of the taste.',
  },
  zh: {
    intro: '外观看起来都差不多，但如果不知道怎么拆包装，米饭会散开，海苔也会变软。',
    howToOpenLink: '📦 拆包装方法（查看实物照片） →',
    examplesTitle: '🍙 代表口味示例',
    examplesNote: '口味会因门店和季节不断变化。以下是几乎随时都能买到的长销款2种。',
    howToCheckTitle: '🔍 在门店直接确认的方法',
    priceCheckTitle: '💰 确认价格',
    priceCheckDesc: '标注在包装正面下方或货架价签上，大多在₩1,500~₩2,000之间。',
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    wordsTitle: '📖 包装上常见的韩文单词',
    wordsNote: '了解这些出现在口味名称前的单词，就能大致推测出味道。',
  },
  ja: {
    intro: '見た目はどれも似ていますが、開け方を知らないとご飯が崩れたり海苔が湿ったりします。',
    howToOpenLink: '📦 包装の開け方（実物写真で見る） →',
    examplesTitle: '🍙 代表的な味の例',
    examplesNote: 'コンビニや時期によって味は常に変わります。以下はほぼいつでも見かける定番2種です。',
    howToCheckTitle: '🔍 店頭で自分で確認する方法',
    priceCheckTitle: '💰 価格の確認',
    priceCheckDesc: 'パッケージ正面下部、または棚の価格タグに表示されています。ほとんどが₩1,500〜₩2,000の間です。',
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    wordsTitle: '📖 パッケージでよく見る韓国語単語',
    wordsNote: '味の名前の前につくこれらの単語を知っておくと、おおよその味が想像できます。',
  },
}

type Example = { emoji: string; name: Record<Lang, string>; desc: Record<Lang, string> }

const EXAMPLES: Example[] = [
  {
    emoji: '🐟',
    name: { ko: '참치마요', en: 'Tuna Mayo', zh: '金枪鱼蛋黄酱', ja: 'ツナマヨ' },
    desc: {
      ko: '참치와 마요네즈를 버무린 속. 짜지 않고 부드러워 가장 무난한 맛.',
      en: 'Tuna mixed with mayonnaise. Mild and creamy — the safest first pick.',
      zh: '金枪鱼拌蛋黄酱馅料，口味温和不咸，是最容易接受的口味。',
      ja: 'ツナとマヨネーズを和えた具材。塩気が少なくまろやかで一番食べやすい味。',
    },
  },
  {
    emoji: '🌶️',
    name: { ko: '전주비빔', en: 'Jeonju Bibim', zh: '全州拌饭', ja: '全州ビビン' },
    desc: {
      ko: '고추장 양념 나물밥. 매콤달콤한 맛으로, 매운맛에 거부감 없는 사람에게 추천.',
      en: 'Rice mixed with gochujang and seasoned vegetables. Recommend only if you can handle mild spice.',
      zh: '拌有辣椒酱和蔬菜的米饭，微辣，能吃辣的人推荐尝试。',
      ja: 'コチュジャンで和えたナムル入りご飯。辛さが平気な方向け。',
    },
  },
]

const WORDS: { word: string; meaning: Record<Lang, string> }[] = [
  { word: '참치', meaning: { ko: '참치 (생선)', en: 'Tuna (fish)', zh: '金枪鱼', ja: 'ツナ（魚）' } },
  { word: '매운/매콤', meaning: { ko: '매운맛', en: 'Spicy', zh: '辣味', ja: '辛い' } },
  { word: '불고기', meaning: { ko: '간장 양념 고기', en: 'Soy-marinated meat', zh: '酱油腌制的肉', ja: '醤油ダレの肉' } },
  { word: '스팸', meaning: { ko: '햄 (돼지고기)', en: 'Spam (pork)', zh: '午餐肉（猪肉）', ja: 'スパム（豚肉）' } },
  { word: '멸치', meaning: { ko: '작은 생선 볶음', en: 'Small dried anchovy', zh: '小鳀鱼', ja: 'いりこ（小魚）' } },
]

export default function GimbapView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 포장 뜯는 법 — 실물 사진 있는 link-cvs-tips로 연결 */}
        <a
          href="/guide/link-cvs-tips?tab=onigiri"
          className="block bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 hover:bg-emerald-100 transition-colors"
        >
          <p className="text-sm font-bold text-emerald-800">{L.howToOpenLink}</p>
        </a>

        {/* 대표 맛 예시 (하드코딩 2개) */}
        <div>
          <p className="text-base font-bold text-gray-900 mb-1">{L.examplesTitle}</p>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">{L.examplesNote}</p>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex gap-3 items-start">
                <span className="text-2xl shrink-0">{ex.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{ex.name[lang]}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{ex.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 실물로 직접 확인하는 법 */}
        <p className="text-base font-bold text-gray-900 pt-2">{L.howToCheckTitle}</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-1">
          <p className="text-sm font-bold text-gray-800">{L.priceCheckTitle}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{L.priceCheckDesc}</p>
        </div>

        <a
          href="/guide/link-ingredients"
          className="block bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-colors"
        >
          <p className="text-sm font-bold text-amber-800">{L.ingredientsLink}</p>
        </a>

        {/* 자주 보이는 한글 단어 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.wordsTitle}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{L.wordsNote}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {WORDS.map((w, i) => (
              <span key={i} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                <span className="font-bold text-gray-800">{w.word}</span>
                <span className="text-gray-400"> · {w.meaning[lang]}</span>
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
