'use client'
// 관리자 페이지 — 사이드바(PC) + 햄버거(모바일) 레이아웃

import { useState, useEffect } from 'react'
import type { Category, Item } from '@/lib/types'
import RamenAdmin from './RamenAdmin'
import JulGimbapAdmin from './JulGimbapAdmin'
import HotbarAdmin from './HotbarAdmin'
import DosirakAdmin from './DosirakAdmin'
import SnacksAdmin from './SnacksAdmin'
import RamenLogAdmin from './RamenLogAdmin'
import Best5Admin from './Best5Admin'
import ToppingsAdmin from './ToppingsAdmin'
import CountryPicksAdmin from './CountryPicksAdmin'
import RecipeAdmin from './RecipeAdmin'
import FeedbackAdmin from './FeedbackAdmin'
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

type Tab = 'ramen' | 'julGimbap' | 'dosirak' | 'hotbar' | 'snacks' | 'log' | 'best5' | 'toppings' | 'countryPicks' | 'recipes' | 'feedback' | { catId: number }

function isCatTab(tab: Tab | null): tab is { catId: number } {
  return typeof tab === 'object' && tab !== null
}

export default function AdminView({ categories }: { categories: Category[] }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('ramen')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
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

  const loadCat = async (cat: Category) => {
    setActiveTab({ catId: cat.id })
    setForm(null)
    setSidebarOpen(false)
    const data = await fetch(`/api/items?category_id=${cat.id}`).then(r => r.json())
    setItems(Array.isArray(data) ? data : [])
  }

  const selectTab = (tab: Tab) => {
    setActiveTab(tab)
    setForm(null)
    setSidebarOpen(false)
  }

  const selectedCat = isCatTab(activeTab)
    ? categories.find(c => c.id === activeTab.catId) ?? null
    : null

  const save = async () => {
    if (!form || !selectedCat) return
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { await loadCat(selectedCat); setForm(null) }
    else { const err = await res.json(); alert('저장 실패: ' + err.error) }
    setSaving(false)
  }

  const deleteItem = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/items?id=${id}`, { method: 'DELETE' })
    if (selectedCat) await loadCat(selectedCat)
  }

  const startEdit = (item: Item) => setForm({
    ...item,
    title_en: item.title_en || '', title_zh: item.title_zh || '', title_ja: item.title_ja || '',
    content_ko: item.content_ko || '', content_en: item.content_en || '',
    content_zh: item.content_zh || '', content_ja: item.content_ja || '',
    image_url: item.image_url || '', video_url: item.video_url || '',
    map_keyword: item.map_keyword || '',
    blocks: item.blocks || [],
  } as ItemFormState)

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
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

  const MENU = [
    { tab: 'ramen' as Tab,        label: '라면 관리',  icon: '🍜' },
    { tab: 'julGimbap' as Tab,    label: '줄김밥',     icon: '🍙' },
    { tab: 'dosirak' as Tab,      label: '도시락',     icon: '🍱' },
    { tab: 'hotbar' as Tab,       label: '핫바',       icon: '🍢' },
    { tab: 'snacks' as Tab,       label: '디저트/간식', icon: '🍭' },
    { tab: 'log' as Tab,          label: 'Ramen Log',  icon: '📋' },
    { tab: 'best5' as Tab,        label: 'Best 5',     icon: '🏆' },
    { tab: 'toppings' as Tab,     label: '꿀조합',     icon: '🍳' },
    { tab: 'countryPicks' as Tab, label: '나라별 픽',  icon: '🌏' },
    { tab: 'recipes' as Tab,      label: '레시피',     icon: '✏️' },
    { tab: 'feedback' as Tab,     label: '피드백',     icon: '💬' },
  ]

  const isActive = (tab: Tab) => JSON.stringify(activeTab) === JSON.stringify(tab)

  const Sidebar = () => (
    <nav className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-emerald-800">
        <p className="text-white font-bold text-base">K-Ramen Admin</p>
      </div>
      <div className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {MENU.map(({ tab, label, icon }) => (
          <button key={String(tab)} onClick={() => selectTab(tab)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
              ${isActive(tab) ? 'bg-emerald-500 text-white' : 'text-emerald-100 hover:bg-emerald-700'}`}>
            <span>{icon}</span>{label}
          </button>
        ))}

        {categories.length > 0 && (
          <>
            <p className="text-xs text-emerald-400 font-medium px-3 pt-4 pb-1">카테고리</p>
            {categories.map(cat => {
              const tab: Tab = { catId: cat.id }
              return (
                <button key={cat.id} onClick={() => loadCat(cat)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
                    ${isActive(tab) ? 'bg-emerald-500 text-white' : 'text-emerald-100 hover:bg-emerald-700'}`}>
                  <span>{cat.icon}</span>{cat.title_ko}
                </button>
              )
            })}
          </>
        )}
      </div>
      <div className="px-2 py-3 border-t border-emerald-800">
        <button
          onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); setAuthed(false) }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-emerald-200 hover:bg-emerald-700 transition-colors">
          ← 로그아웃
        </button>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* PC 사이드바 */}
      <aside className="hidden md:flex flex-col w-56 bg-emerald-700 shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* 모바일 오버레이 사이드바 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-emerald-700 z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 모바일 상단 헤더 */}
        <header className="md:hidden bg-emerald-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="font-bold text-sm">K-Ramen Admin</p>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto space-y-4">
          {activeTab === 'ramen'        && <RamenAdmin />}
          {activeTab === 'julGimbap'    && <JulGimbapAdmin />}
          {activeTab === 'dosirak'      && <DosirakAdmin />}
          {activeTab === 'hotbar'       && <HotbarAdmin />}
          {activeTab === 'snacks'       && <SnacksAdmin />}
          {activeTab === 'log'          && <RamenLogAdmin />}
          {activeTab === 'best5'        && <Best5Admin />}
          {activeTab === 'toppings'     && <ToppingsAdmin />}
          {activeTab === 'countryPicks' && <CountryPicksAdmin />}
          {activeTab === 'recipes'      && <RecipeAdmin />}
          {activeTab === 'feedback'     && <FeedbackAdmin />}

          {isCatTab(activeTab) && selectedCat && !form && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">{selectedCat.title_ko} 항목</p>
                <button onClick={() => setForm(emptyForm(selectedCat.id))}
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

          {isCatTab(activeTab) && form && (
            <ItemEditForm
              form={form}
              onChange={setForm}
              onSave={save}
              onCancel={() => setForm(null)}
              saving={saving}
            />
          )}
        </main>
      </div>
    </div>
  )
}
