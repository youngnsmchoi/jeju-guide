'use client'
// 언어 선택 상태를 전역으로 관리하는 Context

import { createContext, useContext, useState } from 'react'
import type { Lang } from '@/lib/types'

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children, initialLang = 'en' }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
