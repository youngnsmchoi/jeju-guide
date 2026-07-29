'use client'
// 언어 선택 상태를 전역으로 관리하는 Context

import { createContext, useContext, useState } from 'react'
import type { Lang } from '@/lib/types'

const VALID_LANGS: Lang[] = ['ko', 'en', 'zh', 'ja']

// 다른 언어 홈(/ko 등)에서 ?lang= 파라미터를 붙여 링크하면, 이동한 페이지가 그 언어로 시작하도록 함
// (언어를 영구 고정하는 것이 아니라 "이동 시점의 언어"만 1회성으로 전달하는 용도)
function getInitialLangFromUrl(): Lang | null {
  if (typeof window === 'undefined') return null
  const param = new URLSearchParams(window.location.search).get('lang')
  return VALID_LANGS.includes(param as Lang) ? (param as Lang) : null
}

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(() => initialLang ?? getInitialLangFromUrl() ?? 'en')
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
