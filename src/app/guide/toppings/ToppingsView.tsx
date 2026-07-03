'use client'
// 꿀조합 커스터마이징 — 라면별 편의점 토핑 조합 카드

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, {
  title: string
  back: string
  intro: string
  tip: string
  tipDesc: string
  where: string
  whereDesc: string
}> = {
  ko: {
    title: '꿀조합 커스터마이징',
    back: '← 뒤로',
    intro: '편의점 라면, 이것 하나만 더 넣으면 완전히 달라집니다.',
    tip: '💡 편의점에서 바로 구할 수 있어요',
    tipDesc: '계란, 치즈 슬라이스, 삼각김밥 모두 편의점 냉장코너에 있습니다.',
    where: '🍳 조리 방법',
    whereDesc: '계란은 컵라면 뚜껑 위에 올려 뜨거운 물 붓고 3분 → 반숙. 치즈는 면 위에 바로 올리세요.',
  },
  en: {
    title: 'Topping Combos',
    back: '← Back',
    intro: 'One topping from the fridge section — totally different ramen.',
    tip: '💡 All available in-store',
    tipDesc: 'Eggs, cheese slices, and rice balls are in the refrigerated section of any convenience store.',
    where: '🍳 How to prep',
    whereDesc: 'Egg: place on cup lid, pour hot water, wait 3 min → soft-boiled. Cheese: lay directly on top of the noodles.',
    },
  zh: {
    title: '黄金搭配',
    back: '← 返回',
    intro: '便利店里加一样，拉面完全不同。',
    tip: '💡 便利店内均可购买',
    tipDesc: '鸡蛋、芝士片和饭团都在便利店冷藏区。',
    where: '🍳 烹饪方法',
    whereDesc: '鸡蛋：放在杯面盖上，倒热水，等3分钟→溏心蛋。芝士：直接放在面条上。',
  },
  ja: {
    title: 'トッピング組み合わせ',
    back: '← 戻る',
    intro: 'コンビニのトッピングを一つ足すだけで、まったく別のラーメンに。',
    tip: '💡 コンビニで全部そろう',
    tipDesc: '卵、チーズスライス、おにぎりはどのコンビニの冷蔵コーナーにもあります。',
    where: '🍳 作り方',
    whereDesc: '卵：カップ麺のふたの上に置いてお湯を注ぎ3分→半熟。チーズ：麺の上にそのまま乗せる。',
  },
}

type Topping = '🥚' | '🧀' | '🍙'

type Combo = {
  ramen: Record<Lang, string>
  toppings: Topping[]
  reason: Record<Lang, string>
  spicy: number
}

const COMBOS: Combo[] = [
  {
    ramen: { ko: '신라면', en: 'Shin Ramyun', zh: '辛拉面', ja: '辛ラーメン' },
    toppings: ['🥚', '🍙'],
    reason: {
      ko: '국물에 밥 말아먹기 — 한국인이 가장 많이 하는 조합',
      en: 'Dip the rice ball into the broth — the most classic Korean combo',
      zh: '把饭团泡在汤里吃——韩国人最常见的吃法',
      ja: 'おにぎりをスープに浸して食べる——韓国人が最もよくやる組み合わせ',
    },
    spicy: 3,
  },
  {
    ramen: { ko: '불닭볶음면', en: 'Buldak Bokkeum Myeon', zh: '火鸡面', ja: '火鶏麺' },
    toppings: ['🧀'],
    reason: {
      ko: '치즈가 매운맛을 잡아줍니다. SNS에서 유명한 조합',
      en: 'Cheese cuts the heat. Famous combo on social media',
      zh: '芝士中和辣味，社交媒体上的热门组合',
      ja: 'チーズが辛さを和らげる。SNSで有名な組み合わせ',
    },
    spicy: 5,
  },
  {
    ramen: { ko: '참깨라면', en: 'Chamgae Ramyun', zh: '芝麻拉面', ja: 'ごまラーメン' },
    toppings: ['🥚'],
    reason: {
      ko: '고소한 국물 + 계란 = 고소함 두 배',
      en: 'Nutty broth + egg = double the richness',
      zh: '香浓汤底+鸡蛋=香浓翻倍',
      ja: 'コクのあるスープ＋卵＝旨味が倍増',
    },
    spicy: 1,
  },
  {
    ramen: { ko: '짜파게티', en: 'Chapagetti', zh: '炸酱意面', ja: 'チャパゲティ' },
    toppings: ['🥚'],
    reason: {
      ko: '짜파구리 스타일 — 계란 프라이를 올려 비벼먹기',
      en: 'Chapaguri style — fry an egg and mix it in',
      zh: '炸酱混面风格——放上煎蛋拌着吃',
      ja: 'チャパグリスタイル——目玉焼きをのせて混ぜて食べる',
    },
    spicy: 0,
  },
  {
    ramen: { ko: '너구리큰사발면', en: 'Neoguri Cup', zh: '貉子拉面', ja: 'たぬきカップ麺' },
    toppings: ['🧀', '🍙'],
    reason: {
      ko: '얼큰한 해물 국물 + 치즈 = 크리미한 해물 라면',
      en: 'Spicy seafood broth + cheese = creamy seafood ramen',
      zh: '鲜辣海鲜汤底+芝士=奶香海鲜拉面',
      ja: '辛口シーフードスープ＋チーズ＝クリーミーな海鮮ラーメン',
    },
    spicy: 2,
  },
]

const TOPPING_NAME: Record<Lang, Record<Topping, string>> = {
  ko: { '🥚': '계란', '🧀': '치즈 슬라이스', '🍙': '삼각김밥' },
  en: { '🥚': 'Egg', '🧀': 'Cheese slice', '🍙': 'Rice ball' },
  zh: { '🥚': '鸡蛋', '🧀': '芝士片', '🍙': '饭团' },
  ja: { '🥚': '卵', '🧀': 'チーズスライス', '🍙': 'おにぎり' },
}

function SpicyBadge({ level }: { level: number }) {
  if (level === 0) return <span className="text-xs text-gray-400">🌿 Not spicy</span>
  return <span className="text-xs text-red-400">{'🌶️'.repeat(Math.min(level, 5))}</span>
}

export default function ToppingsView() {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {/* 인트로 */}
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 조합 카드 */}
        {COMBOS.map((combo, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">{combo.ramen[lang]}</h2>
              <SpicyBadge level={combo.spicy} />
            </div>

            {/* 토핑 태그 */}
            <div className="flex gap-2 flex-wrap">
              {combo.toppings.map((t, j) => (
                <span key={j} className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
                  {t} {TOPPING_NAME[lang][t]}
                </span>
              ))}
            </div>

            {/* 이유 */}
            <p className="text-sm text-gray-600 leading-relaxed">{combo.reason[lang]}</p>
          </div>
        ))}

        {/* 팁 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-bold text-emerald-800 mb-1">{L.tip}</p>
          <p className="text-xs text-emerald-700 leading-relaxed">{L.tipDesc}</p>
        </div>

        {/* 조리 방법 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-bold text-amber-800 mb-1">{L.where}</p>
          <p className="text-xs text-amber-700 leading-relaxed">{L.whereDesc}</p>
        </div>
      </main>
    </div>
  )
}
