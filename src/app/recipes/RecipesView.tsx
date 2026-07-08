'use client'
// 이용자 레시피 목록 — 좋아요 순 정렬, LocalStorage 중복 방지

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Recipe, Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  empty: string
  submit: string
  anonymous: string
  likeBtn: string
  ingredients: string
  steps: string
  tip: string
}> = {
  ko: { empty: '아직 레시피가 없어요. 첫 번째로 올려보세요!', submit: '레시피 올리기', anonymous: '익명', likeBtn: '맛있겠다', ingredients: '재료', steps: '조리 순서', tip: '💡 Tip' },
  en: { empty: 'No recipes yet. Be the first!', submit: 'Share a recipe', anonymous: 'Anonymous', likeBtn: 'Looks good!', ingredients: 'Ingredients', steps: 'Steps', tip: '💡 Tip' },
  zh: { empty: '还没有食谱，来第一个分享吧！', submit: '分享食谱', anonymous: '匿名', likeBtn: '看起来好吃', ingredients: '食材', steps: '做法', tip: '💡 小贴士' },
  ja: { empty: 'まだレシピがありません。最初に投稿しましょう！', submit: 'レシピを投稿', anonymous: '匿名', likeBtn: 'おいしそう！', ingredients: '材料', steps: '作り方', tip: '💡 ヒント' },
}

const LIKED_KEY = 'liked_recipes'

function getLiked(): Set<number> {
  try {
    const raw = localStorage.getItem(LIKED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function saveLiked(set: Set<number>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]))
}

export default function RecipesView() {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  useEffect(() => {
    setLiked(getLiked())
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => setRecipes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const handleLike = async (id: number) => {
    if (liked.has(id)) return
    const newLiked = new Set(liked)
    newLiked.add(id)
    setLiked(newLiked)
    saveLiked(newLiked)
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r))
    await fetch(`/api/recipes/${id}/like`, { method: 'POST' })
  }

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <button
          onClick={() => router.push('/recipes/new')}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
          ✏️ {L.submit}
        </button>

        {loading && <p className="text-center text-gray-400 py-10 text-sm">...</p>}
        {!loading && recipes.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">{L.empty}</p>
        )}

        {recipes.map((recipe, i) => {
          const ramenName = recipe.ramen_items
            ? (recipe.ramen_items[`name_${lang}` as keyof typeof recipe.ramen_items] as string || recipe.ramen_items.name_ko)
            : null
          const hasLiked = liked.has(recipe.id)
          const isExpanded = expanded.has(recipe.id)
          const steps = recipe.steps?.split('\n').filter(s => s.trim()) ?? []

          return (
            <div key={recipe.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* 헤더 — 제목 + 좋아요 */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    {i < 3 && (
                      <span className="text-xs font-bold text-amber-500 mr-1">
                        {['🥇', '🥈', '🥉'][i]}
                      </span>
                    )}
                    <span className="text-base font-bold text-gray-900">
                      {recipe.title || recipe.ingredients}
                    </span>
                  </div>
                  <button
                    onClick={() => handleLike(recipe.id)}
                    className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                      ${hasLiked
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'}`}>
                    ❤️ {recipe.likes > 0 ? recipe.likes : L.likeBtn}
                  </button>
                </div>
                {ramenName && <p className="text-xs font-medium text-emerald-600 mb-1">{ramenName}</p>}
                {recipe.description && <p className="text-sm text-gray-500 leading-relaxed">{recipe.description}</p>}
              </div>

              {/* 재료 */}
              <div className="px-4 pb-3 border-t border-gray-50 pt-3">
                <p className="text-xs font-bold text-gray-700 mb-1">📦 {L.ingredients}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{recipe.ingredients}</p>
              </div>

              {/* 조리 순서 — 펼치기/접기 */}
              {steps.length > 0 && (
                <div className="border-t border-gray-50">
                  <button
                    onClick={() => toggleExpand(recipe.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    <span>🍳 {L.steps}</span>
                    <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 space-y-2">
                      {steps.map((step, si) => (
                        <p key={si} className="text-sm text-gray-700 leading-relaxed">{step}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 팁 */}
              {recipe.tip && isExpanded && (
                <div className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <p className="text-xs font-bold text-amber-700 mb-1">{L.tip}</p>
                  <p className="text-xs text-amber-700 leading-relaxed">{recipe.tip}</p>
                </div>
              )}

              {/* 출처 URL */}
              {recipe.source_url && isExpanded && (
                <div className="mx-4 mb-4">
                  <a href={recipe.source_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 font-medium">
                    <span className="text-base">▶</span>
                    {recipe.source_url.includes('youtube') ? 'YouTube에서 보기' : '출처 보기'}
                  </a>
                </div>
              )}

              {/* 작성자 */}
              <div className="px-4 pb-3 flex items-center gap-1 text-xs text-gray-400">
                {recipe.country && <span>{recipe.country}</span>}
                {recipe.age_group && <span>· {recipe.age_group}</span>}
                {recipe.gender && <span>· {recipe.gender}</span>}
                <span>· {recipe.nickname || L.anonymous}</span>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
