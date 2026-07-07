'use client'
// Ramen Log 관리 — 통계 요약 + 상세 로그 목록 + 2단계 프로필 예고

import { useState, useEffect } from 'react'

interface LogEntry {
  id: number
  ramen_id: number
  country: string
  rating: 'good' | 'neutral' | 'bad'
  memo_tags: string[] | null
  note: string | null
  created_at: string
  ramen_items: { name_ko: string } | null
}

interface Stats {
  name_ko: string
  good: number
  neutral: number
  bad: number
  total: number
  tags: Record<string, number>
}

const FLAG: Record<string, string> = {
  china: '🇨🇳', japan: '🇯🇵', taiwan: '🇹🇼', usa: '🇺🇸',
  vietnam: '🇻🇳', thailand: '🇹🇭', philippines: '🇵🇭', other: '🌍',
}

const TAG_LABEL: Record<string, string> = {
  egg: '🥚 계란 추천',
  cheese: '🧀 치즈 추가',
  less_water: '💧 물 적게',
  spicy: '🌶️ 매워요',
  rice: '🍚 밥이랑',
  water: '😅 물 필요',
}

export default function RamenLogAdmin() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/ramen-log')
    const data = await res.json()
    setLogs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const deleteLog = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/ramen-log?id=${id}`, { method: 'DELETE' })
    await load()
  }

  useEffect(() => { load() }, [])

  // 라면별 통계 집계
  const stats = logs.reduce<Record<number, Stats>>((acc, log) => {
    if (!acc[log.ramen_id]) {
      acc[log.ramen_id] = { name_ko: log.ramen_items?.name_ko ?? '알 수 없음', good: 0, neutral: 0, bad: 0, total: 0, tags: {} }
    }
    acc[log.ramen_id][log.rating]++
    acc[log.ramen_id].total++
    for (const tag of (log.memo_tags ?? [])) {
      acc[log.ramen_id].tags[tag] = (acc[log.ramen_id].tags[tag] ?? 0) + 1
    }
    return acc
  }, {})

  const statList = Object.values(stats).sort((a, b) => b.total - a.total)

  if (loading) return <p className="text-center text-gray-400 py-10">불러오는 중...</p>

  return (
    <div className="space-y-6">
      {/* 통계 요약 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">라면별 만족도 + 비망록 태그 ({logs.length}건)</p>
        {statList.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">아직 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {statList.map(s => {
              const topTags = Object.entries(s.tags).sort((a, b) => b[1] - a[1])
              return (
                <div key={s.name_ko} className="border border-gray-100 rounded-xl px-3 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{s.name_ko}</span>
                    <div className="flex gap-3 text-sm">
                      <span>😊 {s.good}</span>
                      <span>😐 {s.neutral}</span>
                      <span>😞 {s.bad}</span>
                    </div>
                  </div>
                  {topTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {topTags.map(([key, count]) => (
                        <span key={key} className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-0.5">
                          {TAG_LABEL[key] ?? key} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 상세 로그 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">상세 로그</p>
        {logs.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">아직 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="border border-gray-100 rounded-xl px-3 py-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-800 flex-1">{log.ramen_items?.name_ko ?? '알 수 없음'}</span>
                  <span className="text-sm">{FLAG[log.country] ?? '🌍'} {log.country}</span>
                  <span className="text-sm">{log.rating === 'good' ? '😊' : log.rating === 'neutral' ? '😐' : '😞'}</span>
                  <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleDateString()}</span>
                  <button onClick={() => deleteLog(log.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                </div>
                {log.memo_tags && log.memo_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {log.memo_tags.map(key => (
                      <span key={key} className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                        {TAG_LABEL[key] ?? key}
                      </span>
                    ))}
                  </div>
                )}
                {log.note && (
                  <p className="text-xs text-gray-500 leading-relaxed">"{log.note}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2단계 프로필 — 준비 예고 */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-500 mb-2">2단계 프로필 (준비 중)</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-3">
          아래 항목을 수집하면 더 정밀한 마케팅 데이터로 활용할 수 있습니다.
          준비되면 기록하기 탭에 선택 입력으로 추가할 예정입니다.
        </p>
        <div className="space-y-1.5">
          {[
            { label: '나이대', example: '10대 / 20대 / 30대 / 40대 / 50대+' },
            { label: '성별', example: '남 / 여 / 선택 안 함' },
            { label: '자국에서 좋아하는 라면', example: '직접 입력 (예: 마루짱, 닛신 등)' },
            { label: '한국 라면 중 좋아하는 것', example: '라면 선택 (다중 선택)' },
          ].map(item => (
            <div key={item.label} className="flex gap-2 text-xs">
              <span className="text-gray-500 font-medium w-32 shrink-0">{item.label}</span>
              <span className="text-gray-400">{item.example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
