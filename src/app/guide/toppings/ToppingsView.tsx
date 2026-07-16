'use client'
// 꿀조합 커스터마이징 — 토핑 카테고리 매트릭스 + 라면별 편의점 토핑 조합 카드 (DB 연동)

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  title: string
  intro: string
  ingredientsLink: string
  matrixTitle: string
  comboTitle: string
}> = {
  ko: {
    title: '꿀조합 커스터마이징',
    intro: '편의점 라면, 이것 하나만 더 넣으면 완전히 달라집니다.',
    ingredientsLink: '⚠️ 알레르기·할랄 등 성분이 걱정되면 먼저 확인하세요 →',
    matrixTitle: '🍜 토핑 카테고리별로 골라보세요',
    comboTitle: '✅ 실제로 검증된 추천 조합',
  },
  en: {
    title: 'Topping Combos',
    intro: 'One topping from the fridge section — totally different ramen.',
    ingredientsLink: '⚠️ Worried about allergens or halal? Check ingredients first →',
    matrixTitle: '🍜 Pick a topping by category',
    comboTitle: '✅ Tried-and-tested combos',
  },
  zh: {
    title: '黄金搭配',
    intro: '便利店里加一样，拉面完全不同。',
    ingredientsLink: '⚠️ 担心过敏原或清真认证？请先确认成分 →',
    matrixTitle: '🍜 按分类挑选配料',
    comboTitle: '✅ 已验证的推荐组合',
  },
  ja: {
    title: 'トッピング組み合わせ',
    intro: 'コンビニのトッピングを一つ足すだけで、まったく別のラーメンに。',
    ingredientsLink: '⚠️ アレルギーやハラールが気になる方はまず成分を確認 →',
    matrixTitle: '🍜 カテゴリー別にトッピングを選ぶ',
    comboTitle: '✅ 実証済みのおすすめ組み合わせ',
  },
}

type PlaceTag = 'store' | 'stay'

const PLACE_TAG_LABEL: Record<Lang, Record<PlaceTag, string>> = {
  ko: { store: '🏪 편의점 즉석', stay: '🏠 숙소 조리 필요' },
  en: { store: '🏪 Ready in-store', stay: '🏠 Needs a kitchen' },
  zh: { store: '🏪 便利店即食', stay: '🏠 需要厨房烹饪' },
  ja: { store: '🏪 コンビニで即食', stay: '🏠 調理場が必要' },
}

type ToppingEntry = {
  emoji: string
  name: Record<Lang, string>
  desc: Record<Lang, string>
  place: PlaceTag
}

type ToppingCategory = {
  title: Record<Lang, string>
  items: ToppingEntry[]
}

const TOPPING_CATEGORIES: ToppingCategory[] = [
  {
    title: {
      ko: '🔥 국물 맛을 바꾸는 필살기',
      en: '🔥 Broth boosters',
      zh: '🔥 改变汤底的绝招',
      ja: '🔥 スープの味を変える必殺技',
    },
    items: [
      {
        emoji: '🧀',
        name: { ko: '슬라이스 치즈', en: 'Sliced cheese', zh: '芝士片', ja: 'スライスチーズ' },
        desc: {
          ko: '매운 라면에 넣으면 고소하고 부드러워져요.',
          en: 'Melts into spicy ramen for a creamy, milder taste.',
          zh: '放入辣拉面中会变得香浓顺滑。',
          ja: '辛いラーメンに入れるとまろやかになります。',
        },
        place: 'store',
      },
      {
        emoji: '🍲',
        name: { ko: '순두부/연두부', en: 'Soft tofu', zh: '嫩豆腐', ja: 'スンドゥブ豆腐' },
        desc: {
          ko: '라면 국물에 넣고 끓이면 순두부찌개 느낌이 나요.',
          en: 'Simmer it in the broth for a soft-tofu-stew vibe. Needs boiling — accommodation only.',
          zh: '放入汤中煮开会有嫩豆腐汤的感觉，需要加热烹煮，仅限住宿处。',
          ja: 'スープで煮込むとスンドゥブチゲ風に。加熱調理が必要なので宿泊先限定。',
        },
        place: 'stay',
      },
      {
        emoji: '🥬',
        name: { ko: '김치/볶음김치', en: 'Kimchi (fried or as-is)', zh: '泡菜/炒泡菜', ja: 'キムチ/炒めキムチ' },
        desc: {
          ko: '국물에 감칠맛을 더해주고 아삭한 식감을 더해요.',
          en: 'Adds savory depth and crunch to the broth.',
          zh: '为汤底增添鲜味和爽脆口感。',
          ja: 'スープにコクと食感をプラスします。',
        },
        place: 'store',
      },
    ],
  },
  {
    title: {
      ko: '🍚 포만감을 책임지는 식사형',
      en: '🍚 For a full meal',
      zh: '🍚 增加饱腹感的主食型',
      ja: '🍚 満腹感を担う食事系',
    },
    items: [
      {
        emoji: '🍙',
        name: { ko: '삼각김밥', en: 'Rice ball (samgak-gimbap)', zh: '饭团', ja: 'おにぎり' },
        desc: {
          ko: '다 먹고 남은 국물에 말아 먹거나 라면과 함께. 참치마요·전주비빔 추천.',
          en: 'Dunk the leftover one into the broth, or eat alongside. Tuna mayo or Jeonju bibim flavors are top picks.',
          zh: '可泡在剩下的汤里吃，或配着拉面吃。推荐金枪鱼蛋黄酱、全州拌饭口味。',
          ja: '残ったスープに浸して食べても、ラーメンと一緒でも。ツナマヨ・全州ビビンがおすすめ。',
        },
        place: 'store',
      },
      {
        emoji: '🌭',
        name: { ko: '핫바 (어묵/소시지 꼬치)', en: 'Hotbar (fish cake / sausage skewer)', zh: '鱼饼/香肠串（Hotbar）', ja: 'ホットバー（練り物・ソーセージ串）' },
        desc: {
          ko: '큼직하게 잘라 넣으면 고기 토핑 느낌이 물씬 나요.',
          en: 'Slice it into chunks for a meaty, hearty topping.',
          zh: '切成大块加入，很有肉类配料的感觉。',
          ja: '大きめに切って入れると肉トッピングのような満足感。',
        },
        place: 'store',
      },
      {
        emoji: '🥟',
        name: { ko: '만두', en: 'Dumplings (mandu)', zh: '饺子', ja: '餃子' },
        desc: {
          ko: '냉동만두 2~3알이면 든든함이 두 배가 돼요.',
          en: '2–3 frozen dumplings double the heartiness. Needs boiling — accommodation only.',
          zh: '加2~3个冷冻饺子，饱腹感翻倍，需要加热烹煮，仅限住宿处。',
          ja: '冷凍餃子を2〜3個入れると満足感が倍に。加熱調理が必要なので宿泊先限定。',
        },
        place: 'stay',
      },
    ],
  },
  {
    title: {
      ko: '✨ 식감을 더해주는 별미형',
      en: '✨ Fun texture add-ons',
      zh: '✨ 增添口感的风味型',
      ja: '✨ 食感を加える別味系',
    },
    items: [
      {
        emoji: '🥚',
        name: { ko: '계란', en: 'Egg', zh: '鸡蛋', ja: '卵' },
        desc: {
          ko: '끓일 때 넣으면 부드럽고, 다 끓인 후 노른자만 올리면 고소함이 터져요.',
          en: 'Add while boiling for a soft egg, or crack a raw yolk on top at the end for extra richness.',
          zh: '煮的时候放入会很滑嫩，煮好后加个蛋黄会更香浓。',
          ja: '煮る時に入れるとまろやかに、仕上げに卵黄をのせるとコクが増します。',
        },
        place: 'store',
      },
      {
        emoji: '🟡',
        name: { ko: '단무지', en: 'Pickled radish (danmuji)', zh: '腌萝卜', ja: 'たくあん' },
        desc: {
          ko: '라면 먹을 때 빠질 수 없는 아삭한 짝꿍이에요.',
          en: 'The crunchy sidekick every ramen needs.',
          zh: '吃拉面时不可或缺的爽脆搭档。',
          ja: 'ラーメンに欠かせない、シャキシャキの相棒です。',
        },
        place: 'store',
      },
      {
        emoji: '🌽',
        name: { ko: '캔 옥수수 (소형)', en: 'Canned corn (small can)', zh: '玉米罐头（小罐）', ja: 'コーン缶（小サイズ）' },
        desc: {
          ko: '톡톡 터지는 식감과 달큰한 맛을 더해줘요.',
          en: 'Adds a sweet pop of texture to every bite.',
          zh: '增添咀嚼时的爆汁感和香甜滋味。',
          ja: 'プチプチ食感と甘みをプラスします。',
        },
        place: 'store',
      },
    ],
  },
]

function PlaceBadge({ place, lang }: { place: PlaceTag; lang: Lang }) {
  const style = place === 'store'
    ? 'bg-sky-50 text-sky-700 border-sky-200'
    : 'bg-orange-50 text-orange-700 border-orange-200'
  return (
    <span className={`shrink-0 inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${style}`}>
      {PLACE_TAG_LABEL[lang][place]}
    </span>
  )
}

export type ToppingCombo = {
  id: number
  order_num: number
  ramen_ko: string
  ramen_en: string | null
  ramen_zh: string | null
  ramen_ja: string | null
  toppings: string
  reason_ko: string | null
  reason_en: string | null
  reason_zh: string | null
  reason_ja: string | null
  spicy: number
}

type Topping = '🥚' | '🧀' | '🍙'

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

function parseToppings(raw: string): Topping[] {
  try {
    return JSON.parse(raw) as Topping[]
  } catch {
    return []
  }
}

export default function ToppingsView({ combos }: { combos: ToppingCombo[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 성분 확인 링크 — 눈에 띄게 상단 배치 */}
        <button
          onClick={() => router.push('/guide/ingredients')}
          className="w-full text-left bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-colors"
        >
          <p className="text-sm font-bold text-amber-800">{L.ingredientsLink}</p>
        </button>

        {/* 토핑 카테고리 매트릭스 */}
        <h2 className="text-base font-bold text-gray-900 pt-2">{L.matrixTitle}</h2>
        {TOPPING_CATEGORIES.map((category, ci) => (
          <div key={ci} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-800">{category.title[lang]}</h3>
            <div className="space-y-3">
              {category.items.map((item, ii) => (
                <div key={ii} className="flex gap-3 items-start pt-3 first:pt-0 border-t border-gray-100 first:border-t-0">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{item.name[lang]}</p>
                      <PlaceBadge place={item.place} lang={lang} />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 실제 검증된 추천 조합 (기존 DB 데이터) */}
        <h2 className="text-base font-bold text-gray-900 pt-2">{L.comboTitle}</h2>
        {combos.map((combo) => {
          const toppings = parseToppings(combo.toppings)
          return (
            <div key={combo.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">{combo[`ramen_${lang}`] || combo.ramen_ko}</h2>
                <SpicyBadge level={combo.spicy} />
              </div>

              <div className="flex gap-2 flex-wrap">
                {toppings.map((t, j) => (
                  <span key={j} className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
                    {t} {TOPPING_NAME[lang][t]}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{combo[`reason_${lang}`] || combo.reason_ko}</p>
            </div>
          )
        })}
      </main>
    </div>
  )
}
