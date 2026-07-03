'use client'
// 나라별 인기 한국 라면 — 국가 선택 후 해당 나라 선호 라면 리스트 표시

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, {
  title: string
  back: string
  intro: string
  selectPrompt: string
  source: string
  rank: string
  score: string
}> = {
  ko: {
    title: '나라별 인기 라면',
    back: '← 뒤로',
    intro: '내 나라 사람들은 어떤 한국 라면을 좋아할까요?',
    selectPrompt: '나라를 선택하세요',
    source: '출처',
    rank: '위',
    score: '점',
  },
  en: {
    title: 'Popular Ramen by Country',
    back: '← Back',
    intro: 'What Korean ramen do people from your country love?',
    selectPrompt: 'Select your country',
    source: 'Source',
    rank: '#',
    score: 'pts',
  },
  zh: {
    title: '各国人气拉面',
    back: '← 返回',
    intro: '你的国家的人喜欢哪款韩国拉面？',
    selectPrompt: '选择国家',
    source: '来源',
    rank: '位',
    score: '分',
  },
  ja: {
    title: '国別人気ラーメン',
    back: '← 戻る',
    intro: '自分の国の人はどんな韓国ラーメンが好き？',
    selectPrompt: '国を選んでください',
    source: '出典',
    rank: '位',
    score: '点',
  },
}

type RamenPick = {
  rank: number
  name: Record<Lang, string>
  score: number
  reason: Record<Lang, string>
}

type CountryData = {
  flag: string
  name: Record<Lang, string>
  source: Record<Lang, string>
  sourceUrl: string
  picks: RamenPick[]
}

const COUNTRIES: CountryData[] = [
  {
    flag: '🇯🇵',
    name: { ko: '일본', en: 'Japan', zh: '日本', ja: '日本' },
    source: {
      ko: '일본 라면 전문 매체 랭킹',
      en: 'Japanese ramen media ranking',
      zh: '日本拉面专业媒体排名',
      ja: '日本ラーメン専門メディアランキング',
    },
    sourceUrl: 'https://v.daum.net/v/fw7shoc6Ho',
    picks: [
      {
        rank: 1,
        name: { ko: '농심 너구리', en: 'Nongshim Neoguri', zh: '农心貉子拉面', ja: '農心たぬきラーメン' },
        score: 81.2,
        reason: {
          ko: '굵은 면발과 듬뿍 들어있는 미역이 특징. 어떤 조리 방식으로도 맛있다는 평.',
          en: 'Thick noodles and generous seaweed. Praised for being delicious no matter how you cook it.',
          zh: '粗面条和大量海带是特色，无论什么烹饪方式都好吃。',
          ja: '太麺とたっぷりのわかめが特徴。どんな調理法でもおいしいと評判。',
        },
      },
      {
        rank: 2,
        name: { ko: '삼양 까르보 불닭볶음면', en: 'Samyang Carbo Buldak', zh: '三养卡波不辣炒面', ja: 'サムヤン カルボブルダック炒め麺' },
        score: 77.9,
        reason: {
          ko: '까르보나라 풍미에 매운맛을 더한 독특한 맛. 일본 라면과 차별화된 경험.',
          en: 'Carbonara flavor with a spicy kick. A uniquely different experience from Japanese ramen.',
          zh: '卡波拿拉风味加辣味，与日本拉面截然不同的体验。',
          ja: 'カルボナーラ風味に辛さをプラス。日本のラーメンとは一線を画す体験。',
        },
      },
      {
        rank: 3,
        name: { ko: '농심 신라면', en: 'Nongshim Shin Ramyun', zh: '农心辛拉面', ja: '農心辛ラーメン' },
        score: 77.3,
        reason: {
          ko: '오리지널 향신료의 감칠맛이 진하고 중독성 있는 매운맛.',
          en: 'Rich umami from original spices with an addictively spicy broth.',
          zh: '原版香辛料的鲜味浓郁，辣味令人上瘾。',
          ja: 'オリジナルスパイスの旨味が濃く、やみつきになる辛さ。',
        },
      },
      {
        rank: 4,
        name: { ko: '농심 감자면', en: 'Nongshim Gamja Myeon', zh: '农心土豆面', ja: '農心ジャガイモ麺' },
        score: 75.6,
        reason: {
          ko: '감자 전분 특유의 쫄깃한 식감과 매운 국물의 궁합이 최고.',
          en: 'The chewy texture from potato starch pairs perfectly with the spicy broth.',
          zh: '土豆淀粉特有的弹性口感与辣汤绝配。',
          ja: 'じゃがいもでんぷんならではのもちもち食感と辛いスープの相性が抜群。',
        },
      },
      {
        rank: 5,
        name: { ko: '오뚜기 진라면 매운맛', en: 'Ottogi Jin Ramen Spicy', zh: '不倒翁真拉面辣味', ja: 'オットギ ジンラーメン辛口' },
        score: 74.3,
        reason: {
          ko: '풍미도 좋고 맛도 깊어서 단순한 맵기를 넘어 복합적인 맛 제공.',
          en: 'Rich flavor that goes beyond simple spiciness, offering a complex taste.',
          zh: '风味浓郁，超越单纯辣味，提供复合口感。',
          ja: '風味が良く深い味わいで、単純な辛さを超えた複雑な味。',
        },
      },
      {
        rank: 6,
        name: { ko: '농심 안성탕면', en: 'Nongshim Ansungtangmyun', zh: '农心安城汤面', ja: '農心アンソンタン麺' },
        score: 68.1,
        reason: {
          ko: '약간 매콤한 된장 라면으로, 너무 강하지 않은 맵기를 선호하는 분께 인기.',
          en: 'A mildly spicy doenjang-style ramen. Popular with those who prefer moderate heat.',
          zh: '略带辣味的大酱拉面，受偏爱适中辣度的人欢迎。',
          ja: '少し辛みのある味噌ラーメン。強すぎない辛さを好む方に人気。',
        },
      },
      {
        rank: 7,
        name: { ko: '농심 짜파게티', en: 'Nongshim Chapagetti', zh: '农心炸酱意面', ja: '農心チャパゲティ' },
        score: 63.9,
        reason: {
          ko: '적당한 단맛에 쫄깃한 두꺼운 면. 집에서 짜장면을 즐길 수 있는 라면.',
          en: 'Moderately sweet with thick chewy noodles. Enjoy jjajangmyeon-style at home.',
          zh: '适度甜味配粗弹面条，在家享受炸酱面风味。',
          ja: '程よい甘さともちもちの太麺。家でジャージャー麺気分が楽しめる。',
        },
      },
      {
        rank: 8,
        name: { ko: '팔도 비빔면', en: 'Paldo Bibim Myeon', zh: '八道拌面', ja: 'パルド ビビン麺' },
        score: 63.7,
        reason: {
          ko: '달고 맵고 새콤한 복합 맛. 다양한 토핑과 잘 어울리는 냉면 스타일.',
          en: 'Sweet, spicy, and tangy all at once. Cold noodle style that pairs well with toppings.',
          zh: '甜辣酸的复合口味，冷面风格搭配各种配料。',
          ja: '甘辛酸っぱい複合的な味。冷麺スタイルでトッピングとの相性も抜群。',
        },
      },
      {
        rank: 9,
        name: { ko: '둥지냉면', en: 'Dongji Cold Noodles', zh: '巢冷面', ja: 'トンジ冷麺' },
        score: 63.6,
        reason: {
          ko: '간편한 조리 방식과 엄청 간단한 준비 과정이 장점.',
          en: 'Super easy to prepare — a major selling point.',
          zh: '烹饪方法简单，准备过程非常简便。',
          ja: 'とても簡単に作れることが最大の魅力。',
        },
      },
      {
        rank: 10,
        name: { ko: '삼양라면', en: 'Samyang Ramen', zh: '三养拉面', ja: 'サムヤンラーメン' },
        score: 63.1,
        reason: {
          ko: '야채를 듬뿍 넣으면 진짜 맛있고, 맵지 않아 접근성이 높음.',
          en: 'Even better loaded with veggies. Not spicy, so easy for anyone to enjoy.',
          zh: '加大量蔬菜更好吃，不辣，接受度高。',
          ja: '野菜をたっぷり入れると本当においしく、辛くないので誰でも食べやすい。',
        },
      },
    ],
  },
]

const COMING_SOON_COUNTRIES = [
  { flag: '🇨🇳', name: { ko: '중국', en: 'China', zh: '中国', ja: '中国' } },
  { flag: '🇹🇭', name: { ko: '태국', en: 'Thailand', zh: '泰国', ja: 'タイ' } },
  { flag: '🇺🇸', name: { ko: '미국', en: 'USA', zh: '美国', ja: 'アメリカ' } },
  { flag: '🇻🇳', name: { ko: '베트남', en: 'Vietnam', zh: '越南', ja: 'ベトナム' } },
  { flag: '🇵🇭', name: { ko: '필리핀', en: 'Philippines', zh: '菲律宾', ja: 'フィリピン' } },
]

const COMING_SOON_LABEL: Record<Lang, string> = {
  ko: '준비 중',
  en: 'Coming soon',
  zh: '即将推出',
  ja: '準備中',
}

export default function CountryPicksView() {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]
  const [selected, setSelected] = useState<string | null>(null)

  const selectedCountry = COUNTRIES.find(c => c.name.ko === selected) ?? null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-5">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 나라 선택 */}
        <div>
          <p className="text-xs text-gray-400 font-medium mb-3">{L.selectPrompt}</p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <button
                key={c.name.ko}
                onClick={() => setSelected(selected === c.name.ko ? null : c.name.ko)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all
                  ${selected === c.name.ko
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}
              >
                <span>{c.flag}</span>
                <span>{c.name[lang]}</span>
              </button>
            ))}
            {COMING_SOON_COUNTRIES.map(c => (
              <button
                key={c.name.ko}
                disabled
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border bg-gray-50 text-gray-300 border-gray-100 cursor-default"
              >
                <span>{c.flag}</span>
                <span>{c.name[lang]}</span>
                <span className="text-xs">({COMING_SOON_LABEL[lang]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 나라 라면 목록 */}
        {selectedCountry && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">
                {selectedCountry.flag} {selectedCountry.name[lang]} Top {selectedCountry.picks.length}
              </h2>
              <a
                href={selectedCountry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 underline"
              >
                {L.source}
              </a>
            </div>
            <p className="text-xs text-gray-400">{selectedCountry.source[lang]}</p>

            {selectedCountry.picks.map(pick => (
              <div key={pick.rank} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${pick.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        pick.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        pick.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-50 text-gray-500'}`}>
                      {pick.rank}{L.rank}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{pick.name[lang]}</h3>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium shrink-0">{pick.score}{L.score}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{pick.reason[lang]}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
