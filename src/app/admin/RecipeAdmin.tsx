'use client'
// 레시피 관리 — 목록 조회 및 숨김/공개 토글

import { useEffect, useState } from 'react'
import type { Recipe } from '@/lib/types'

export default function RecipeAdmin() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hidden'>('all')

  const load = async () => {
    setLoading(true)
    const data = await fetch('/api/admin/recipes').then(r => r.json())
    setRecipes(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleHidden = async (id: number, hidden: boolean) => {
    await fetch('/api/admin/recipes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hidden }),
    })
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, hidden } : r))
  }

  const filtered = filter === 'hidden' ? recipes.filter(r => r.hidden) : recipes

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">레시피 관리</p>
        <div className="flex gap-2">
          {(['all', 'hidden'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                ${filter === f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f === 'all' ? `전체 (${recipes.length})` : `숨김 (${recipes.filter(r => r.hidden).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-gray-400 py-8 text-sm">로딩 중...</p>}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">레시피가 없습니다.</p>
      )}

      <div className="space-y-2">
        {filtered.map(recipe => {
          const ramenName = recipe.ramen_items?.name_ko ?? null
          return (
            <div key={recipe.id}
              className={`border rounded-xl px-4 py-3 space-y-1 ${recipe.hidden ? 'border-red-100 bg-red-50' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {ramenName && <p className="text-xs font-semibold text-emerald-700 mb-0.5">{ramenName}</p>}
                  <p className="text-sm font-medium text-gray-900 truncate">{recipe.ingredients}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{recipe.description}</p>
                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    {recipe.country && <span>{recipe.country}</span>}
                    {recipe.age_group && <span>· {recipe.age_group}</span>}
                    {recipe.gender && <span>· {recipe.gender}</span>}
                    <span>· {recipe.nickname || '익명'}</span>
                    <span>· ❤️ {recipe.likes}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleHidden(recipe.id, !recipe.hidden)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                    ${recipe.hidden
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                  {recipe.hidden ? '공개' : '숨김'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
