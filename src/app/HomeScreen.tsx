'use client'
// 홈 화면 — 내 메뉴(즐겨찾기) + 그룹별 섹션 카드 (2열 그리드)

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import LangSelector from '@/components/LangSelector'

const FAVORITES_KEY = 'home_favorites'
const DEFAULT_FAVORITES = [
  '/guide/payment',
  '/guide/money',
  '/guide/cvs-tips',
  '/guide/cooking',
  '/guide/country-picks',
]

const MY_MENU_LABEL: Record<Lang, string> = {
  ko: '⭐ 즐겨찾기',
  en: '⭐ Favorites',
  zh: '⭐ 收藏',
  ja: '⭐ お気に入り',
}

const START_HERE_LABEL: Record<Lang, string> = {
  ko: '처음이라면 이 순서로',
  en: 'New here? Start with these',
  zh: '第一次来？先看这些',
  ja: '初めての方はこの順番で',
}

const START_HERE_HREFS = ['/guide/payment', '/guide/money', '/guide/cvs-tips']

const ASK_BANNER_LABEL: Record<Lang, { text: string; arrow: string }> = {
  ko: { text: '찾는 정보가 없나요? 알려주세요', arrow: '→' },
  en: { text: "Can't find what you need? Let us know", arrow: '→' },
  zh: { text: '没找到您需要的信息？告诉我们', arrow: '→' },
  ja: { text: '探している情報がない？教えてください', arrow: '→' },
}

const HERO: Record<Lang, { title: string; sub: string }> = {
  ko: { title: 'Korea Convenience Store Guide', sub: '한국 편의점 이용, 막힐 때 바로 찾아보는 실전 가이드' },
  en: { title: 'Korea Convenience Store Guide', sub: "Real answers for when you're stuck at a Korean convenience store" },
  zh: { title: 'Korea Convenience Store Guide', sub: '在韩国便利店遇到问题时，随时查看的实用指南' },
  ja: { title: 'Korea Convenience Store Guide', sub: '韓国のコンビニで困ったとき、すぐに使える実践ガイド' },
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
  color: string
  cardClass: string
  sections: Section[]
}

const GROUPS: Group[] = [
  {
    label: { ko: '편의점 가이드', en: 'Convenience Store Guide', zh: '便利店指南', ja: 'コンビニガイド' },
    color: 'text-emerald-600',
    cardClass: 'bg-emerald-50 border-emerald-100',
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
        emoji: '💵',
        title: { ko: '한국 돈 안내', en: 'Korean Money Guide', zh: '韩元指南', ja: '韓国のお金' },
        desc: {
          ko: '지폐 구분 · 환율 변환기 · 편의점 가격 감각',
          en: 'Banknotes · currency converter · CVS price guide',
          zh: '纸币介绍 · 汇率换算 · 便利店价格',
          ja: '紙幣の種類 · 換算機 · コンビニ価格',
        },
        href: '/guide/money',
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
      {
        emoji: '🏪',
        title: { ko: '편의점 브랜드', en: 'CVS Brands', zh: '便利店品牌', ja: 'コンビニブランド' },
        desc: {
          ko: 'CU · GS25 · 세븐일레븐 · 이마트24',
          en: 'CU · GS25 · 7-Eleven · Emart24',
          zh: 'CU · GS25 · 7-Eleven · Emart24',
          ja: 'CU · GS25 · セブン · イーマート24',
        },
        href: '/guide/cvs-brands',
      },
      {
        emoji: '💡',
        title: { ko: '편의점 꿀팁', en: 'CVS Tips', zh: '便利店小贴士', ja: 'コンビニお役立ち' },
        desc: {
          ko: '전자레인지 · 화장실 · 쓰레기 · T-money',
          en: 'Microwave · Toilet · Trash · T-money',
          zh: '微波炉 · 洗手间 · 垃圾分类 · T-money',
          ja: '電子レンジ · トイレ · ゴミ · T-money',
        },
        href: '/guide/cvs-tips',
      },
    ],
  },
  {
    label: { ko: '라면 탐색', en: 'Explore Ramen', zh: '探索拉面', ja: 'ラーメンを探す' },
    color: 'text-orange-500',
    cardClass: 'bg-orange-50 border-orange-100',
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
      {
        emoji: '🛒',
        title: { ko: '해외에서 라면 사기', en: 'Buy Ramen at Home', zh: '回国后买拉面', ja: '海外でラーメンを買う' },
        desc: {
          ko: 'Amazon · H-Mart · 카르디 · 돈키호테',
          en: 'Amazon · H-Mart · Kaldi · Don Quijote',
          zh: 'Amazon · H-Mart · Kaldi · 唐吉诃德',
          ja: 'Amazon · H-Mart · カルディ · ドンキ',
        },
        href: '/guide/buy-overseas',
      },
    ],
  },
  {
    label: { ko: '라면 정보', en: 'Ramen Info', zh: '拉面信息', ja: 'ラーメン情報' },
    color: 'text-blue-500',
    cardClass: 'bg-blue-50 border-blue-100',
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
  {
    label: { ko: '커뮤니티', en: 'Community', zh: '社区', ja: 'コミュニティ' },
    color: 'text-violet-600',
    cardClass: 'bg-violet-50 border-violet-100',
    sections: [
      {
        emoji: '✏️',
        title: { ko: '꿀조합 레시피', en: 'Recipes', zh: '食谱', ja: 'レシピ' },
        desc: {
          ko: '이용자 레시피 · 좋아요 순',
          en: 'User recipes · sorted by likes',
          zh: '用户食谱 · 按点赞排序',
          ja: 'ユーザーレシピ · いいね順',
        },
        href: '/recipes',
      },
    ],
  },
]

export default function HomeScreen() {
  const { lang } = useLang()
  const router = useRouter()
  const [favorites, setFavorites] = useState<string[] | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY)
      setFavorites(raw ? JSON.parse(raw) : DEFAULT_FAVORITES)
    } catch {
      setFavorites(DEFAULT_FAVORITES)
    }
  }, [])

  const toggleFavorite = (href: string) => {
    const current = favorites ?? DEFAULT_FAVORITES
    const next = current.includes(href)
      ? current.filter(h => h !== href)
      : [...current, href]
    setFavorites(next)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  }

  const allSections = GROUPS.flatMap(g => g.sections).filter(s => s.href !== null)
  const myMenuSections = (favorites ?? [])
    .map(href => allSections.find(s => s.href === href))
    .filter((s): s is Section => s !== undefined)
  const startHereSections = START_HERE_HREFS
    .map(href => allSections.find(s => s.href === href))
    .filter((s): s is Section => s !== undefined)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-800">{HERO[lang].title}</h1>
          <LangSelector />
        </div>
      </header>

      {/* 히어로 */}
      <div className="bg-emerald-700 text-white text-center py-6 px-4 space-y-2">
        <h2 className="text-lg font-bold leading-snug">{HERO[lang].title}</h2>
        <p className="text-xs text-emerald-200">{HERO[lang].sub}</p>
      </div>

      {/* 그룹별 섹션 카드 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {myMenuSections.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm p-4">
            <p className="text-xs font-bold mb-3 text-emerald-700">{MY_MENU_LABEL[lang]}</p>
            <div className="flex flex-col gap-2">
              {myMenuSections.map(section => (
                <SectionCard
                  key={section.href}
                  section={section}
                  lang={lang}
                  isFavorite
                  variant="list"
                  onNavigate={() => router.push(section.href!)}
                  onToggleFavorite={() => toggleFavorite(section.href!)}
                  comingSoonLabel={COMING_SOON[lang]}
                />
              ))}
            </div>
          </div>
        )}

        {startHereSections.length > 0 && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold mb-3 text-slate-600">{START_HERE_LABEL[lang]}</p>
            <div className="flex flex-col gap-2">
              {startHereSections.map((section, i) => (
                <div
                  key={section.href}
                  onClick={() => router.push(section.href!)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') router.push(section.href!) }}
                  className="rounded-xl border border-slate-200 bg-white active:opacity-70 px-3 py-2.5 flex items-center gap-2 text-left transition-all cursor-pointer">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-slate-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="flex-1 text-xs text-gray-900 leading-snug min-w-0 truncate">
                    <span className="font-bold">{section.title[lang]}</span>
                    <span className="text-gray-400"> · {section.desc[lang]}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          onClick={() => router.push('/feedback')}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') router.push('/feedback') }}
          className="rounded-2xl border border-amber-300 bg-amber-50 active:opacity-70 px-4 py-3 flex items-center justify-between gap-2 text-left transition-all cursor-pointer">
          <p className="text-sm font-bold text-amber-800">{ASK_BANNER_LABEL[lang].text}</p>
          <span className="shrink-0 text-amber-700 text-lg">{ASK_BANNER_LABEL[lang].arrow}</span>
        </div>

        {GROUPS.map((group, gi) => {
          const visibleSections = group.sections.filter(
            section => section.href === null || !(favorites ?? []).includes(section.href)
          )
          if (visibleSections.length === 0) return null
          return (
            <div key={gi} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className={`text-xs font-bold mb-3 ${group.color}`}>{group.label[lang]}</p>
              <div className="grid grid-cols-2 gap-2">
                {visibleSections.map((section, si) => (
                  <SectionCard
                    key={si}
                    section={section}
                    lang={lang}
                    isFavorite={false}
                    onNavigate={() => section.href && router.push(section.href)}
                    onToggleFavorite={() => section.href && toggleFavorite(section.href)}
                    comingSoonLabel={COMING_SOON[lang]}
                    cardClass={group.cardClass}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}

function SectionCard({ section, lang, isFavorite, onNavigate, onToggleFavorite, comingSoonLabel, variant = 'grid', cardClass = 'bg-emerald-50 border-emerald-100' }: {
  section: Section
  lang: Lang
  isFavorite: boolean
  onNavigate: () => void
  onToggleFavorite: () => void
  comingSoonLabel: string
  variant?: 'grid' | 'list'
  cardClass?: string
}) {
  const ready = section.href !== null
  const isList = variant === 'list'

  if (isList) {
    return (
      <div
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onNavigate() }}
        className="rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 pl-3 py-2.5 flex items-center gap-2 text-left transition-all cursor-pointer">
        <p className="flex-1 text-xs text-gray-900 leading-snug min-w-0 truncate">
          <span className="font-bold">{section.title[lang]}</span>
          <span className="text-gray-400"> · {section.desc[lang]}</span>
        </p>
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite() }}
          className="shrink-0 flex items-center justify-center self-stretch px-3 text-xs text-gray-300 hover:text-amber-400 transition-colors">
          ⭐
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={ready ? onNavigate : undefined}
      role={ready ? 'button' : undefined}
      tabIndex={ready ? 0 : undefined}
      onKeyDown={ready ? (e => { if (e.key === 'Enter') onNavigate() }) : undefined}
      className={`relative rounded-2xl border px-3 py-3 flex flex-col items-start gap-0.5 text-left transition-all active:opacity-70
        ${ready
          ? `${cardClass} cursor-pointer`
          : 'bg-gray-50 border-gray-100 cursor-default opacity-50'}`}
    >
      {ready && (
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite() }}
          className="absolute top-2 right-2 text-sm leading-none p-0.5">
          {isFavorite ? '⭐' : '☆'}
        </button>
      )}
      <p className="text-xs font-bold text-gray-900 leading-snug pr-4">{section.title[lang]}</p>
      <p className="text-xs text-gray-400 leading-relaxed pr-4">{section.desc[lang]}</p>
      {!ready && (
        <span className="text-xs text-gray-300">{comingSoonLabel}</span>
      )}
    </div>
  )
}
