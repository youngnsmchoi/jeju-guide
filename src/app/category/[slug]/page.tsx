'use client'
// 카테고리 하위 항목 리스트 페이지

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bus, Store, Compass, Cross, type LucideIcon } from 'lucide-react'
import { useLang } from '@/context/LangContext'
import { getTitle } from '@/lib/types'
import type { Category, Item, Lang } from '@/lib/types'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  transport: Bus,
  living: Store,
  local: Compass,
  essential: Cross,
}

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const BACK_LABEL: Record<Lang, string> = {
  ko: '홈',
  en: 'Home',
  zh: '首页',
  ja: 'ホーム',
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { lang, setLang } = useLang()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(async ({ slug }) => {
      const catRes = await fetch('/api/categories').then((r) => r.json())
      const cats: Category[] = Array.isArray(catRes) ? catRes : []
      const cat = cats.find((c) => c.slug === slug) ?? null
      setCategory(cat)
      if (cat) {
        const its = await fetch(`/api/items?category_id=${cat.id}`).then((r) => r.json())
        setItems(Array.isArray(its) ? its : [])
      }
      setLoading(false)
    })
  }, [params])

  if (loading) return <div className="text-center text-gray-400 py-20">불러오는 중...</div>
  if (!category) return <div className="text-center text-gray-400 py-20">카테고리를 찾을 수 없습니다.</div>

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600"
          >
            ← {BACK_LABEL[lang]}
          </button>
          <div className="flex gap-2">
            {LANG_LABELS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors
                  ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 카테고리 타이틀 */}
      <div className="bg-emerald-700 text-white text-center py-6 px-4">
        {(() => {
          const Icon = CATEGORY_ICONS[category.slug]
          return Icon && <Icon className="w-7 h-7 mx-auto mb-1" strokeWidth={1.5} />
        })()}
        <h1 className="text-lg font-bold">{getTitle(category, lang)}</h1>
      </div>

      {/* 항목 리스트 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 py-20">항목이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/guide/${item.slug}`)}
                className="w-full bg-white rounded-xl border border-gray-100 px-4 py-3 text-left flex items-center gap-4 hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <span className="flex-1 text-base font-bold text-gray-800">{getTitle(item, lang)}</span>
                <div className="w-36 h-24 shrink-0 rounded-lg bg-white overflow-hidden">
                  {item.image_url && (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
