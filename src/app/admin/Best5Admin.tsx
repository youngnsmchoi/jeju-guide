'use client'
// Best 5 추천 항목 관리 — 관리자 페이지 서브 컴포넌트

import { useState, useEffect } from 'react'
import type { Lang } from '@/lib/types'
import type { Best5Pick } from '@/app/guide/best5/Best5View'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

type FormState = Omit<Best5Pick, 'id'> & { id?: number }

const emptyForm = (): FormState => ({
  rank_num: 1,
  name_ko: '', name_en: '', name_zh: '', name_ja: '',
  noodle_type: 'bag',
  spicy: 0,
  tag_ko: '', tag_en: '', tag_zh: '', tag_ja: '',
  reason_ko: '', reason_en: '', reason_zh: '', reason_ja: '',
})

export default function Best5Admin() {
  const [picks, setPicks] = useState<Best5Pick[]>([])
  const [form, setForm] = useState<FormState | null>(null)
  const [lang, setLang] = useState<Lang>('ko')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const data = await fetch('/api/admin/best5').then(r => r.json())
    setPicks(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => f ? { ...f, [key]: value } : f)

  const save = async () => {
    if (!form) return
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/best5', {
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
    await fetch(`/api/admin/best5?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">Best 5 항목</p>
        <button
          onClick={() => setForm(emptyForm())}
          className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
        >+ 새 항목</button>
      </div>

      {/* 목록 */}
      {!form && (
        picks.length === 0
          ? <p className="text-center text-gray-400 py-8 text-sm">항목이 없습니다.</p>
          : <div className="space-y-2">
              {picks.map(pick => (
                <div key={pick.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-800">{pick.rank_num}위. {pick.name_ko}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setForm({ ...pick, name_en: pick.name_en || '', name_zh: pick.name_zh || '', name_ja: pick.name_ja || '', tag_ko: pick.tag_ko || '', tag_en: pick.tag_en || '', tag_zh: pick.tag_zh || '', tag_ja: pick.tag_ja || '', reason_ko: pick.reason_ko || '', reason_en: pick.reason_en || '', reason_zh: pick.reason_zh || '', reason_ja: pick.reason_ja || '' })} className="text-xs text-emerald-600 hover:underline">수정</button>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium">순위</label>
              <input type="number" value={form.rank_num}
                onChange={e => setField('rank_num', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">매운 정도 (0~5)</label>
              <input type="number" min={0} max={5} value={form.spicy}
                onChange={e => setField('spicy', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium">면 종류</label>
            <select value={form.noodle_type} onChange={e => setField('noodle_type', e.target.value as 'cup' | 'bag')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500">
              <option value="bag">봉지 (Bag)</option>
              <option value="cup">컵 (Cup)</option>
            </select>
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
            <label className="text-xs text-gray-400 font-medium">태그 (짧은 설명)</label>
            <input value={(form[`tag_${lang}` as keyof FormState] as string) || ''}
              onChange={e => setField(`tag_${lang}` as keyof FormState, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium">추천 이유</label>
            <textarea value={(form[`reason_${lang}` as keyof FormState] as string) || ''}
              onChange={e => setField(`reason_${lang}` as keyof FormState, e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500 resize-none" />
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
