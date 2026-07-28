'use client'
// 편의점 도시락 가이드 — 데우는 법 안내 + 종류별 구성/정보 카드

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import FlavorCategoryList, { buildFlavorCategories } from '@/components/FlavorCategoryList'
import WordGlossary, { type GlossaryWord } from '@/components/WordGlossary'

const FLAVOR_CATEGORIES = buildFlavorCategories({
  mild: { ko: '치킨마요 도시락', en: 'Chicken Mayo Bento', zh: '鸡肉蛋黄酱便当', ja: 'チキンマヨ弁当' },
  meat: { ko: '돈까스 도시락 등', en: 'Pork cutlet (donkatsu) bento, etc.', zh: '炸猪排便当等', ja: 'とんかつ弁当など' },
  spicy: { ko: '제육볶음 도시락, 비빔밥 도시락 등', en: 'Spicy stir-fried pork bento, bibimbap bento, etc.', zh: '辣炒猪肉便当、拌饭便当等', ja: 'チェユクポックム弁当、ビビンバ弁当など' },
})

const WORDS: GlossaryWord[] = [
  { word: '마요', meaning: { ko: '마요네즈 소스', en: 'Mayonnaise sauce', zh: '蛋黄酱', ja: 'マヨネーズソース' } },
  { word: '제육', meaning: { ko: '고추장 양념 돼지고기 볶음', en: 'Gochujang-marinated stir-fried pork', zh: '辣椒酱炒猪肉', ja: 'コチュジャン炒め豚肉' } },
  { word: '까스', meaning: { ko: '튀김옷 입혀 튀긴 고기 (돈까스 등)', en: 'Breaded and fried meat (e.g. pork cutlet)', zh: '裹粉油炸的肉（如炸猪排）', ja: '衣をつけて揚げた肉（とんかつなど）' } },
  { word: '구이', meaning: { ko: '구운 생선·고기', en: 'Grilled fish or meat', zh: '烤鱼/烤肉', ja: '焼いた魚・肉' } },
  { word: '비빔밥', meaning: { ko: '나물과 고추장을 비벼 먹는 밥', en: 'Rice mixed with vegetables and gochujang', zh: '拌菜和辣椒酱拌饭', ja: 'ナムルとコチュジャンを混ぜて食べるご飯' } },
  { word: '매운/매콤', meaning: { ko: '매운맛', en: 'Spicy', zh: '辣味', ja: '辛い' } },
]

const LABEL: Record<Lang, {
  intro: string
  howToHeatTitle: string
  howToHeatSteps: string[]
  ingredientsLink: string
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
  },
}

export default function DosirakView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 맛 카테고리 3단계 (부드러운 맛 / 익숙한 고기맛 / 매운맛) */}
        <FlavorCategoryList categories={FLAVOR_CATEGORIES} />

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

        <WordGlossary words={WORDS} />
      </main>
    </div>
  )
}
