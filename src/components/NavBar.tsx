'use client'
// 모든 하위 페이지 공통 상단 네비게이션 바

import { useRouter, usePathname } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import { LANGS } from '@/lib/langs'

const NAV: { href: string; label: Record<Lang, string> }[] = [
  { href: '/guide/payment',       label: { ko: '계산', en: 'Pay', zh: '付款', ja: 'お会計' } },
  { href: '/guide/cooking',       label: { ko: '조리법', en: 'Cook', zh: '做法', ja: '作り方' } },
  { href: '/guide/ramen',         label: { ko: '라면목록', en: 'Ramen', zh: '拉面', ja: 'ラーメン' } },
  { href: '/guide/best5',         label: { ko: 'Best 5', en: 'Best 5', zh: 'Best 5', ja: 'Best 5' } },
  { href: '/guide/toppings',      label: { ko: '꿀조합', en: 'Combos', zh: '搭配', ja: 'トッピング' } },
  { href: '/guide/country-picks', label: { ko: '나라별', en: 'Country', zh: '各国', ja: '国別' } },
  { href: '/vibe',                label: { ko: 'Vibe', en: 'Vibe', zh: 'Vibe', ja: 'Vibe' } },
  { href: '/recipes',             label: { ko: '레시피', en: 'Recipes', zh: '食谱', ja: 'レシピ' } },
  { href: '/ramen-log',           label: { ko: '로그', en: 'Log', zh: '记录', ja: 'ログ' } },
]

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { lang, setLang } = useLang()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
        {/* 홈 버튼 */}
        <button
          onClick={() => router.push('/')}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors mr-1">
          ← 홈
        </button>

        <div className="w-px h-4 bg-gray-200 shrink-0" />

        {/* 페이지 메뉴 */}
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <button key={item.href} onClick={() => router.push(item.href)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
                ${active
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'}`}>
              {item.label[lang]}
            </button>
          )
        })}

        <div className="w-px h-4 bg-gray-200 shrink-0 ml-1" />

        {/* 언어 선택 */}
        {LANGS.map(l => (
          <button key={l.code} onClick={() => setLang(l.code)}
            className={`shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${lang === l.code ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
            {l.code.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  )
}
