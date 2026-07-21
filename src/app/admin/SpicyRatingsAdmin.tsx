'use client'
// 라면 맵기 평가(크라우드소싱) 관리 — 숨김·삭제

import { useEffect, useState } from 'react'

type SpicyRating = {
  id: number
  ramen_id: number
  country: string
  spicy_level: number
  hidden: boolean
  created_at: string
}

export default function SpicyRatingsAdmin() {
  const [items, setItems] = useState<SpicyRating[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hidden'>('all')

  const load = () => {
    setLoading(true)
    fetch('/api/admin/link-ramen-spicy')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleHidden = async (id: number, current: boolean) => {
    await fetch('/api/admin/link-ramen-spicy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hidden: !current }),
    })
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('이 평가를 완전히 삭제할까요?')) return
    await fetch(`/api/admin/link-ramen-spicy?id=${id}`, { method: 'DELETE' })
    load()
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.hidden)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-gray-800">맵기 평가 관리</p>
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

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
        ℹ️ 이용자는 같은 라면에 24시간 내 1회만 평가할 수 있습니다 (IP 주소를 해시로 변환해 중복을 판단하며, 실제 IP는 저장하지 않습니다). 나라별 평균은 평가가 5건 이상 쌓여야 화면에 표시됩니다.
      </div>

      {loading && <p className="text-center text-gray-400 py-8 text-sm">로딩 중...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">항목이 없습니다.</p>
      )}

      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id}
            className={`bg-white rounded-xl border p-3 flex items-center justify-between gap-3 ${item.hidden ? 'opacity-50' : ''}`}>
            <div className="text-sm text-gray-700">
              <span className="font-bold">라면 #{item.ramen_id}</span>
              {' · '}{item.country}{' · '}맵기 {item.spicy_level}단계
              <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString('ko-KR')}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleHidden(item.id, item.hidden)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                  ${item.hidden ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {item.hidden ? '👁 표시' : '🙈 숨김'}
              </button>
              <button onClick={() => remove(item.id)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                🗑 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
