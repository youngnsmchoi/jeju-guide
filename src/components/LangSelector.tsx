'use client'
// 언어 선택 버튼 그룹 — 헤더에서 공통 사용 (NavBar와 동일한 텍스트형 스타일)

import { useLang } from '@/context/LangContext'
import { LANGS } from '@/lib/langs'

export default function LangSelector() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center">
          {i > 0 && <span className="text-xs text-gray-300 select-none">/</span>}
          <button onClick={() => setLang(l.code)}
            className={`shrink-0 px-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${lang === l.code ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
            {l.code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
