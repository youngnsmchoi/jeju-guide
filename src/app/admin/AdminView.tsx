'use client'
// 관리자 페이지 — 로그인, 카테고리 선택, 항목 목록

import { useState, useEffect } from 'react'
import type { Category, Item, Block, Lang } from '@/lib/types'
import RamenAdmin from './RamenAdmin'
import RamenLogAdmin from './RamenLogAdmin'
import Best5Admin from './Best5Admin'
import ToppingsAdmin from './ToppingsAdmin'
import CountryPicksAdmin from './CountryPicksAdmin'
import ItemEditForm, { type ItemFormState } from './ItemEditForm'

const emptyForm = (categoryId: number): ItemFormState => ({
  category_id: categoryId,
  slug: '',
  order_num: 1,
  title_ko: '', title_en: '', title_zh: '', title_ja: '',
  content_ko: '', content_en: '', content_zh: '', content_ja: '',
  image_url: '', video_url: '', map_keyword: '',
  blocks: [],
})

type Tab = 'ramen' | 'log' | 'best5' | 'toppings' | 'countryPicks' | null

export default function AdminView({ categories }: { categories: Category[] }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>(null)
  const [form, setForm] = useState<ItemFormState | null>(null)
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
    fetch('/api/admin/ramen-log').then(res => {
      if (res.status !== 401) setAuthed(true)
    })
  }, [])

  const loadItems = async (cat: Category) => {
    setActiveTab(null)
    setSelectedCat(cat)
    setForm(null)
    const data = await fetch(`/api/items?category_id=${cat.id}`).then(r => r.json())
    setItems(Array.isArray(data) ? data : [])
  }

  const selectTab = (tab: Tab) => {
    setActiveTab(tab)
    setSelectedCat(null)
    setForm(null)
  }

  const startNew = () => setForm(emptyForm(selectedCat!.id))

  const startEdit = (item: Item) => setForm({
    ...item,
    title_en: item.title_en || '', title_zh: item.title_zh || '', title_ja: item.title_ja || '',
    content_ko: item.content_ko || '', content_en: item.content_en || '',
    content_zh: item.content_zh || '', content_ja: item.content_ja || '',
    image_url: item.image_url || '', video_url: item.video_url || '',
    map_keyword: item.map_keyword || '',
    blocks: item.blocks || [],
  } as ItemFormState)

  const save = async () => {
    if (!form) return
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadItems(selectedCat!); setForm(null) }
    else { const err = await res.json(); alert('저장 실패: ' + err.error) }
    setSaving(false)
  }

  const deleteItem = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/items?id=${id}`, { method: 'DELETE' })
    await loadItems(selectedCat!)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-center text-emerald-700 mb-6">관리자 로그인</h1>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()} placeholder="비밀번호"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-emerald-500" />
          {pwError && <p className="text-red-500 text-xs mb-3">비밀번호가 틀렸습니다.</p>}
          <button onClick={login}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            로그인
          </button>
        </div>
      </div>
    )
  }

  const TAB_BTNS: { tab: Tab; label: string }[] = [
    { tab: 'ramen',        label: '🍜 라면 관리' },
    { tab: 'log',          label: '📋 Ramen Log' },
    { tab: 'best5',        label: '🏆 Best 5' },
    { tab: 'toppings',     label: '🍳 꿀조합' },
    { tab: 'countryPicks', label: '🌏 나라별 픽' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">K-Ramen 관리자</h1>
        <button onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); setAuthed(false) }}
          className="text-sm px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-800 transition-colors">
          로그아웃
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 카테고리 + 탭 선택 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 font-medium mb-3">카테고리</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => loadItems(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${selectedCat?.id === cat.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cat.icon} {cat.title_ko}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium mt-3 mb-2">관리 메뉴</p>
          <div className="flex flex-wrap gap-2">
            {TAB_BTNS.map(({ tab, label }) => (
              <button key={tab} onClick={() => selectTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'ramen'        && <RamenAdmin />}
        {activeTab === 'log'          && <RamenLogAdmin />}
        {activeTab === 'best5'        && <Best5Admin />}
        {activeTab === 'toppings'     && <ToppingsAdmin />}
        {activeTab === 'countryPicks' && <CountryPicksAdmin />}

        {/* 카테고리 항목 목록 */}
        {selectedCat && !form && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-medium">{selectedCat.title_ko} 항목</p>
              <button onClick={startNew}
                className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
                + 새 항목
              </button>
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
          <ItemEditForm
            form={form}
            onChange={setForm}
            onSave={save}
            onCancel={() => setForm(null)}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}
