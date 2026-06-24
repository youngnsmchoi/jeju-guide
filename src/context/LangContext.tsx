'use client'
// 언어 선택 상태를 전역으로 관리하는 Context

import { createContext, useContext, useState } from 'react'
import type { Lang } from '@/lib/types'

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'ko', setLang: () => {} })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko')
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
