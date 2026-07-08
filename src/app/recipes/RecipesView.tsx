'use client'
// 이용자 레시피 목록 — 좋아요 순 정렬, LocalStorage 중복 방지

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Recipe, Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  title: string
  empty: string
  submit: string
  likes: string
  anonymous: string
  likeBtn: string
}> = {
  ko: { title: '레시피 공유', empty: '아직 레시피가 없어요. 첫 번째로 올려보세요!', submit: '레시피 올리기', likes: '좋아요', anonymous: '익명', likeBtn: '맛있겠다' },
  en: { title: 'Recipe Share', empty: 'No recipes yet. Be the first!', submit: 'Share a recipe', likes: 'likes', anonymous: 'Anonymous', likeBtn: 'Looks good!' },
  zh: { title: '食谱分享', empty: '还没有食谱，来第一个分享吧！', submit: '分享食谱', likes: '赞', anonymous: '匿名', likeBtn: '看起来好吃' },
  ja: { title: 'レシピ共有', empty: 'まだレシピがありません。最初に投稿しましょう！', submit: 'レシピを投稿', likes: 'いいね', anonymous: '匿名', likeBtn: 'おいしそう！' },
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <button
          onClick={() => router.push('/recipes/new')}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
          ✏️ {L.submit}
        </button>

        {loading && (
          <p className="text-center text-gray-400 py-10 text-sm">...</p>
        )}

        {!loading && recipes.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">{L.empty}</p>
        )}

        {recipes.map(recipe => {
          const ramenName = recipe.ramen_items
            ? (recipe.ramen_items[`name_${lang}` as keyof typeof recipe.ramen_items] || recipe.ramen_items.name_ko)
            : null
          const hasLiked = liked.has(recipe.id)

          return (
            <div key={recipe.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
              {ramenName && (
                <p className="text-xs font-semibold text-emerald-700">{ramenName}</p>
              )}
              <p className="text-sm font-bold text-gray-900">{recipe.ingredients}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{recipe.description}</p>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-gray-400 space-x-1">
                  {recipe.country && <span>{recipe.country}</span>}
                  {recipe.age_group && <span>· {recipe.age_group}</span>}
                  {recipe.gender && <span>· {recipe.gender}</span>}
                  <span>· {recipe.nickname || L.anonymous}</span>
                </div>
                <button
                  onClick={() => handleLike(recipe.id)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                    ${hasLiked
                      ? 'bg-red-50 text-red-500 border border-red-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'}`}>
                  ❤️ {recipe.likes > 0 ? recipe.likes : L.likeBtn}
                </button>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
