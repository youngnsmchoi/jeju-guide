'use client'
// 홈 화면 상단 통합 검색 — 정적 가이드 페이지 + DB 상품명을 대상으로 실시간 검색

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lang } from '@/lib/types'

type SearchResult = { name: string; href: string; group: string }

const PLACEHOLDER: Record<Lang, string> = {
  ko: '검색 (예: 신라면, 교통카드, T-money)',
  en: 'Search (e.g. ramen, T-money)',
  zh: '搜索（例如：拉面、交通卡）',
  ja: '検索（例：ラーメン、交通カード）',
}

const NO_RESULTS: Record<Lang, string> = {
  ko: '검색 결과가 없습니다',
  en: 'No results found',
  zh: '没有找到结果',
  ja: '検索結果がありません',
}

export default function SearchBox({ lang }: { lang: Lang }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults(null); return }
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${lang}`)
        .then(r => r.json())
        .then(setResults)
        .catch(() => setResults([]))
    }, 200)
    return () => clearTimeout(timer)
  }, [query, lang])

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={PLACEHOLDER[lang]}
          className="w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {open && results !== null && (
        <div className="absolute z-30 mt-1 w-full bg-white rounded-2xl border border-gray-200 shadow-lg max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">{NO_RESULTS[lang]}</p>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => router.push(r.href)}
                className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-b-0">
                <p className="text-sm font-medium text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-400">{r.group}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
