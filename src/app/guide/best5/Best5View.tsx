'use client'
// Best 5 추천 — 운영자 픽 라면 순위 카드

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, {
  title: string
  back: string
  intro: string
  badge: string
}> = {
  ko: {
    title: 'Best 5 추천',
    back: '← 뒤로',
    intro: '편의점에서 꼭 먹어봐야 할 라면 5개를 골랐습니다.',
    badge: '운영자 픽',
  },
  en: {
    title: 'Best 5 Picks',
    back: '← Back',
    intro: '5 ramen you must try at a convenience store.',
    badge: "Editor's Pick",
  },
  zh: {
    title: 'Best 5 推荐',
    back: '← 返回',
    intro: '在便利店必须尝试的5款拉面。',
    badge: '编辑推荐',
  },
  ja: {
    title: 'Best 5 おすすめ',
    back: '← 戻る',
    intro: 'コンビニで絶対食べてほしいラーメン5選。',
    badge: 'エディターズピック',
  },
}

type Pick = {
  rank: number
  name: Record<Lang, string>
  noodle_type: 'cup' | 'bag'
  spicy: number
  tag: Record<Lang, string>
  reason: Record<Lang, string>
}

const PICKS: Pick[] = [
  {
    rank: 1,
    name: { ko: '신라면', en: 'Shin Ramyun', zh: '辛拉面', ja: '辛ラーメン' },
    noodle_type: 'bag',
    spicy: 3,
    tag: { ko: '한국 대표 라면', en: 'Korea\'s #1', zh: '韩国代表拉面', ja: '韓国の定番' },
    reason: {
      ko: '한국 라면의 기준. 얼큰하고 진한 국물로 한 번은 꼭 먹어야 합니다.',
      en: 'The standard of Korean ramen. Bold, spicy broth — a must-try at least once.',
      zh: '韩国拉面的标准。浓郁辛辣的汤底，必须尝试一次。',
      ja: '韓国ラーメンの基準。辛くてコクのあるスープ——一度は食べるべき一品。',
    },
  },
  {
    rank: 2,
    name: { ko: '불닭볶음면', en: 'Buldak Bokkeum Myeon', zh: '火鸡面', ja: '火鶏麺' },
    noodle_type: 'bag',
    spicy: 5,
    tag: { ko: 'SNS 챌린지 필수', en: 'SNS Challenge', zh: 'SNS挑战必备', ja: 'SNSチャレンジ' },
    reason: {
      ko: '전 세계에서 화제인 매운 볶음면. 치즈 한 장 올리면 훨씬 먹기 편합니다.',
      en: 'The viral fire noodle. Add a cheese slice to tame the heat.',
      zh: '风靡全球的辣炒面。加一片芝士会好吃很多。',
      ja: '世界で話題の辛炒め麺。チーズを一枚のせると格段に食べやすくなります。',
    },
  },
  {
    rank: 3,
    name: { ko: '참깨라면', en: 'Chamgae Ramyun', zh: '芝麻拉面', ja: 'ごまラーメン' },
    noodle_type: 'bag',
    spicy: 1,
    tag: { ko: '맵지 않아 누구나', en: 'Mild & Nutty', zh: '不辣·香浓', ja: '辛くない・誰でも' },
    reason: {
      ko: '고소한 참깨 국물이 인상적입니다. 매운 것을 못 먹어도 즐길 수 있는 라면.',
      en: 'Rich, nutty sesame broth. Perfect if you can\'t handle spice.',
      zh: '浓郁的芝麻汤底令人印象深刻。不能吃辣也能享用的拉面。',
      ja: '香ばしいごまスープが印象的。辛いものが苦手でも楽しめるラーメン。',
    },
  },
  {
    rank: 4,
    name: { ko: '짜파게티', en: 'Chapagetti', zh: '炸酱意面', ja: 'チャパゲティ' },
    noodle_type: 'bag',
    spicy: 0,
    tag: { ko: '짜장면 느낌', en: 'Black Bean Style', zh: '炸酱面风味', ja: 'ジャージャー麺風' },
    reason: {
      ko: '짜장 소스 볶음면. 국물 없이 비벼먹는 스타일이라 색다릅니다. 계란 프라이 필수.',
      en: 'Black bean sauce noodles — no broth, stir-fried style. Fry an egg on top.',
      zh: '炸酱炒面。干拌风格，加个煎蛋是标配。',
      ja: 'ジャージャーソース炒め麺。スープなしで混ぜて食べるスタイル。目玉焼きが必須。',
    },
  },
  {
    rank: 5,
    name: { ko: '너구리큰사발면', en: 'Neoguri Cup', zh: '貉子拉面杯', ja: 'たぬきカップ麺' },
    noodle_type: 'cup',
    spicy: 2,
    tag: { ko: '해물 국물', en: 'Seafood Broth', zh: '海鲜汤底', ja: 'シーフードスープ' },
    reason: {
      ko: '쫄깃한 우동 면발에 얼큰한 해물 국물. 컵라면인데 퀄리티가 높습니다.',
      en: 'Chewy udon-style noodles in spicy seafood broth. Surprisingly good for a cup.',
      zh: '劲道的乌冬面配辛辣海鲜汤底。是杯面但品质出众。',
      ja: 'もちもちのうどん麺に辛口シーフードスープ。カップ麺なのにクオリティが高い。',
    },
  },
]

function SpicyBadge({ level }: { level: number }) {
  if (level === 0) return <span className="text-xs text-gray-400">🌿 Not spicy</span>
  return <span className="text-xs text-red-400">{'🌶️'.repeat(level)}</span>
}

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function Best5View() {
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
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600 leading-relaxed flex-1">{L.intro}</p>
          <span className="shrink-0 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{L.badge}</span>
        </div>

        {PICKS.map((pick, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{MEDAL[i]}</span>
                <h2 className="text-base font-bold text-gray-900">{pick.name[lang]}</h2>
              </div>
              <SpicyBadge level={pick.spicy} />
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md
                ${pick.noodle_type === 'cup' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                {pick.noodle_type === 'cup' ? 'Cup' : 'Bag'}
              </span>
              <span className="text-xs text-emerald-700 font-medium">{pick.tag[lang]}</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{pick.reason[lang]}</p>
          </div>
        ))}
      </main>
    </div>
  )
}
