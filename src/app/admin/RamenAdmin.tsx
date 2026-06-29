'use client'
// 라면 가이드 항목(ramen_items) 관리 — 목록, 추가/수정/삭제

import { useState, useEffect, useRef } from 'react'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'

const LANGS = [
  { code: 'ko' as Lang, label: '한국어' },
  { code: 'en' as Lang, label: 'English' },
  { code: 'zh' as Lang, label: '中文' },
  { code: 'ja' as Lang, label: '日本語' },
]

const TEXT_FIELDS = [
  { key: 'name' as const, label: '라면 이름' },
  { key: 'flavor_desc' as const, label: '맛' },
  { key: 'comparison' as const, label: '비슷한 맛' },
  { key: 'popularity' as const, label: '인기 국가' },
  { key: 'texture' as const, label: '식감 특징' },
]

type FormState = Omit<RamenItem, 'id'> & { id?: number }

const emptyForm = (orderNum: number): FormState => ({
  order_num: orderNum,
  name_ko: '', name_en: '', name_zh: '', name_ja: '',
  image_url: '',
  flavor_desc_ko: '', flavor_desc_en: '', flavor_desc_zh: '', flavor_desc_ja: '',
  comparison_ko: '', comparison_en: '', comparison_zh: '', comparison_ja: '',
  popularity_ko: '', popularity_en: '', popularity_zh: '', popularity_ja: '',
  texture_ko: '', texture_en: '', texture_zh: '', texture_ja: '',
  prep_time: null,
  spicy_level: null,
})

export default function RamenAdmin() {
  const [items, setItems] = useState<RamenItem[]>([])
  const [form, setForm] = useState<FormState | null>(null)
  const [activeLang, setActiveLang] = useState<Lang>('ko')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const imageFileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const data = await fetch('/api/admin/ramen').then(r => r.json())
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const startNew = () => setForm(emptyForm(items.length + 1))
  const startEdit = (item: RamenItem) => setForm({ ...item })

  const setField = (key: keyof FormState, value: string | number | null) =>
    setForm(f => f ? { ...f, [key]: value } : f)

  const uploadImage = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const { url, error } = await res.json()
    setUploading(false)
    if (error) { alert('업로드 실패: ' + error); return }
    setField('image_url', url)
  }

  const save = async () => {
    if (!form) return
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/ramen', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await load()
      setForm(null)
    } else {
      const err = await res.json()
      alert('저장 실패: ' + err.error)
    }
    setSaving(false)
  }

  const deleteItem = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/ramen?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="space-y-4">
      {/* 라면 목록 */}
      {!form && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 font-medium">라면 목록</p>
            <button
              onClick={startNew}
              className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
            >+ 새 라면</button>
          </div>
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">등록된 라면이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-800">{getRamenField(item, 'name', 'ko')}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="text-xs text-emerald-600 hover:underline">수정</button>
                    <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 편집 폼 */}
      {form && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">{form.id ? '라면 수정' : '새 라면 추가'}</h2>
            <button onClick={() => setForm(null)} className="text-sm text-gray-400 hover:text-gray-600">✕ 닫기</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium">순서</label>
              <input
                type="number"
                value={form.order_num}
                onChange={e => setField('order_num', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">권장 조리 시간 (분)</label>
              <input
                type="number"
                value={form.prep_time ?? ''}
                onChange={e => setField('prep_time', e.target.value === '' ? null : Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">맵기 단계 (0~5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={form.spicy_level ?? ''}
                onChange={e => setField('spicy_level', e.target.value === '' ? null : Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 언어 탭 */}
          <div className="flex gap-2">
            {LANGS.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setActiveLang(l.code)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                  ${activeLang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >{l.label}</button>
            ))}
          </div>

          {TEXT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 font-medium">{label} ({activeLang})</label>
              <input
                value={form[`${key}_${activeLang}`] ?? ''}
                onChange={e => setField(`${key}_${activeLang}`, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
          ))}

          {/* 이미지 */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="text-xs text-gray-400">대표 이미지 URL</label>
            <div className="flex gap-2">
              <input
                value={form.image_url ?? ''}
                onChange={e => setField('image_url', e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => imageFileRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 disabled:opacity-50"
              >{uploading ? '업로드 중...' : '업로드'}</button>
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="" className="mt-2 h-24 rounded-lg object-cover" />
            )}
            <input
              ref={imageFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) uploadImage(file)
                e.target.value = ''
              }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >{saving ? '저장 중...' : '저장'}</button>
            <button
              onClick={() => setForm(null)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >취소</button>
          </div>
        </div>
      )}
    </div>
  )
}
