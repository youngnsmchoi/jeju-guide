'use client'
// 언어 선택 버튼 그룹 — 헤더에서 공통 사용

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

export default function LangSelector() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex gap-2">
      {LANGS.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)}
          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors
            ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          {l.label}
        </button>
      ))}
    </div>
  )
}
