'use client'
// Vibe 큐레이션 — 3개 태그(해장/도전/편안함) 중 선택 → 해당 라면 목록 표시 + 룰렛으로 최종 선택

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const ROULETTE_MIN = 2
const ROULETTE_MAX = 7

type VibeTag = 'hangover' | 'hot_challenge' | 'comfort_savory'

const VIBE_OPTIONS: { tag: VibeTag; emoji: string; label: Record<Lang, string>; desc: Record<Lang, string> }[] = [
  {
    tag: 'hangover',
    emoji: '🍜',
    label: { ko: '해장', en: 'Fresh Start', zh: '解酒', ja: '二日酔い対策' },
    desc: {
      ko: '해장하고 싶어요',
      en: 'I need a fresh start!',
      zh: '想解酒',
      ja: '二日酔いを解消したい',
    },
  },
  {
    tag: 'hot_challenge',
    emoji: '🔥',
    label: { ko: '매운맛 도전', en: 'Spicy Challenge', zh: '辣度挑战', ja: '辛さに挑戦' },
    desc: {
      ko: '한국 매운맛에 도전하고 싶어요',
      en: 'I want to challenge myself!',
      zh: '想挑战韩国辣味',
      ja: '韓国の辛さに挑戦したい',
    },
  },
  {
    tag: 'comfort_savory',
    emoji: '😌',
    label: { ko: '편안한 식사', en: 'Cozy Meal', zh: '舒适一餐', ja: '落ち着く食事' },
    desc: {
      ko: '편안한 식사를 원해요',
      en: 'Just looking for a cozy meal.',
      zh: '只想吃点舒服的',
      ja: '落ち着ける食事がいい',
    },
  },
]

const LABEL: Record<Lang, {
  title: string; q1: string; recommend: string; noResult: string; retry: string; viewAll: string;
  tagSource: string;
  rouletteTitle: string; rouletteSubtitle: string; rouletteCountHint: string;
  rouletteRun: string; rouletteRunning: string; rouletteResult: string; rouletteAgain: string
}> = {
  ko: {
    title: 'K-Ramen Vibe', q1: '어떤 라면을 찾고 있나요?', recommend: '추천 라면',
    noResult: '아직 준비 중인 라면이에요.', retry: '다시 선택하기', viewAll: '전체 목록 보기',
    tagSource: '분류 출처: 해장(ize.co.kr 해장 라면 추천), 매운맛 도전(라면어워즈 스코빌 지수 랭킹), 편안한 식사(위키트리 순한 라면 소개)',
    rouletteTitle: '골라주세요!', rouletteSubtitle: '',
    rouletteCountHint: '2~7개를 체크하세요',
    rouletteRun: '라면 선택 🎲', rouletteRunning: '고르는 중...', rouletteResult: '오늘의 선택은',
    rouletteAgain: '다시 돌리기',
  },
  en: {
    title: 'K-Ramen Vibe', q1: 'What kind of ramen are you looking for?', recommend: 'Recommended',
    noResult: 'No ramen in this category yet.', retry: 'Choose again', viewAll: 'View all',
    tagSource: 'Sources: Fresh Start (ize.co.kr hangover ramen picks), Spicy Challenge (Ramen Awards Scoville ranking), Cozy Meal (Wikitree mild ramen roundup)',
    rouletteTitle: 'Pick one!', rouletteSubtitle: '',
    rouletteCountHint: 'Check 2 to 7 ramens',
    rouletteRun: 'Pick for me 🎲', rouletteRunning: 'Picking...', rouletteResult: "Today's pick",
    rouletteAgain: 'Spin again',
  },
  zh: {
    title: 'K-Ramen Vibe', q1: '你在找什么样的拉面？', recommend: '推荐拉面',
    noResult: '这个分类还没有拉面。', retry: '重新选择', viewAll: '查看全部',
    tagSource: '分类来源：解酒（ize.co.kr解酒拉面推荐）、辣度挑战（Ramen Awards史高维尔指数排名）、舒适一餐（Wikitree温和拉面介绍）',
    rouletteTitle: '帮我选！', rouletteSubtitle: '',
    rouletteCountHint: '请勾选2~7款拉面',
    rouletteRun: '帮我选 🎲', rouletteRunning: '选择中...', rouletteResult: '今天选中的是',
    rouletteAgain: '再抽一次',
  },
  ja: {
    title: 'K-Ramen Vibe', q1: 'どんなラーメンをお探しですか？', recommend: 'おすすめラーメン',
    noResult: 'このカテゴリのラーメンはまだありません。', retry: '選び直す', viewAll: '全部見る',
    tagSource: '出典：二日酔い対策（ize.co.kr 二日酔いラーメン特集）、辛さに挑戦（Ramen Awards スコヴィル値ランキング）、落ち着く食事（Wikitree マイルドラーメン特集）',
    rouletteTitle: '選んで！', rouletteSubtitle: '',
    rouletteCountHint: '2〜7個チェックしてください',
    rouletteRun: '選んで 🎲', rouletteRunning: '選択中...', rouletteResult: '今日のピック',
    rouletteAgain: 'もう一回',
  },
}

export default function VibeView({ items }: { items: RamenItem[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  const [selectedVibe, setSelectedVibe] = useState<VibeTag | null>(null)
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [spinning, setSpinning] = useState(false)
  const [displayItem, setDisplayItem] = useState<RamenItem | null>(null)
  const [winner, setWinner] = useState<RamenItem | null>(null)
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const results = selectedVibe ? items.filter(item => item.vibe_tag === selectedVibe) : []

  const toggleCheck = (id: number) => {
    setWinner(null)
    setCheckedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= ROULETTE_MAX) return prev
      return [...prev, id]
    })
  }

  const checkedItems = results.filter(item => checkedIds.includes(item.id))
  const canSpin = checkedItems.length >= ROULETTE_MIN

  const runRoulette = () => {
    if (!canSpin || spinning) return
    setSpinning(true)
    setWinner(null)
    let ticks = 0
    const totalTicks = 20 + Math.floor(Math.random() * 10)
    spinTimer.current = setInterval(() => {
      const random = checkedItems[Math.floor(Math.random() * checkedItems.length)]
      setDisplayItem(random)
      ticks += 1
      if (ticks >= totalTicks) {
        if (spinTimer.current) clearInterval(spinTimer.current)
        const finalPick = checkedItems[Math.floor(Math.random() * checkedItems.length)]
        setDisplayItem(finalPick)
        setWinner(finalPick)
        setSpinning(false)
      }
    }, 80)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">

        {/* 태그 선택 */}
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">{L.q1}</p>
          <div className="space-y-2">
            {VIBE_OPTIONS.map(opt => (
              <button key={opt.tag} onClick={() => { setSelectedVibe(opt.tag); setCheckedIds([]); setWinner(null) }}
                className={`w-full bg-white rounded-2xl border p-4 text-left transition-all flex items-center gap-3
                  ${selectedVibe === opt.tag ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:border-emerald-300'}`}>
                <span className="text-3xl shrink-0">{opt.emoji}</span>
                <span>
                  <span className="block text-sm font-bold text-gray-900">{opt.label[lang]}</span>
                  <span className="block text-xs text-gray-500 mt-0.5">{opt.desc[lang]}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-300 mt-3">{L.tagSource}</p>
        </div>

        {/* 결과 */}
        {selectedVibe && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">{L.recommend}</h2>
            {results.length === 0 ? (
              <p className="text-gray-400 text-center py-10">{L.noResult}</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {results.map(item => {
                    const checked = checkedIds.includes(item.id)
                    const disabled = !checked && checkedIds.length >= ROULETTE_MAX
                    return (
                      <button key={item.id} onClick={() => toggleCheck(item.id)} disabled={disabled}
                        className={`bg-white rounded-2xl border p-3 text-left flex items-start justify-between gap-2 transition-all
                          ${checked ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}
                          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-gray-900 leading-snug">{getRamenField(item, 'name', lang)}</span>
                          {item.price_krw && <span className="block text-xs text-gray-400 mt-1">₩{item.price_krw.toLocaleString()}</span>}
                        </span>
                        <span className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] mt-0.5
                          ${checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
                          {checked ? '✓' : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* 라면 룰렛 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{L.rouletteTitle}</p>
                    {L.rouletteSubtitle && <p className="text-xs text-gray-400 mt-0.5">{L.rouletteSubtitle}</p>}
                  </div>
                  <p className="text-xs text-gray-500">{L.rouletteCountHint} ({checkedIds.length}/{ROULETTE_MAX})</p>

                  {displayItem && (
                    <div className={`rounded-xl border-2 px-4 py-4 text-center transition-all
                      ${winner ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                      {winner && <p className="text-xs font-bold text-emerald-600 mb-1">{L.rouletteResult}</p>}
                      <p className={`font-black text-gray-900 ${winner ? 'text-xl' : 'text-base'}`}>
                        {getRamenField(displayItem, 'name', lang)}
                      </p>
                    </div>
                  )}

                  <button onClick={runRoulette} disabled={!canSpin || spinning}
                    className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {spinning ? L.rouletteRunning : winner ? L.rouletteAgain : L.rouletteRun}
                  </button>
                </div>
              </>
            )}

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700">
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

            <div className="space-y-2 pt-1">
              <button onClick={() => setSelectedVibe(null)}
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
