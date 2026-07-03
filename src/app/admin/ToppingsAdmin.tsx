'use client'
// 꿀조합 커스터마이징 항목 관리 — 관리자 페이지 서브 컴포넌트

import { useState, useEffect } from 'react'
import type { Lang } from '@/lib/types'
import type { ToppingCombo } from '@/app/guide/toppings/ToppingsView'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const ALL_TOPPINGS = ['🥚', '🧀', '🍙'] as const
type Topping = (typeof ALL_TOPPINGS)[number]

type FormState = Omit<ToppingCombo, 'id' | 'toppings'> & { id?: number; toppings: Topping[] }

const emptyForm = (): FormState => ({
  order_num: 1,
  ramen_ko: '', ramen_en: '', ramen_zh: '', ramen_ja: '',
  toppings: [],
  reason_ko: '', reason_en: '', reason_zh: '', reason_ja: '',
  spicy: 0,
})

export default function ToppingsAdmin() {
  const [combos, setCombos] = useState<ToppingCombo[]>([])
  const [form, setForm] = useState<FormState | null>(null)
  const [lang, setLang] = useState<Lang>('ko')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const data = await fetch('/api/admin/toppings').then(r => r.json())
    setCombos(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => f ? { ...f, [key]: value } : f)

  const toggleTopping = (t: Topping) => {
    setForm(f => {
      if (!f) return f
      const has = f.toppings.includes(t)
      return { ...f, toppings: has ? f.toppings.filter(x => x !== t) : [...f.toppings, t] }
    })
  }

  const save = async () => {
    if (!form) return
    setSaving(true)
    const payload = { ...form, toppings: JSON.stringify(form.toppings) }
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/toppings', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { await load(); setForm(null) }
    else { const err = await res.json(); alert('저장 실패: ' + err.error) }
    setSaving(false)
  }

  const deleteCombo = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/toppings?id=${id}`, { method: 'DELETE' })
    await load()
  }

  const startEdit = (combo: ToppingCombo) => {
    let toppings: Topping[] = []
    try { toppings = JSON.parse(combo.toppings) } catch { /* ignore */ }
    setForm({
      ...combo,
      toppings,
      ramen_en: combo.ramen_en || '', ramen_zh: combo.ramen_zh || '', ramen_ja: combo.ramen_ja || '',
      reason_ko: combo.reason_ko || '', reason_en: combo.reason_en || '',
      reason_zh: combo.reason_zh || '', reason_ja: combo.reason_ja || '',
    })
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">꿀조합 항목</p>
        <button
          onClick={() => setForm(emptyForm())}
          className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
        >+ 새 항목</button>
      </div>

      {/* 목록 */}
      {!form && (
        combos.length === 0
          ? <p className="text-center text-gray-400 py-8 text-sm">항목이 없습니다.</p>
          : <div className="space-y-2">
              {combos.map(combo => (
                <div key={combo.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-800">{combo.ramen_ko} ({combo.toppings})</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(combo)} className="text-xs text-emerald-600 hover:underline">수정</button>
                    <button onClick={() => deleteCombo(combo.id)} className="text-xs text-red-400 hover:underline">삭제</button>
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
              <label className="text-xs text-gray-400 font-medium">순서</label>
              <input type="number" value={form.order_num}
                onChange={e => setField('order_num', Number(e.target.value))}
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
            <label className="text-xs text-gray-400 font-medium mb-2 block">토핑</label>
            <div className="flex gap-2">
              {ALL_TOPPINGS.map(t => (
                <button key={t} onClick={() => toggleTopping(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors
                    ${form.toppings.includes(t)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
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
            <input value={(form[`ramen_${lang}` as keyof FormState] as string) || ''}
              onChange={e => setField(`ramen_${lang}` as keyof FormState, e.target.value)}
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
