'use client'
// Vibe 큐레이션 — 3문항(기분/맵기/재료) → 라면 추천 3개

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'

type VibeTag = 'hangover' | 'comfort' | 'challenge' | 'mild'
type Ingredient = 'cheese' | 'egg' | 'gimbap'

const VIBE_OPTIONS: { tag: VibeTag; emoji: string; label: Record<Lang, string>; desc: Record<Lang, string> }[] = [
  {
    tag: 'hangover',
    emoji: '🍜',
    label: { ko: '해장', en: 'Hangover Cure', zh: '解酒', ja: '二日酔い' },
    desc: { ko: '얼큰한 국물이 당겨요', en: 'I need a spicy hot soup', zh: '想喝辣汤', ja: '辛いスープが飲みたい' },
  },
  {
    tag: 'comfort',
    emoji: '😌',
    label: { ko: '위로', en: 'Comfort', zh: '慰藉', ja: '癒し' },
    desc: { ko: '부드럽고 편안한 맛이 좋아요', en: 'Something mild and cozy', zh: '想要温和舒适的味道', ja: '優しい味が食べたい' },
  },
  {
    tag: 'challenge',
    emoji: '🔥',
    label: { ko: '도전', en: 'Challenge', zh: '挑战', ja: 'チャレンジ' },
    desc: { ko: '한국 매운맛에 도전하고 싶어요', en: 'Bring on the Korean heat!', zh: '想挑战韩国辣味', ja: '韓国の辛さに挑戦したい' },
  },
  {
    tag: 'mild',
    emoji: '🌿',
    label: { ko: '순한맛', en: 'Mild', zh: '温和', ja: 'マイルド' },
    desc: { ko: '매운 거 잘 못 먹어요', en: 'Not good with spicy food', zh: '不太能吃辣', ja: '辛いのが苦手' },
  },
]

const SPICE_OPTIONS: { level: number; label: Record<Lang, string> }[] = [
  { level: 1, label: { ko: '안 매운 것만', en: 'Not spicy at all', zh: '完全不辣', ja: '辛くないもの' } },
  { level: 2, label: { ko: '살짝 매운 정도', en: 'Just a little spicy', zh: '微微辣', ja: 'ちょっと辛め' } },
  { level: 3, label: { ko: '신라면 정도', en: 'Like Shin Ramyun', zh: '辛拉面程度', ja: '辛ラーメンくらい' } },
  { level: 4, label: { ko: '꽤 매운 것도 OK', en: 'Fairly spicy is fine', zh: '比较辣也OK', ja: 'かなり辛くてもOK' } },
  { level: 5, label: { ko: '극한의 매운맛', en: 'Maximum spice!', zh: '极辣！', ja: '激辛！' } },
]

const INGREDIENT_OPTIONS: { key: Ingredient; emoji: string; label: Record<Lang, string> }[] = [
  { key: 'egg', emoji: '🥚', label: { ko: '계란', en: 'Egg', zh: '鸡蛋', ja: '卵' } },
  { key: 'cheese', emoji: '🧀', label: { ko: '치즈', en: 'Cheese', zh: '芝士', ja: 'チーズ' } },
  { key: 'gimbap', emoji: '🍙', label: { ko: '삼각김밥', en: 'Rice ball', zh: '三角饭团', ja: 'おにぎり' } },
]

const LABEL: Record<Lang, {
  title: string; back: string; step: string; next: string; result: string;
  q1: string; q2: string; q3: string; q3skip: string; recommend: string; noResult: string; retry: string; viewAll: string
}> = {
  ko: { title: 'K-Ramen Vibe', back: '← 뒤로', step: '단계', next: '다음', result: '결과', q1: '지금 기분이 어때요?', q2: '매운맛은 얼마나 괜찮아요?', q3: '같이 먹고 싶은 것이 있나요?', q3skip: '그냥 라면만', recommend: '추천 라면', noResult: '조건에 맞는 라면이 없어요. 다시 선택해 보세요.', retry: '다시 하기', viewAll: '전체 목록 보기' },
  en: { title: 'K-Ramen Vibe', back: '← Back', step: 'Step', next: 'Next', result: 'Result', q1: "What's your vibe right now?", q2: 'How spicy can you handle?', q3: 'Want to add anything?', q3skip: 'Just ramen', recommend: 'Recommended', noResult: 'No match found. Try again!', retry: 'Try again', viewAll: 'View all' },
  zh: { title: 'K-Ramen Vibe', back: '← 返回', step: '步骤', next: '下一步', result: '结果', q1: '你现在的心情？', q2: '能接受多辣？', q3: '想搭配什么？', q3skip: '只要泡面', recommend: '推荐拉面', noResult: '没有符合的拉面，请重试。', retry: '重新选择', viewAll: '查看全部' },
  ja: { title: 'K-Ramen Vibe', back: '← 戻る', step: 'ステップ', next: '次へ', result: '結果', q1: '今の気分は？', q2: '辛さはどのくらいOK？', q3: '一緒に食べたいものは？', q3skip: 'ラーメンだけ', recommend: 'おすすめラーメン', noResult: '条件に合うラーメンがありません。', retry: 'もう一度', viewAll: '全部見る' },
}

function recommend(items: RamenItem[], vibe: VibeTag, spice: number, ingredients: Ingredient[]): RamenItem[] {
  const scored = items.map(item => {
    let score = 0
    if (item.vibe_tag === vibe) score += 3
    const diff = Math.abs((item.spice_level_std ?? 3) - spice)
    score += Math.max(0, 3 - diff)
    if (ingredients.length > 0) {
      const match = item.ingredient_match?.split(',') ?? []
      ingredients.forEach(ing => { if (match.includes(ing)) score += 1 })
    }
    return { item, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.item)
}

export default function VibeView({ items }: { items: RamenItem[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  const [step, setStep] = useState<1 | 2 | 3 | 'result'>(1)
  const [vibe, setVibe] = useState<VibeTag | null>(null)
  const [spice, setSpice] = useState<number | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  const toggleIngredient = (ing: Ingredient) =>
    setIngredients(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing])

  const results = step === 'result' && vibe && spice !== null
    ? recommend(items, vibe, spice, ingredients)
    : []

  const reset = () => { setStep(1); setVibe(null); setSpice(null); setIngredients([]) }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => step === 1 ? router.back() : step === 2 ? setStep(1) : step === 3 ? setStep(2) : reset()}
            className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="text-xs text-gray-400">
            {step !== 'result' ? `${L.step} ${step} / 3` : L.result}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        {/* 1단계: 기분 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{L.q1}</h2>
            <div className="grid grid-cols-2 gap-3">
              {VIBE_OPTIONS.map(opt => (
                <button key={opt.tag} onClick={() => { setVibe(opt.tag); setStep(2) }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 text-left hover:border-emerald-400 hover:shadow-sm transition-all">
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <div className="text-sm font-bold text-gray-900">{opt.label[lang]}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc[lang]}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2단계: 맵기 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{L.q2}</h2>
            <div className="space-y-2">
              {SPICE_OPTIONS.map(opt => (
                <button key={opt.level} onClick={() => { setSpice(opt.level); setStep(3) }}
                  className="w-full bg-white rounded-2xl border border-gray-200 px-4 py-3 text-left hover:border-emerald-400 hover:shadow-sm transition-all flex items-center gap-3">
                  <span className="text-sm">{'🌶️'.repeat(opt.level)}</span>
                  <span className="text-sm font-medium text-gray-800">{opt.label[lang]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3단계: 재료 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{L.q3}</h2>
            <div className="grid grid-cols-3 gap-3">
              {INGREDIENT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => toggleIngredient(opt.key)}
                  className={`bg-white rounded-2xl border p-4 text-center transition-all
                    ${ingredients.includes(opt.key) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}>
                  <div className="text-3xl mb-1">{opt.emoji}</div>
                  <div className="text-xs font-medium text-gray-800">{opt.label[lang]}</div>
                </button>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <button onClick={() => setStep('result')}
                className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
                {L.next} →
              </button>
              <button onClick={() => { setIngredients([]); setStep('result') }}
                className="w-full bg-white border border-gray-200 text-gray-500 py-3 rounded-2xl text-sm hover:bg-gray-50 transition-colors">
                {L.q3skip}
              </button>
            </div>
          </div>
        )}

        {/* 결과 */}
        {step === 'result' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{L.recommend}</h2>
            {results.length === 0 ? (
              <p className="text-gray-400 text-center py-10">{L.noResult}</p>
            ) : (
              <div className="space-y-3">
                {results.map((item, i) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
                    <span className="text-2xl font-black text-emerald-500">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{getRamenField(item, 'name', lang)}</p>
                      {item.price_krw && <p className="text-xs text-gray-400 mt-0.5">₩{item.price_krw.toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700">
              {lang === 'ko' && '이 라면 드셨나요? 먹어본 후 한 줄 남겨주세요 →'}
              {lang === 'en' && 'Tried this ramen? Leave a quick note after eating →'}
              {lang === 'zh' && '吃过这款拉面了吗？吃完后留下简短评价 →'}
              {lang === 'ja' && 'このラーメン食べましたか？食べた後に一言残してください →'}
              <button
                onClick={() => router.push(`/ramen-log${results[0] ? `?ramen_id=${results[0].id}` : ''}`)}
                className="block w-full mt-2 text-center font-semibold underline">
                My Ramen Log
              </button>
            </div>
            <div className="space-y-2 pt-2">
              <button onClick={reset}
                className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
                {L.retry}
              </button>
              <button onClick={() => router.push('/guide/ramen')}
                className="w-full bg-white border border-gray-200 text-gray-500 py-3 rounded-2xl text-sm hover:bg-gray-50 transition-colors">
                {L.viewAll}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
