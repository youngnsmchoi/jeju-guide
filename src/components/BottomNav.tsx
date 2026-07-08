'use client'
// 하단 고정 탭바 — 핵심 5개 메뉴

import { useRouter, usePathname } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const TABS: { href: string; icon: string; label: Record<Lang, string> }[] = [
  { href: '/',          icon: '🏠', label: { ko: '홈',    en: 'Home',    zh: '首页',  ja: 'ホーム' } },
  { href: '/guide/ramen', icon: '🍜', label: { ko: '라면',  en: 'Ramen',   zh: '拉面',  ja: 'ラーメン' } },
  { href: '/guide/best5', icon: '✨', label: { ko: '추천',  en: 'Best',    zh: '推荐',  ja: 'おすすめ' } },
  { href: '/recipes',   icon: '✏️', label: { ko: '레시피', en: 'Recipes', zh: '食谱',  ja: 'レシピ' } },
  { href: '/ramen-log', icon: '📋', label: { ko: '로그',   en: 'Log',     zh: '记录',  ja: 'ログ' } },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { lang } = useLang()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
      <div className="flex items-stretch max-w-lg mx-auto">
        {TABS.map(tab => {
          const active = tab.href === '/'
            ? pathname === '/'
            : pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors
                ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className={`text-[10px] font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                {tab.label[lang]}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
