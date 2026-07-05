'use client'
// 홈 화면 — 그룹별 섹션 카드 (2열 그리드)

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const HERO: Record<Lang, { title: string; sub: string }> = {
  ko: { title: 'K-Ramen Picks', sub: '제주 편의점 라면 가이드' },
  en: { title: 'K-Ramen Picks', sub: 'Jeju Convenience Store Ramen Guide' },
  zh: { title: 'K-Ramen Picks', sub: '济州便利店拉面指南' },
  ja: { title: 'K-Ramen Picks', sub: '済州コンビニラーメンガイド' },
}

const COMING_SOON: Record<Lang, string> = {
  ko: '준비 중',
  en: 'Coming soon',
  zh: '即将推出',
  ja: '準備中',
}

type Section = {
  emoji: string
  title: Record<Lang, string>
  desc: Record<Lang, string>
  href: string | null
}

type Group = {
  label: Record<Lang, string>
  sections: Section[]
}

const GROUPS: Group[] = [
  {
    label: { ko: '편의점 가이드', en: 'Convenience Store Guide', zh: '便利店指南', ja: 'コンビニガイド' },
    sections: [
      {
        emoji: '💳',
        title: { ko: '계산 먼저!', en: 'How to Pay', zh: '如何付款', ja: 'お会計の方法' },
        desc: {
          ko: '편의점 라면 먹는 순서 · 봉투 질문 대비',
          en: 'Step-by-step guide · bag question ready',
          zh: '购买流程 · 准备袋子问题',
          ja: '購入手順 · 袋の質問に備える',
        },
        href: '/guide/payment',
      },
      {
        emoji: '🏷️',
        title: { ko: '할인 득템법', en: 'How to Save', zh: '优惠攻略', ja: 'お得な買い方' },
        desc: {
          ko: '1+1 · 2+1 · 멤버십 할인',
          en: 'Buy-one-get-one · membership deals',
          zh: '买一送一 · 会员优惠',
          ja: '1+1 · 2+1 · 会員割引',
        },
        href: '/guide/convenience-store-1plus1',
      },
    ],
  },
  {
    label: { ko: '라면 탐색', en: 'Explore Ramen', zh: '探索拉面', ja: 'ラーメンを探す' },
    sections: [
      {
        emoji: '🌏',
        title: { ko: '나라별 인기 라면', en: 'Popular by Country', zh: '各国人气拉面', ja: '国別人気ラーメン' },
        desc: {
          ko: '일본·중국·미국… 내 나라 사람들의 픽',
          en: 'Japan, China, USA… what your country loves',
          zh: '日本·中国·美国…你的国家的选择',
          ja: '日本·中国·アメリカ…自国の人気ランキング',
        },
        href: '/guide/country-picks',
      },
      {
        emoji: '🎯',
        title: { ko: 'Vibe 큐레이션', en: 'Vibe Curation', zh: 'Vibe 推荐', ja: 'Vibe おすすめ' },
        desc: {
          ko: '기분 · 맵기 · 재료 선택 → 라면 추천 3개',
          en: 'Mood · spice · toppings → top 3 picks',
          zh: '心情 · 辣度 · 配料 → 推荐3款',
          ja: '気分 · 辛さ · 具材 → おすすめ3品',
        },
        href: '/vibe',
      },
      {
        emoji: '🍜',
        title: { ko: '라면 전체 보기', en: 'All Ramen', zh: '全部拉面', ja: 'ラーメン一覧' },
        desc: {
          ko: '30종 라면 정보 · 맵기 · 가격',
          en: '30 ramen items · spice level · price',
          zh: '30种拉面 · 辣度 · 价格',
          ja: '30種ラーメン · 辛さ · 価格',
        },
        href: '/guide/ramen',
      },
      {
        emoji: '⭐',
        title: { ko: 'Best 5 추천', en: 'Best 5 Picks', zh: 'Best 5 推荐', ja: 'Best 5 おすすめ' },
        desc: {
          ko: '예사·예랑 픽 · 외국인 추천 순위',
          en: "Yesa & Yerang's top picks",
          zh: '外国人推荐排名',
          ja: '外国人おすすめランキング',
        },
        href: '/guide/best5',
      },
    ],
  },
  {
    label: { ko: '라면 정보', en: 'Ramen Info', zh: '拉面信息', ja: 'ラーメン情報' },
    sections: [
      {
        emoji: '🔥',
        title: { ko: '라면 끓이는 법', en: 'How to Cook', zh: '如何烹饪', ja: '作り方' },
        desc: {
          ko: '컵 · 봉지 · 비벼먹기',
          en: 'Cup · bag · dry style',
          zh: '杯面 · 袋面 · 干拌',
          ja: 'カップ · 袋 · まぜそば',
        },
        href: '/guide/cooking',
      },
      {
        emoji: '🥗',
        title: { ko: '나도 먹을 수 있나요?', en: 'Can I Eat This?', zh: '我能吃吗？', ja: '食べられますか？' },
        desc: {
          ko: '성분 · 알레르기 · 할랄 확인',
          en: 'Ingredients · allergens · halal',
          zh: '成分 · 过敏原 · 清真认证',
          ja: '成分 · アレルギー · ハラール',
        },
        href: '/guide/ingredients',
      },
      {
        emoji: '🥚',
        title: { ko: '꿀조합 커스터마이징', en: 'Topping Combos', zh: '黄金搭配', ja: 'トッピング組み合わせ' },
        desc: {
          ko: '계란 · 치즈 · 삼각김밥 조합',
          en: 'Egg · cheese · rice ball combos',
          zh: '鸡蛋 · 芝士 · 饭团组合',
          ja: '卵 · チーズ · おにぎり',
        },
        href: '/guide/toppings',
      },
      {
        emoji: '📝',
        title: { ko: 'My Ramen Log', en: 'My Ramen Log', zh: 'My Ramen Log', ja: 'My Ramen Log' },
        desc: {
          ko: '먹어본 라면 · 한 줄 남기기',
          en: 'Rate the ramen you tried',
          zh: '记录你吃过的拉面',
          ja: '食べたラーメンを記録',
        },
        href: '/ramen-log',
      },
    ],
  },
]

export default function HomeScreen() {
  const { lang, setLang } = useLang()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-800">{HERO[lang].title}</h1>
          <div className="flex gap-2">
            {LANG_LABELS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors
                  ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <div className="bg-emerald-700 text-white text-center py-6 px-4">
        <p className="text-xs text-emerald-200 mb-1">{HERO[lang].sub}</p>
        <h2 className="text-xl font-bold">{HERO[lang].title}</h2>
      </div>

      {/* 그룹별 섹션 카드 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-semibold mb-3">{group.label[lang]}</p>
            <div className="grid grid-cols-2 gap-2">
              {group.sections.map((section, si) => {
                const ready = section.href !== null
                return (
                  <button
                    key={si}
                    onClick={() => ready && router.push(section.href!)}
                    disabled={!ready}
                    className={`rounded-xl border px-3 py-3 flex flex-col items-start gap-0.5 text-left transition-all
                      ${ready
                        ? 'bg-gray-50 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50'
                        : 'bg-gray-50 border-gray-100 cursor-default opacity-50'}`}
                  >
                    <p className="text-xs font-bold text-gray-900 leading-snug">{section.title[lang]}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{section.desc[lang]}</p>
                    {!ready && (
                      <span className="text-xs text-gray-300">{COMING_SOON[lang]}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
