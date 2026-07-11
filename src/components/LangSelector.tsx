'use client'
// 언어 선택 버튼 그룹 — 헤더에서 공통 사용 (NavBar와 동일한 텍스트형 스타일)

import { useLang } from '@/context/LangContext'
import { LANGS } from '@/lib/langs'

export default function LangSelector() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex gap-1">
      {LANGS.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)}
          className={`shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${lang === l.code ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
