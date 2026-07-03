'use client'
// 나라별 인기 라면 관리 — 관리자 페이지 서브 컴포넌트

import { useState, useEffect } from 'react'
import type { Lang } from '@/lib/types'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

export type CountryPick = {
  id: number
  country_code: string
  flag: string
  country_ko: string
  country_en: string | null
  country_zh: string | null
  country_ja: string | null
  rank_num: number
  name_ko: string
  name_en: string | null
  name_zh: string | null
  name_ja: string | null
  score: number | null
  popularity: string | null
  reason_ko: string | null
  reason_en: string | null
  reason_zh: string | null
  reason_ja: string | null
  source_ko: string | null
  source_en: string | null
  source_zh: string | null
  source_ja: string | null
  source_url: string | null
}

type FormState = Omit<CountryPick, 'id'> & { id?: number }

const emptyForm = (): FormState => ({
  country_code: 'jp',
  flag: '🇯🇵',
  country_ko: '일본', country_en: 'Japan', country_zh: '日本', country_ja: '日本',
  rank_num: 1,
  name_ko: '', name_en: '', name_zh: '', name_ja: '',
  score: null,
  popularity: null,
  reason_ko: '', reason_en: '', reason_zh: '', reason_ja: '',
  source_ko: '', source_en: '', source_zh: '', source_ja: '',
  source_url: '',
})

export default function CountryPicksAdmin() {
  const [picks, setPicks] = useState<CountryPick[]>([])
  const [form, setForm] = useState<FormState | null>(null)
  const [lang, setLang] = useState<Lang>('ko')
  const [saving, setSaving] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string>('all')

  const load = async () => {
    const data = await fetch('/api/admin/country-picks').then(r => r.json())
    setPicks(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const countries = Array.from(new Set(picks.map(p => p.country_code)))
    .map(code => picks.find(p => p.country_code === code)!)

  const filtered = filterCountry === 'all' ? picks : picks.filter(p => p.country_code === filterCountry)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => f ? { ...f, [key]: value } : f)

  const save = async () => {
    if (!form) return
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/country-picks', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { await load(); setForm(null) }
    else { const err = await res.json(); alert('저장 실패: ' + err.error) }
    setSaving(false)
  }

  const deletePick = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/country-picks?id=${id}`, { method: 'DELETE' })
    await load()
  }

  const startEdit = (pick: CountryPick) => setForm({
    ...pick,
    country_en: pick.country_en || '', country_zh: pick.country_zh || '', country_ja: pick.country_ja || '',
    name_en: pick.name_en || '', name_zh: pick.name_zh || '', name_ja: pick.name_ja || '',
    popularity: pick.popularity || '',
    reason_ko: pick.reason_ko || '', reason_en: pick.reason_en || '', reason_zh: pick.reason_zh || '', reason_ja: pick.reason_ja || '',
    source_ko: pick.source_ko || '', source_en: pick.source_en || '', source_zh: pick.source_zh || '', source_ja: pick.source_ja || '',
    source_url: pick.source_url || '',
  })

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">나라별 인기 라면</p>
        <button onClick={() => setForm(emptyForm())}
          className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
          + 새 항목
        </button>
      </div>

      {/* 나라 필터 */}
      {!form && countries.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={() => setFilterCountry('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
              ${filterCountry === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            전체
          </button>
          {countries.map(c => (
            <button key={c.country_code} onClick={() => setFilterCountry(c.country_code)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                ${filterCountry === c.country_code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {c.flag} {c.country_ko}
            </button>
          ))}
        </div>
      )}

      {/* 목록 */}
      {!form && (
        filtered.length === 0
          ? <p className="text-center text-gray-400 py-8 text-sm">항목이 없습니다.</p>
          : <div className="space-y-2">
              {filtered.map(pick => (
                <div key={pick.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-800">
                    {pick.flag} {pick.rank_num}위. {pick.name_ko}
                    {pick.score != null && <span className="text-xs text-gray-400 ml-1">({pick.score}점)</span>}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(pick)} className="text-xs text-emerald-600 hover:underline">수정</button>
                    <button onClick={() => deletePick(pick.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* 편집 폼 */}
      {form && (
        <div className="space-y-4 mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">{form.id ? '항목 수정' : '새 항목 추가'}</h2>
            <button onClick={() => setForm(null)} className="text-sm text-gray-400 hover:text-gray-600">✕ 닫기</button>
          </div>

          {/* 나라 정보 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium">국가코드</label>
              <input value={form.country_code} onChange={e => setField('country_code', e.target.value)}
                placeholder="jp"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">국기 이모지</label>
              <input value={form.flag} onChange={e => setField('flag', e.target.value)}
                placeholder="🇯🇵"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">순위</label>
              <input type="number" value={form.rank_num} onChange={e => setField('rank_num', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium">나라 이름 (한국어)</label>
              <input value={form.country_ko} onChange={e => setField('country_ko', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">점수 (있을 경우)</label>
              <input type="number" step="0.1" value={form.score ?? ''} onChange={e => setField('score', e.target.value ? Number(e.target.value) : null)}
                placeholder="81.2"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium">인기도 (점수 없을 때 — 예: 🔥🔥🔥)</label>
            <input value={form.popularity || ''} onChange={e => setField('popularity', e.target.value || null)}
              placeholder="🔥🔥🔥"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium">출처 URL</label>
            <input value={form.source_url || ''} onChange={e => setField('source_url', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
          </div>

          {/* 언어 탭 */}
          <div className="flex gap-2">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                  ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {l.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium">라면 이름</label>
            <input value={(form[`name_${lang}` as keyof FormState] as string) || ''}
              onChange={e => setField(`name_${lang}` as keyof FormState, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium">이유/설명</label>
            <textarea value={(form[`reason_${lang}` as keyof FormState] as string) || ''}
              onChange={e => setField(`reason_${lang}` as keyof FormState, e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium">출처 이름</label>
            <input value={(form[`source_${lang}` as keyof FormState] as string) || ''}
              onChange={e => setField(`source_${lang}` as keyof FormState, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
              {saving ? '저장 중...' : '저장'}
            </button>
            <button onClick={() => setForm(null)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
