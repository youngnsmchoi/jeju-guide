'use client'
// Ramen Log 관리 — 통계 요약 + 상세 로그 목록

import { useState, useEffect } from 'react'

interface LogEntry {
  id: number
  ramen_id: number
  country: string
  rating: 'good' | 'neutral' | 'bad'
  created_at: string
  ramen_items: { name_ko: string } | null
}

interface Stats {
  name_ko: string
  good: number
  neutral: number
  bad: number
  total: number
}

const FLAG: Record<string, string> = {
  china: '🇨🇳', japan: '🇯🇵', taiwan: '🇹🇼', usa: '🇺🇸',
  vietnam: '🇻🇳', thailand: '🇹🇭', philippines: '🇵🇭', other: '🌍',
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
      acc[log.ramen_id] = { name_ko: log.ramen_items?.name_ko ?? '알 수 없음', good: 0, neutral: 0, bad: 0, total: 0 }
    }
    acc[log.ramen_id][log.rating]++
    acc[log.ramen_id].total++
    return acc
  }, {})

  const statList = Object.values(stats).sort((a, b) => b.total - a.total)

  if (loading) return <p className="text-center text-gray-400 py-10">불러오는 중...</p>

  return (
    <div className="space-y-6">
      {/* 통계 요약 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">라면별 만족도 통계 ({logs.length}건)</p>
        {statList.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">아직 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {statList.map(s => (
              <div key={s.name_ko} className="flex items-center justify-between border border-gray-100 rounded-xl px-3 py-2.5">
                <span className="text-sm font-medium text-gray-800 flex-1">{s.name_ko}</span>
                <div className="flex gap-3 text-sm">
                  <span>😊 {s.good}</span>
                  <span>😐 {s.neutral}</span>
                  <span>😞 {s.bad}</span>
                </div>
              </div>
            ))}
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
              <div key={log.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-3 py-2.5 gap-2">
                <span className="text-sm text-gray-800 flex-1">{log.ramen_items?.name_ko ?? '알 수 없음'}</span>
                <span className="text-sm">{FLAG[log.country] ?? '🌍'} {log.country}</span>
                <span className="text-sm">{log.rating === 'good' ? '😊' : log.rating === 'neutral' ? '😐' : '😞'}</span>
                <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleDateString()}</span>
                <button onClick={() => deleteLog(log.id)} className="text-xs text-red-400 hover:underline">삭제</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
