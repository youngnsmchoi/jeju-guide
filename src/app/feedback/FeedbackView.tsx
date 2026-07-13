'use client'
// 피드백 게시판 — 제출 + 목록 + 좋아요

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

type FeedbackItem = {
  id: number
  category: string
  title: string
  body: string
  nickname: string | null
  country: string | null
  likes: number
  implemented: boolean
  created_at: string
}

const CATEGORIES = [
  { value: 'feature', emoji: '🆕', label: { ko: '기능 추가', en: 'Add a Feature', zh: '新增功能', ja: '機能追加' } },
  { value: 'bug',     emoji: '🐛', label: { ko: '오류 신고', en: 'Report a Bug',  zh: '错误报告', ja: 'バグ報告' } },
  { value: 'ui',      emoji: '🎨', label: { ko: '화면 개선', en: 'Improve UI',    zh: '界面改进', ja: 'UI改善' } },
  { value: 'other',   emoji: '💡', label: { ko: '기타 의견', en: 'Other Ideas',   zh: '其他想法', ja: 'その他' } },
]

const LABEL: Record<Lang, {
  pageTitle: string
  pageDesc: string
  newBtn: string
  filterAll: string
  empty: string
  anonymous: string
  likeBtn: string
  implemented: string
  formTitle: string
  categoryLabel: string
  titleLabel: string
  titlePlaceholder: string
  bodyLabel: string
  bodyPlaceholder: string
  nicknameLabel: string
  nicknamePlaceholder: string
  countryLabel: string
  countryPlaceholder: string
  submit: string
  submitting: string
  doneTitle: string
  doneMsg: string
  backToList: string
}> = {
  ko: {
    pageTitle: 'Help Us Shape K-Ramen Picks',
    pageDesc: '불편한 점, 원하는 기능, 아이디어를 자유롭게 남겨주세요.',
    newBtn: '✏️ 의견 남기기',
    filterAll: '전체',
    empty: '아직 의견이 없어요. 첫 번째로 남겨보세요!',
    anonymous: '익명',
    likeBtn: '좋아요',
    implemented: '✅ 반영됨',
    formTitle: '의견 남기기',
    categoryLabel: '카테고리 *',
    titleLabel: '제목 *',
    titlePlaceholder: '예) 라면 필터에 컵/봉지 구분 추가해주세요',
    bodyLabel: '내용 *',
    bodyPlaceholder: '자세히 설명해주세요.',
    nicknameLabel: '닉네임 (선택)',
    nicknamePlaceholder: '미입력 시 익명',
    countryLabel: '국가 (선택)',
    countryPlaceholder: '예) Japan, USA...',
    submit: '제출하기',
    submitting: '제출 중...',
    doneTitle: '감사합니다!',
    doneMsg: '소중한 의견을 받았습니다. 더 나은 서비스를 위해 검토하겠습니다.',
    backToList: '목록으로 돌아가기',
  },
  en: {
    pageTitle: 'Help Us Shape K-Ramen Picks',
    pageDesc: 'Share your ideas, report issues, or suggest improvements.',
    newBtn: '✏️ Share your idea',
    filterAll: 'All',
    empty: 'No feedback yet. Be the first!',
    anonymous: 'Anonymous',
    likeBtn: 'Like',
    implemented: '✅ Implemented',
    formTitle: 'Share Your Idea',
    categoryLabel: 'Category *',
    titleLabel: 'Title *',
    titlePlaceholder: 'e.g. Add cup/bag filter to ramen list',
    bodyLabel: 'Details *',
    bodyPlaceholder: 'Please describe in detail.',
    nicknameLabel: 'Nickname (optional)',
    nicknamePlaceholder: 'Anonymous if blank',
    countryLabel: 'Country (optional)',
    countryPlaceholder: 'e.g. Japan, USA...',
    submit: 'Submit',
    submitting: 'Submitting...',
    doneTitle: 'Thank you!',
    doneMsg: 'We received your valuable feedback and will review it carefully.',
    backToList: 'Back to list',
  },
  zh: {
    pageTitle: 'Help Us Shape K-Ramen Picks',
    pageDesc: '请分享您的想法、报告问题或提出改进建议。',
    newBtn: '✏️ 提交意见',
    filterAll: '全部',
    empty: '还没有反馈，来第一个分享吧！',
    anonymous: '匿名',
    likeBtn: '点赞',
    implemented: '✅ 已采纳',
    formTitle: '提交意见',
    categoryLabel: '类别 *',
    titleLabel: '标题 *',
    titlePlaceholder: '例如：请在拉面列表中添加杯/袋筛选',
    bodyLabel: '详情 *',
    bodyPlaceholder: '请详细描述。',
    nicknameLabel: '昵称（可选）',
    nicknamePlaceholder: '不填则显示匿名',
    countryLabel: '国家（可选）',
    countryPlaceholder: '例如：Japan, USA...',
    submit: '提交',
    submitting: '提交中...',
    doneTitle: '感谢您！',
    doneMsg: '我们收到了您的宝贵意见，将认真审查。',
    backToList: '返回列表',
  },
  ja: {
    pageTitle: 'Help Us Shape K-Ramen Picks',
    pageDesc: 'アイデア、不具合報告、改善提案などをお気軽にどうぞ。',
    newBtn: '✏️ 意見を送る',
    filterAll: 'すべて',
    empty: 'まだ意見がありません。最初に投稿しましょう！',
    anonymous: '匿名',
    likeBtn: 'いいね',
    implemented: '✅ 反映済み',
    formTitle: '意見を送る',
    categoryLabel: 'カテゴリ *',
    titleLabel: 'タイトル *',
    titlePlaceholder: '例）ラーメンリストにカップ/袋フィルターを追加して',
    bodyLabel: '詳細 *',
    bodyPlaceholder: '詳しく教えてください。',
    nicknameLabel: 'ニックネーム（任意）',
    nicknamePlaceholder: '未入力は匿名',
    countryLabel: '国（任意）',
    countryPlaceholder: '例）Japan, USA...',
    submit: '送信',
    submitting: '送信中...',
    doneTitle: 'ありがとうございます！',
    doneMsg: '貴重なご意見をいただきました。しっかり確認いたします。',
    backToList: 'リストに戻る',
  },
}

const LIKED_KEY = 'liked_feedback'

function getLiked(): Set<number> {
  try {
    const raw = localStorage.getItem(LIKED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function saveLiked(set: Set<number>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]))
}

type View = 'list' | 'form' | 'done'

export default function FeedbackView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  const [view, setView] = useState<View>('list')
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [nickname, setNickname] = useState('')
  const [country, setCountry] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLiked(getLiked())
    fetch('/api/feedback')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const handleLike = async (id: number) => {
    if (liked.has(id)) return
    const newLiked = new Set(liked)
    newLiked.add(id)
    setLiked(newLiked)
    saveLiked(newLiked)
    setItems(prev => prev.map(f => f.id === id ? { ...f, likes: f.likes + 1 } : f))
    await fetch('/api/feedback/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  const handleSubmit = async () => {
    if (!category || !title.trim() || !body.trim()) return
    setSubmitting(true)
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, title: title.trim(), body: body.trim(), nickname: nickname.trim() || null, country: country.trim() || null }),
    })
    setSubmitting(false)
    setView('done')
  }

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const catOf = (value: string) => CATEGORIES.find(c => c.value === value)
  const filtered = filter === 'all' ? items : items.filter(f => f.category === filter)

  if (view === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-4">
          <p className="text-4xl">🎉</p>
          <p className="text-lg font-bold text-gray-900">{L.doneTitle}</p>
          <p className="text-sm text-gray-500 text-center leading-relaxed max-w-xs">{L.doneMsg}</p>
          <button onClick={() => { setView('list'); setCategory(''); setTitle(''); setBody(''); setNickname(''); setCountry('') }}
            className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
            {L.backToList}
          </button>
        </main>
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
          <button onClick={() => setView('list')} className="text-sm text-gray-400 hover:text-gray-600">← {L.backToList}</button>
          <p className="text-base font-bold text-gray-900">{L.formTitle}</p>

          {/* 카테고리 */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-2 block">{L.categoryLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-left
                    ${category === c.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}>
                  <span>{c.emoji}</span>
                  <span>{c.label[lang]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">{L.titleLabel}</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder={L.titlePlaceholder}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
          </div>

          {/* 내용 */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">{L.bodyLabel}</label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              placeholder={L.bodyPlaceholder} rows={4}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 resize-none" />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">{L.nicknameLabel}</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)}
              placeholder={L.nicknamePlaceholder}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
          </div>

          {/* 국가 */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">{L.countryLabel}</label>
            <input value={country} onChange={e => setCountry(e.target.value)}
              placeholder={L.countryPlaceholder}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
          </div>

          <button onClick={handleSubmit}
            disabled={!category || !title.trim() || !body.trim() || submitting}
            className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? L.submitting : L.submit}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {/* 헤더 */}
        <div className="space-y-1">
          <p className="text-base font-bold text-gray-900">{L.pageTitle}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{L.pageDesc}</p>
        </div>

        {/* 의견 남기기 버튼 */}
        <button onClick={() => setView('form')}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
          {L.newBtn}
        </button>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setFilter('all')}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors
              ${filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {L.filterAll}
          </button>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setFilter(c.value)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                ${filter === c.value ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {c.emoji} {c.label[lang]}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {loading && <p className="text-center text-gray-400 py-10 text-sm">...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">{L.empty}</p>
        )}

        {filtered.map(item => {
          const cat = catOf(item.category)
          const hasLiked = liked.has(item.id)
          const isExpanded = expanded.has(item.id)

          return (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* 헤더 */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {cat && (
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {cat.emoji} {cat.label[lang]}
                        </span>
                      )}
                      {item.implemented && (
                        <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          {L.implemented}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  </div>
                  <button onClick={() => handleLike(item.id)}
                    className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                      ${hasLiked
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'}`}>
                    ❤️ {item.likes > 0 ? item.likes : L.likeBtn}
                  </button>
                </div>
              </div>

              {/* 내용 — 펼치기/접기 */}
              <div className="border-t border-gray-50">
                <button onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <span className="truncate text-left pr-2">{isExpanded ? '' : item.body.slice(0, 50) + (item.body.length > 50 ? '...' : '')}</span>
                  <span className="shrink-0 text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{item.body}</p>
                  </div>
                )}
              </div>

              {/* 작성자 */}
              <div className="px-4 pb-3 flex items-center gap-1 text-xs text-gray-400">
                {item.country && <span>{item.country}</span>}
                {item.country && <span>·</span>}
                <span>{item.nickname || L.anonymous}</span>
              </div>
            </div>
          )
        })}
      </main>

    </div>
  )
}
