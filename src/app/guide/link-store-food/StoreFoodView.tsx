'use client'
// 편의점 먹거리 허브 — 삼각김밥/줄김밥/도시락/핫바/디저트 카드 모음
// 순서는 가볍게 시작(김밥류) → 한 끼(도시락) → 사이드(핫바) → 디저트 흐름

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, { title: string; intro: string }> = {
  ko: { title: '편의점 먹거리', intro: '라면 말고도 편의점엔 먹을 게 많습니다. 종류별로 골라보세요.' },
  en: { title: 'Convenience Store Food', intro: 'There\'s more than ramen at the convenience store. Pick a category.' },
  zh: { title: '便利店美食', intro: '便利店里不只有拉面，还有很多好吃的。按种类挑选吧。' },
  ja: { title: 'コンビニグルメ', intro: 'ラーメン以外にもコンビニには美味しいものがたくさん。カテゴリーから選んでみましょう。' },
}

type Card = {
  emoji: string
  title: Record<Lang, string>
  desc: Record<Lang, string>
  href: string
  cardClass: string
}

const CARDS: Card[] = [
  {
    emoji: '🍙',
    title: { ko: '삼각김밥', en: 'Triangle Gimbap', zh: '饭团', ja: 'おにぎり' },
    desc: {
      ko: '포장 뜯는 법 · 실물로 확인하는 법',
      en: 'How to unwrap · how to check in-store',
      zh: '拆包装方法 · 现场确认方法',
      ja: '包装の開け方 · 店頭での確認方法',
    },
    href: '/guide/gimbap',
    cardClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    emoji: '🍙',
    title: { ko: '줄김밥', en: 'Gimbap Roll', zh: '紫菜卷', ja: '海苔巻き' },
    desc: {
      ko: '삼각김밥보다 든든한 한 끼 · 종류별 구성',
      en: 'A heartier meal than triangle gimbap · what\'s inside',
      zh: '比饭团更饱腹的一餐 · 各类构成',
      ja: 'おにぎりより食べ応えのある一食 · 種類別の内容',
    },
    href: '/guide/jul-gimbap',
    cardClass: 'bg-teal-50 border-teal-100',
  },
  {
    emoji: '🍱',
    title: { ko: '도시락', en: 'Bento', zh: '便当', ja: '弁当' },
    desc: {
      ko: '데우는 법 · 종류별 구성',
      en: 'How to heat · what\'s inside',
      zh: '加热方法 · 各类构成',
      ja: '温め方 · 種類別の内容',
    },
    href: '/guide/dosirak',
    cardClass: 'bg-blue-50 border-blue-100',
  },
  {
    emoji: '🍢',
    title: { ko: '핫바', en: 'Hotbar', zh: '关东煮/串', ja: 'ホットバー' },
    desc: {
      ko: '사는 법 · 종류별 정보',
      en: 'How to buy · types',
      zh: '购买方法 · 各类信息',
      ja: '買い方 · 種類別情報',
    },
    href: '/guide/hotbar',
    cardClass: 'bg-orange-50 border-orange-100',
  },
  {
    emoji: '🍭',
    title: { ko: '디저트/간식', en: 'Snacks & Desserts', zh: '零食甜品', ja: 'お菓子・デザート' },
    desc: {
      ko: '한국인이 꼭 먹어보라는 스테디셀러',
      en: 'Steady sellers Koreans always recommend',
      zh: '韩国人力荐的长销单品',
      ja: '韓国人おすすめのロングセラー',
    },
    href: '/guide/snacks',
    cardClass: 'bg-violet-50 border-violet-100',
  },
]

export default function StoreFoodView() {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        <div className="space-y-3">
          {CARDS.map(card => (
            <div
              key={card.href}
              onClick={() => router.push(card.href)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') router.push(card.href) }}
              className={`rounded-2xl border px-4 py-4 flex items-center gap-3 cursor-pointer active:opacity-70 transition-all ${card.cardClass}`}
            >
              <span className="text-3xl shrink-0">{card.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-gray-900">{card.title[lang]}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{card.desc[lang]}</p>
              </div>
              <span className="text-gray-300 text-lg shrink-0">›</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
