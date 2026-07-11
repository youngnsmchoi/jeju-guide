'use client'
// My Ramen Log — 기록하기 탭 + 나라별 현황 탭

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

const COUNTRIES = [
  { code: 'china',       flag: '🇨🇳', label: 'China' },
  { code: 'japan',       flag: '🇯🇵', label: 'Japan' },
  { code: 'taiwan',      flag: '🇹🇼', label: 'Taiwan' },
  { code: 'usa',         flag: '🇺🇸', label: 'USA' },
  { code: 'vietnam',     flag: '🇻🇳', label: 'Vietnam' },
  { code: 'thailand',    flag: '🇹🇭', label: 'Thailand' },
  { code: 'philippines', flag: '🇵🇭', label: 'Philippines' },
  { code: 'other',       flag: '🌍', label: 'Other' },
]

const FLAG: Record<string, string> = Object.fromEntries(COUNTRIES.map(c => [c.code, c.flag]))

const RATINGS = [
  { value: 'good',    emoji: '😊' },
  { value: 'neutral', emoji: '😐' },
  { value: 'bad',     emoji: '😞' },
]

const MEMO_TAGS: Record<Lang, { key: string; label: string }[]> = {
  ko: [
    { key: 'egg',       label: '🥚 계란 넣으면 더 맛있어요' },
    { key: 'cheese',    label: '🧀 치즈 추가 추천해요' },
    { key: 'less_water',label: '💧 물 적게 넣으면 더 맛있어요' },
    { key: 'spicy',     label: '🌶️ 예상보다 많이 매워요' },
    { key: 'rice',      label: '🍚 밥이랑 먹으면 좋아요' },
    { key: 'water',     label: '😅 물이 많이 필요해요' },
  ],
  en: [
    { key: 'egg',       label: '🥚 Better with egg' },
    { key: 'cheese',    label: '🧀 Try adding cheese' },
    { key: 'less_water',label: '💧 Less water = more flavor' },
    { key: 'spicy',     label: '🌶️ Spicier than expected' },
    { key: 'rice',      label: '🍚 Great with rice' },
    { key: 'water',     label: '😅 Need lots of water' },
  ],
  zh: [
    { key: 'egg',       label: '🥚 加鸡蛋更好吃' },
    { key: 'cheese',    label: '🧀 推荐加芝士' },
    { key: 'less_water',label: '💧 少加水更香' },
    { key: 'spicy',     label: '🌶️ 比想象中辣' },
    { key: 'rice',      label: '🍚 配米饭很好' },
    { key: 'water',     label: '😅 需要多喝水' },
  ],
  ja: [
    { key: 'egg',       label: '🥚 卵を入れると美味しい' },
    { key: 'cheese',    label: '🧀 チーズ追加がおすすめ' },
    { key: 'less_water',label: '💧 お湯少なめが美味しい' },
    { key: 'spicy',     label: '🌶️ 思ったより辛い' },
    { key: 'rice',      label: '🍚 ご飯と一緒に' },
    { key: 'water',     label: '😅 水が多く必要' },
  ],
}

const LABEL: Record<Lang, {
  title: string; back: string; tabLog: string; tabStats: string;
  q1: string; q2: string; q3: string; qMemo: string; qNote: string;
  notePlaceholder: string;
  submit: string; privacy: string; done: string; doneMsg: string;
  error: string; alreadyLogged: string; loading: string; noData: string; total: string;
}> = {
  ko: {
    title: 'My Ramen Log', back: '← 홈', tabLog: '기록하기', tabStats: '발자취',
    q1: '어떤 라면 드셨어요?', q2: '어느 나라에서 오셨어요?', q3: '맛이 어땠어요?',
    qMemo: '이 라면 어떻게 드셨어요? (선택)',
    qNote: '하고 싶은 말 (선택)',
    notePlaceholder: '아쉬운 점, 이렇게 먹으면 맛있어요, 한마디...',
    submit: '완료', privacy: '선택하신 정보는 국가별 익명 통계로만 활용됩니다.',
    done: '감사합니다!', doneMsg: '소중한 의견이 K-Ramen 가이드 개선에 활용됩니다.',
    error: '제출에 실패했습니다. 다시 시도해 주세요.',
    alreadyLogged: '이 라면은 이미 기록하셨습니다.',
    loading: '불러오는 중...', noData: '아직 등록된 발자취가 없습니다.', total: '명',
  },
  en: {
    title: 'My Ramen Log', back: '← Home', tabLog: 'Log', tabStats: 'Footprints',
    q1: 'Which ramen did you have?', q2: 'Where are you from?', q3: 'How was it?',
    qMemo: 'How did you eat it? (optional)',
    qNote: 'Anything to add? (optional)',
    notePlaceholder: 'Tips, complaints, how to make it better...',
    submit: 'Done', privacy: 'Your response is collected as anonymous statistics by country.',
    done: 'Thank you!', doneMsg: 'Your feedback helps improve the K-Ramen guide.',
    error: 'Submission failed. Please try again.',
    alreadyLogged: 'You already logged this ramen.',
    loading: 'Loading...', noData: 'No footprints yet.', total: 'people',
  },
  zh: {
    title: 'My Ramen Log', back: '← 主页', tabLog: '记录', tabStats: '足迹',
    q1: '您吃了哪种拉面？', q2: '您来自哪个国家？', q3: '味道怎么样？',
    qMemo: '您是怎么吃的？（可选）',
    qNote: '还有什么想说的？（可选）',
    notePlaceholder: '不足之处、这样吃更好吃、一句话...',
    submit: '完成', privacy: '您的选择仅用于按国家匿名统计。',
    done: '谢谢！', doneMsg: '您的反馈将用于改进K-Ramen指南。',
    error: '提交失败，请重试。',
    alreadyLogged: '您已经记录过这款拉面了。',
    loading: '加载中...', noData: '还没有足迹。', total: '人',
  },
  ja: {
    title: 'My Ramen Log', back: '← ホーム', tabLog: '記録する', tabStats: '足跡',
    q1: 'どのラーメンを食べましたか？', q2: 'どちらの国からお越しですか？', q3: '味はいかがでしたか？',
    qMemo: 'どのように食べましたか？（任意）',
    qNote: '一言メモ（任意）',
    notePlaceholder: '残念だった点、こうすると美味しい、ひとこと...',
    submit: '完了', privacy: 'ご回答は国別の匿名統計としてのみ使用されます。',
    done: 'ありがとうございます！', doneMsg: 'ご意見はK-Ramenガイドの改善に活用されます。',
    error: '送信に失敗しました。もう一度お試しください。',
    alreadyLogged: 'このラーメンはすでに記録済みです。',
    loading: '読み込み中...', noData: 'まだ足跡がありません。', total: '人',
  },
}

const STORAGE_KEY = 'ramen_log_logged'

function getLogged(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as number[])
  } catch { return new Set() }
}

function addLogged(id: number) {
  const set = getLogged()
  set.add(id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

interface StatRow {
  ramen_id: number
  name_ko: string
  name_en: string
  total: number
  countries: Record<string, number>
}

interface FeedEntry {
  id: number
  ramen_id: number
  country: string
  rating: 'good' | 'neutral' | 'bad'
  memo_tags: string[] | null
  note: string | null
  created_at: string
  ramen_items: { name_ko: string; name_en: string } | null
}

function timeAgo(dateStr: string, lang: Lang): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (lang === 'ko') {
    if (diff < 60) return '방금'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  }
  if (lang === 'zh') {
    if (diff < 60) return '刚刚'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    return `${Math.floor(diff / 86400)}天前`
  }
  if (lang === 'ja') {
    if (diff < 60) return 'たった今'
    if (diff < 3600) return `${Math.floor(diff / 60)}分前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`
    return `${Math.floor(diff / 86400)}日前`
  }
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// 태그 key → 현재 언어 라벨 변환
function tagLabel(key: string, lang: Lang): string {
  return MEMO_TAGS[lang].find(t => t.key === key)?.label ?? key
}

function StatsTab({ lang }: { lang: Lang }) {
  const L = LABEL[lang]
  const [stats, setStats] = useState<StatRow[]>([])
  const [feed, setFeed] = useState<FeedEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/ramen-log').then(r => r.json()),
      fetch('/api/admin/ramen-log').then(r => r.json()),
    ]).then(([s, f]) => {
      setStats(Array.isArray(s) ? s : [])
      setFeed(Array.isArray(f) ? f : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center text-gray-400 py-12 text-sm">{L.loading}</p>

  return (
    <div className="space-y-4">
      {/* 인기 라면 집계 */}
      {stats.length > 0 && (
        <div className="space-y-2">
          {stats.map(row => {
            const name = lang === 'ko' ? row.name_ko : row.name_en || row.name_ko
            const topCountries = Object.entries(row.countries).sort((a, b) => b[1] - a[1]).slice(0, 4)
            return (
              <div key={row.ramen_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <span className="text-xs text-emerald-600 font-semibold">{row.total} {L.total}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topCountries.map(([code, count]) => (
                    <span key={code} className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                      {FLAG[code] ?? '🌍'} <span className="text-gray-500">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 발자취 피드 */}
      <p className="text-xs font-bold text-gray-400 pt-2">— {L.tabStats}</p>
      {feed.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">{L.noData}</p>
      ) : (
        <div className="space-y-2">
          {feed.map(entry => {
            const name = lang === 'ko'
              ? entry.ramen_items?.name_ko
              : (entry.ramen_items as { name_ko: string; name_en?: string } | null)?.name_en || entry.ramen_items?.name_ko
            const ratingEmoji = entry.rating === 'good' ? '😊' : entry.rating === 'neutral' ? '😐' : '😞'
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{FLAG[entry.country] ?? '🌍'}</span>
                    <span className="text-sm font-semibold text-gray-800">{name}</span>
                    <span className="text-base">{ratingEmoji}</span>
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(entry.created_at, lang)}</span>
                </div>
                {entry.memo_tags && entry.memo_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.memo_tags.map(key => (
                      <span key={key} className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-0.5">
                        {tagLabel(key, lang)}
                      </span>
                    ))}
                  </div>
                )}
                {entry.note && (
                  <p className="text-xs text-gray-500 leading-relaxed">"{entry.note}"</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function RamenLogView({ items }: { items: RamenItem[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const searchParams = useSearchParams()
  const L = LABEL[lang]

  const [tab, setTab] = useState<'log' | 'stats'>('log')
  const preselectedId = searchParams.get('ramen_id')
  const [ramenId, setRamenId] = useState<string>(preselectedId ?? '')
  const [country, setCountry] = useState<string>('')
  const [rating, setRating] = useState<string>('')
  const [memoTags, setMemoTags] = useState<string[]>([])
  const [note, setNote] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const [alreadyLogged, setAlreadyLogged] = useState(false)

  const isLogged = ramenId ? getLogged().has(Number(ramenId)) : false
  const canSubmit = ramenId && country && rating && !isLogged

  const toggleTag = (key: string) =>
    setMemoTags(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const submit = async () => {
    if (!canSubmit) return
    if (getLogged().has(Number(ramenId))) { setAlreadyLogged(true); return }
    setSubmitting(true)
    setError(false)
    const res = await fetch('/api/ramen-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ramen_id: Number(ramenId), country, rating,
        memo_tags: memoTags,
        note: note.trim() || null,
      }),
    })
    setSubmitting(false)
    if (res.ok) { addLogged(Number(ramenId)); setDone(true) }
    else setError(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="text-5xl mb-4">🍜</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{L.done}</h2>
          <p className="text-sm text-gray-500 mb-8">{L.doneMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-lg mx-auto flex gap-2">
          <button onClick={() => setTab('log')}
            className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors
              ${tab === 'log' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {L.tabLog}
          </button>
          <button onClick={() => setTab('stats')}
            className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors
              ${tab === 'stats' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {L.tabStats}
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-20 space-y-6">
        {tab === 'stats' && <StatsTab lang={lang} />}

        {tab === 'log' && (
          <>
            {/* Q1: 라면 선택 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{L.q1}</p>
              <select value={ramenId} onChange={e => { setRamenId(e.target.value); setAlreadyLogged(false) }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                <option value="">—</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{getRamenField(item, 'name', lang)}</option>
                ))}
              </select>
              {(alreadyLogged || isLogged) && (
                <p className="text-xs text-orange-500 mt-1.5">{L.alreadyLogged}</p>
              )}
            </div>

            {/* Q2: 국가 선택 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{L.q2}</p>
              <div className="grid grid-cols-4 gap-2">
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => setCountry(c.code)}
                    className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-medium transition-all
                      ${country === c.code ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'}`}>
                    <span className="text-2xl mb-0.5">{c.flag}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: 만족도 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{L.q3}</p>
              <div className="flex gap-3">
                {RATINGS.map(r => (
                  <button key={r.value} onClick={() => setRating(r.value)}
                    className={`flex-1 py-3 rounded-xl border text-3xl transition-all
                      ${rating === r.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'}`}>
                    {r.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: 비망록 태그 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{L.qMemo}</p>
              <div className="flex flex-wrap gap-2">
                {MEMO_TAGS[lang].map(tag => (
                  <button key={tag.key} onClick={() => toggleTag(tag.key)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all
                      ${memoTags.includes(tag.key) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'}`}>
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q5: 하고 싶은 말 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{L.qNote}</p>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder={L.notePlaceholder} rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white resize-none leading-relaxed" />
            </div>

            {/* 제출 */}
            <div className="space-y-2 pt-2">
              {error && <p className="text-xs text-red-500 text-center">{L.error}</p>}
              <button onClick={submit} disabled={!canSubmit || submitting}
                className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? '...' : L.submit}
              </button>
              <p className="text-xs text-gray-400 text-center leading-relaxed px-2">{L.privacy}</p>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
