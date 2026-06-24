'use client'
// 관리자 페이지 — 로그인, 항목 목록, 추가/수정/삭제

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Category, Item } from '@/lib/types'

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false })

const LANGS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
] as const

type LangCode = 'ko' | 'en' | 'zh' | 'ja'

interface FormState {
  id?: number
  category_id: number
  slug: string
  order_num: number
  title_ko: string; title_en: string; title_zh: string; title_ja: string
  content_ko: string; content_en: string; content_zh: string; content_ja: string
  image_url: string
  video_url: string
  map_keyword: string
}

const emptyForm = (categoryId: number): FormState => ({
  category_id: categoryId,
  slug: '',
  order_num: 1,
  title_ko: '', title_en: '', title_zh: '', title_ja: '',
  content_ko: '', content_en: '', content_zh: '', content_ja: '',
  image_url: '', video_url: '', map_keyword: '',
})

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [activeLang, setActiveLang] = useState<LangCode>('ko')
  const [saving, setSaving] = useState(false)

  const login = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) { setAuthed(true); setPwError(false) }
    else setPwError(true)
  }

  useEffect(() => {
    if (!authed) return
    fetch('/api/categories').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCategories(data)
    })
  }, [authed])

  const loadItems = async (cat: Category) => {
    setSelectedCat(cat)
    setForm(null)
    const data = await fetch(`/api/items?category_id=${cat.id}`).then(r => r.json())
    setItems(Array.isArray(data) ? data : [])
  }

  const startNew = () => setForm(emptyForm(selectedCat!.id))
  const startEdit = (item: Item) => setForm({ ...item } as FormState)

  const setField = (key: keyof FormState, value: string | number) =>
    setForm(f => f ? { ...f, [key]: value } : f)

  const save = async () => {
    if (!form) return
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await loadItems(selectedCat!)
      setForm(null)
    } else {
      const err = await res.json()
      alert('저장 실패: ' + err.error)
    }
    setSaving(false)
  }

  const deleteItem = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/items?id=${id}`, { method: 'DELETE' })
    await loadItems(selectedCat!)
  }

  // 로그인 화면
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-center text-emerald-700 mb-6">관리자 로그인</h1>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="비밀번호"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-emerald-500"
          />
          {pwError && <p className="text-red-500 text-xs mb-3">비밀번호가 틀렸습니다.</p>}
          <button
            onClick={login}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >로그인</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white px-6 py-4">
        <h1 className="text-lg font-bold">제주 가이드 관리자</h1>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 카테고리 선택 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-medium mb-3">카테고리 선택</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => loadItems(cat)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${selectedCat?.id === cat.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {cat.icon} {cat.title_ko}
              </button>
            ))}
          </div>
        </div>

        {/* 항목 목록 */}
        {selectedCat && !form && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-medium">{selectedCat.title_ko} 항목</p>
              <button
                onClick={startNew}
                className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
              >+ 새 항목</button>
            </div>
            {items.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">항목이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-800">{item.title_ko}</span>
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
              <h2 className="font-bold text-gray-800">{form.id ? '항목 수정' : '새 항목 추가'}</h2>
              <button onClick={() => setForm(null)} className="text-sm text-gray-400 hover:text-gray-600">✕ 닫기</button>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-medium">슬러그 (영문, 하이픈)</label>
                <input
                  value={form.slug}
                  onChange={e => setField('slug', e.target.value)}
                  placeholder="convenience-store-1plus1"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium">순서</label>
                <input
                  type="number"
                  value={form.order_num}
                  onChange={e => setField('order_num', Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 언어 탭 */}
            <div>
              <div className="flex gap-2 mb-3">
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

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium">제목</label>
                  <input
                    value={form[`title_${activeLang}`]}
                    onChange={e => setField(`title_${activeLang}`, e.target.value)}
                    placeholder={`제목 (${activeLang})`}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">내용</label>
                  <div className="mt-1">
                    <RichEditor
                      value={form[`content_${activeLang}`]}
                      onChange={html => setField(`content_${activeLang}`, html)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 지도/이미지/동영상 */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 font-medium">지도 검색 키워드</label>
                <input
                  value={form.map_keyword}
                  onChange={e => setField('map_keyword', e.target.value)}
                  placeholder="편의점"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium">대표 이미지 URL (선택)</label>
                <input
                  value={form.image_url}
                  onChange={e => setField('image_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium">YouTube URL (선택)</label>
                <input
                  value={form.video_url}
                  onChange={e => setField('video_url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>
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
    </div>
  )
}
