'use client'
// 피드백 관리 — 숨김·반영 토글

import { useEffect, useState } from 'react'

type FeedbackItem = {
  id: number
  category: string
  title: string
  body: string
  nickname: string | null
  country: string | null
  likes: number
  hidden: boolean
  status: 'open' | 'in_progress' | 'done'
  answer: string | null
  created_at: string
}

const CATEGORIES: Record<string, string> = {
  ask: '🔍 정보 문의',
  bug: '🐛 오류 신고',
  feature: '🆕 기능 추가',
  ui: '🎨 화면 개선',
  other: '💡 기타 의견',
}

const STATUSES: { value: FeedbackItem['status']; label: string; badgeClass: string }[] = [
  { value: 'open', label: '접수', badgeClass: 'bg-gray-100 text-gray-600' },
  { value: 'in_progress', label: '진행', badgeClass: 'bg-amber-100 text-amber-700' },
  { value: 'done', label: '완료', badgeClass: 'bg-emerald-100 text-emerald-700' },
]

export default function FeedbackAdmin() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hidden'>('all')

  const load = () => {
    setLoading(true)
    fetch('/api/admin/feedback')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleHidden = async (id: number, current: boolean) => {
    await fetch('/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hidden: !current }),
    })
    load()
  }

  const setStatus = async (id: number, status: FeedbackItem['status']) => {
    await fetch('/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  const saveAnswer = async (id: number, answer: string) => {
    await fetch('/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, answer }),
    })
    load()
  }

  const filtered = filter === 'all' ? items : items.filter(f => f.hidden)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-gray-800">피드백 관리</p>
        <div className="flex gap-2">
          {(['all', 'hidden'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                ${filter === f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f === 'all' ? `전체 (${items.length})` : `숨김 (${items.filter(i => i.hidden).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-gray-400 py-8 text-sm">로딩 중...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">항목이 없습니다.</p>
      )}

      {filtered.map(item => (
        <FeedbackCard key={item.id} item={item}
          onToggleHidden={() => toggleHidden(item.id, item.hidden)}
          onSetStatus={status => setStatus(item.id, status)}
          onSaveAnswer={answer => saveAnswer(item.id, answer)} />
      ))}
    </div>
  )
}

function FeedbackCard({ item, onToggleHidden, onSetStatus, onSaveAnswer }: {
  item: FeedbackItem
  onToggleHidden: () => void
  onSetStatus: (status: FeedbackItem['status']) => void
  onSaveAnswer: (answer: string) => void
}) {
  const [answerDraft, setAnswerDraft] = useState(item.answer ?? '')

  return (
    <div className={`bg-white rounded-2xl border p-4 space-y-3 ${item.hidden ? 'border-gray-200 opacity-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {CATEGORIES[item.category] ?? item.category}
            </span>
            {(() => {
              const s = STATUSES.find(s => s.value === item.status)
              return s && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.badgeClass}`}>{s.label}</span>
              )
            })()}
            {item.hidden && (
              <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">숨김</span>
            )}
            <span className="text-xs text-gray-400">❤️ {item.likes}</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{item.title}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {item.country && `${item.country} · `}{item.nickname ?? '익명'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={onToggleHidden}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
            ${item.hidden
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          {item.hidden ? '👁 표시하기' : '🙈 숨기기'}
        </button>
        {STATUSES.map(s => (
          <button key={s.value} onClick={() => onSetStatus(s.value)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
              ${item.status === s.value
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s.label}로 변경
          </button>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <label className="text-xs font-bold text-gray-700 block">💬 답변 (이용자에게 표시됨)</label>
        <textarea value={answerDraft} onChange={e => setAnswerDraft(e.target.value)}
          placeholder="이용자에게 보여줄 답변을 입력하세요." rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 resize-none" />
        <button onClick={() => onSaveAnswer(answerDraft)}
          disabled={answerDraft === (item.answer ?? '')}
          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          답변 저장
        </button>
      </div>
    </div>
  )
}
