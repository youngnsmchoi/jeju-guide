'use client'
// 언어 선택 상태를 전역으로 관리하는 Context

import { createContext, useContext, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Lang } from '@/lib/types'

const VALID_LANGS: Lang[] = ['ko', 'en', 'zh', 'ja']

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: 'en', setLang: () => {} })

// 다른 언어 홈(/ko 등)에서 ?lang= 파라미터를 붙여 링크하면, 클라이언트 라우팅으로 페이지가
// 바뀌어도(레이아웃은 리마운트되지 않으므로) 매번 URL을 다시 읽어 언어를 맞춘다.
// (언어를 영구 고정하는 것이 아니라 "이동 시점의 언어"만 1회성으로 전달하는 용도)
function LangUrlSync({ skip, setLang }: { skip: boolean; setLang: (l: Lang) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (skip) return
    const param = searchParams.get('lang')
    if (VALID_LANGS.includes(param as Lang)) setLang(param as Lang)
  }, [skip, searchParams, setLang])
  return null
}

export function LangProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang ?? 'en')
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Suspense fallback={null}>
        <LangUrlSync skip={!!initialLang} setLang={setLang} />
      </Suspense>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
