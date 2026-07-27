'use client'
// 편의점 삼각김밥 가이드 — 포장 뜯는 법(고정 지식) + 실물로 직접 확인하는 법 안내
// 삼각김밥은 신상품 회전이 빠르고 편의점 브랜드마다 취급 상품이 달라 DB 목록 대신
// 대표 예시 몇 개만 하드코딩하고, 실제 상품 정보는 매장에서 직접 확인하도록 안내

import Image from 'next/image'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  microwaveLink: string
  howToOpenTitle: string
  howToOpenIntro: string
  howToOpenSteps: string[]
  howToOpenTip: string
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
    microwaveLink: '🔥 전자레인지로 데우는 법 (편의점 꿀팁에서 보기) →',
    howToOpenTitle: '📦 포장 뜯는 법',
    howToOpenIntro: '포장지에 ①②③ 번호가 있습니다. 순서대로 당기면 김과 밥이 분리되지 않아요.',
    howToOpenSteps: [
      '① 위쪽 테이프를 잡고 아래로 당기세요.',
      '② 왼쪽 포장지를 왼쪽으로 당기세요.',
      '③ 오른쪽 포장지를 오른쪽으로 당기세요.',
    ],
    howToOpenTip: '💡 천천히 당기면 김이 찢어지지 않아요.',
    examplesTitle: '🍙 맛 카테고리로 골라보기',
    examplesNote: '맛 이름은 나라마다 낯설어도, "안 매운 맛 / 익숙한 고기맛 / 매운맛" 이 3가지 기준은 어디서나 통합니다.',
    howToCheckTitle: '🔍 매장에서 직접 확인하는 법',
    priceCheckTitle: '💰 가격 확인',
    priceCheckDesc: '포장 앞면 하단 또는 매대에 붙은 가격표에 표시되어 있습니다. 대부분 ₩1,500~₩2,000 사이입니다.',
    ingredientsLink: '⚠️ 알레르기·할랄·채식 여부가 걱정되면 먼저 확인하세요 →',
    wordsTitle: '📖 포장에서 자주 보이는 한글 단어',
    wordsNote: '맛 이름 앞에 붙는 이 단어들만 알아도 대략적인 맛을 짐작할 수 있습니다.',
  },
  en: {
    intro: 'They all look similar, but if you don\'t know how to unwrap it, the rice falls apart and the seaweed gets soggy.',
    microwaveLink: '🔥 How to heat it up (see CVS Tips) →',
    howToOpenTitle: '📦 How to unwrap',
    howToOpenIntro: 'The wrapper has numbers ①②③. Pull them in order and the seaweed stays crispy.',
    howToOpenSteps: [
      '① Pull the top tab downward.',
      '② Pull the left side of the wrapper to the left.',
      '③ Pull the right side of the wrapper to the right.',
    ],
    howToOpenTip: '💡 Pull slowly so the seaweed doesn\'t tear.',
    examplesTitle: '🍙 Pick by Flavor Category',
    examplesNote: 'Flavor names vary by country, but "mild / familiar meat / spicy" works as a universal guide anywhere.',
    howToCheckTitle: '🔍 How to check in-store',
    priceCheckTitle: '💰 Checking the price',
    priceCheckDesc: 'Printed on the bottom front of the package or on the shelf price tag. Most cost between ₩1,500-₩2,000.',
    ingredientsLink: '⚠️ Worried about allergens, halal, or vegetarian status? Check first →',
    wordsTitle: '📖 Common Korean words on the package',
    wordsNote: 'Knowing these words in front of the flavor name gives you a rough idea of the taste.',
  },
  zh: {
    intro: '外观看起来都差不多，但如果不知道怎么拆包装，米饭会散开，海苔也会变软。',
    microwaveLink: '🔥 微波炉加热方法（在便利店小贴士中查看）→',
    howToOpenTitle: '📦 拆包装方法',
    howToOpenIntro: '包装上有①②③编号，按顺序撕开，海苔和米饭就不会分离。',
    howToOpenSteps: [
      '① 抓住上方胶带向下拉。',
      '② 将左侧包装纸向左拉。',
      '③ 将右侧包装纸向右拉。',
    ],
    howToOpenTip: '💡 慢慢拉，海苔就不会碎。',
    examplesTitle: '🍙 按口味分类挑选',
    examplesNote: '口味名称各国不同，但"不辣/熟悉的肉味/辣味"这3个标准放之四海皆准。',
    howToCheckTitle: '🔍 在门店直接确认的方法',
    priceCheckTitle: '💰 确认价格',
    priceCheckDesc: '标注在包装正面下方或货架价签上，大多在₩1,500~₩2,000之间。',
    ingredientsLink: '⚠️ 担心过敏原、清真或素食问题？请先确认 →',
    wordsTitle: '📖 包装上常见的韩文单词',
    wordsNote: '了解这些出现在口味名称前的单词，就能大致推测出味道。',
  },
  ja: {
    intro: '見た目はどれも似ていますが、開け方を知らないとご飯が崩れたり海苔が湿ったりします。',
    microwaveLink: '🔥 電子レンジで温める方法（コンビニお役立ち情報で見る）→',
    howToOpenTitle: '📦 包装の開け方',
    howToOpenIntro: '包装に①②③の番号があります。順番に引っ張ると海苔がパリパリのまま食べられます。',
    howToOpenSteps: [
      '① 上のテープを持って下に引っ張る。',
      '② 左側の包装を左に引っ張る。',
      '③ 右側の包装を右に引っ張る。',
    ],
    howToOpenTip: '💡 ゆっくり引っ張ると海苔が破れません。',
    examplesTitle: '🍙 味のカテゴリーから選ぶ',
    examplesNote: '味の名前は国によって馴染みがなくても、「辛くない味 / 馴染みのある肉の味 / 辛い味」という3つの基準はどこでも通じます。',
    howToCheckTitle: '🔍 店頭で自分で確認する方法',
    priceCheckTitle: '💰 価格の確認',
    priceCheckDesc: 'パッケージ正面下部、または棚の価格タグに表示されています。ほとんどが₩1,500〜₩2,000の間です。',
    ingredientsLink: '⚠️ アレルギー・ハラール・ベジタリアンが気になる方はまず確認 →',
    wordsTitle: '📖 パッケージでよく見る韓国語単語',
    wordsNote: '味の名前の前につくこれらの単語を知っておくと、おおよその味が想像できます。',
  },
}

type FlavorCategory = {
  emoji: string
  dotClass: string
  name: Record<Lang, string>
  conceptName: string
  menu: Record<Lang, string>
  desc: Record<Lang, string>
}

const FLAVOR_CATEGORIES: FlavorCategory[] = [
  {
    emoji: '🟢',
    dotClass: 'bg-emerald-500',
    name: { ko: '부드럽고 안 매운 맛', en: 'Mild & Creamy', zh: '温和不辣', ja: 'マイルドでクリーミーな味' },
    conceptName: 'Mild & Creamy',
    menu: { ko: '참치마요', en: 'Tuna Mayo', zh: '金枪鱼蛋黄酱', ja: 'ツナマヨ' },
    desc: {
      ko: '실패 확률 0%, 누구나 좋아하는 고소하고 부드러운 마요네즈 베이스.',
      en: 'A safe first pick — creamy, mild mayonnaise-based flavor almost everyone likes.',
      zh: '几乎不会踩雷，口感温和的蛋黄酱风味，大众都喜欢。',
      ja: '失敗ゼロ、誰でも好きなまろやかなマヨネーズベース。',
    },
  },
  {
    emoji: '🟡',
    dotClass: 'bg-amber-400',
    name: { ko: '익숙한 고기·불고기 맛', en: 'Savory Meat', zh: '熟悉的肉类/烤肉味', ja: '馴染みのある肉・プルコギ味' },
    conceptName: 'Savory Meat',
    menu: { ko: '소고기, 스팸, 불고기 등', en: 'Beef, Spam, bulgogi, etc.', zh: '牛肉、午餐肉、烤肉等', ja: '牛肉、スパム、プルコギなど' },
    desc: {
      ko: '외국인에게도 익숙한 달콤짭짤한 간장 소스 베이스.',
      en: 'A sweet-and-savory soy sauce base that feels familiar to most foreign visitors.',
      zh: '甜咸交织的酱油风味，外国游客也容易接受。',
      ja: '外国人にも馴染みやすい甘辛い醤油ベース。',
    },
  },
  {
    emoji: '🔴',
    dotClass: 'bg-red-500',
    name: { ko: '한국의 매콤한 맛 (도전용)', en: 'Korean Spicy', zh: '韩式辣味（挑战款）', ja: '韓国の辛い味（挑戦用）' },
    conceptName: 'Korean Spicy',
    menu: { ko: '제육, 전주비빔, 김치참치 등', en: 'Spicy pork, Jeonju bibim, kimchi tuna, etc.', zh: '辣炒猪肉、全州拌饭、泡菜金枪鱼等', ja: 'チェユク、全州ビビン、キムチツナなど' },
    desc: {
      ko: '한국의 매운맛에 도전해보고 싶은 분께 추천 🌶️',
      en: 'For adventurous eaters who want to try real Korean spice 🌶️',
      zh: '推荐给想挑战韩式辣味的冒险者 🌶️',
      ja: '韓国の辛さに挑戦したい方におすすめ 🌶️',
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

        <a
          href="/guide/link-cvs-tips?tab=microwave"
          className="block bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 hover:bg-orange-100 transition-colors"
        >
          <p className="text-sm font-bold text-orange-800">{L.microwaveLink}</p>
        </a>

        {/* 포장 뜯는 법 (실물 사진 + 스텝) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-gray-800">{L.howToOpenTitle}</p>
          <div className="relative w-full max-w-[160px] mx-auto rounded-xl overflow-hidden bg-gray-50" style={{ aspectRatio: 1000 / 960 }}>
            <Image src="/images/cvs-tips/onigiri.png" alt={L.howToOpenTitle} fill className="object-contain" sizes="160px" />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{L.howToOpenIntro}</p>
          <ol className="space-y-2">
            {L.howToOpenSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">{L.howToOpenTip}</p>
        </div>

        {/* 맛 카테고리 3단계 (부드러운 맛 / 익숙한 고기맛 / 매운맛) */}
        <div>
          <p className="text-base font-bold text-gray-900 mb-1">{L.examplesTitle}</p>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">{L.examplesNote}</p>
          <div className="space-y-2">
            {FLAVOR_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dotClass}`} />
                  <p className="text-sm font-bold text-gray-900">{cat.name[lang]}</p>
                  {lang !== 'en' && <span className="text-xs text-gray-300">({cat.conceptName})</span>}
                </div>
                <p className="text-xs font-medium text-gray-700">{cat.menu[lang]}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc[lang]}</p>
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
