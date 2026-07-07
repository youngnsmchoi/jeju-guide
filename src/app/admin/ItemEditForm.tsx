'use client'
// 가이드 항목 편집 폼 — AdminView에서 분리

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Block, Lang } from '@/lib/types'
import { LANGS } from '@/lib/langs'

const BlockEditor = dynamic(() => import('@/components/BlockEditor'), { ssr: false })

export interface ItemFormState {
  id?: number
  category_id: number
  slug: string
  order_num: number
  title_ko: string; title_en: string; title_zh: string; title_ja: string
  content_ko: string; content_en: string; content_zh: string; content_ja: string
  image_url: string
  video_url: string
  map_keyword: string
  blocks: Block[]
}

interface Props {
  form: ItemFormState
  onChange: (form: ItemFormState) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}

export default function ItemEditForm({ form, onChange, onSave, onCancel, saving }: Props) {
  const [activeLang, setActiveLang] = useState<Lang>('ko')
  const [uploading, setUploading] = useState(false)
  const imageFileRef = useRef<HTMLInputElement>(null)

  const setField = (key: keyof ItemFormState, value: string | number | Block[]) =>
    onChange({ ...form, [key]: value })

  const toSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

  const setTitleEn = (value: string) => {
    const autoSlug = toSlug(value)
    const prevAuto = toSlug(form.title_en)
    const shouldUpdate = !form.slug || form.slug === prevAuto
    onChange({ ...form, title_en: value, slug: shouldUpdate ? autoSlug : form.slug })
  }

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

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-800">{form.id ? '항목 수정' : '새 항목 추가'}</h2>
        <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600">✕ 닫기</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 font-medium">슬러그 (영문, 하이픈)</label>
          <input value={form.slug} onChange={e => setField('slug', e.target.value)}
            placeholder="convenience-store-1plus1"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-medium">순서</label>
          <input type="number" value={form.order_num} onChange={e => setField('order_num', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="flex gap-2">
        {LANGS.map(l => (
          <button key={l.code} type="button" onClick={() => setActiveLang(l.code)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
              ${activeLang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs text-gray-400 font-medium">제목</label>
        <input
          value={form[`title_${activeLang}` as keyof ItemFormState] as string}
          onChange={e => activeLang === 'en' ? setTitleEn(e.target.value) : setField(`title_${activeLang}`, e.target.value)}
          placeholder={activeLang === 'en' ? '영문 제목 입력 시 슬러그 자동 생성' : `제목 (${activeLang})`}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
        {activeLang === 'en' && (
          <p className="text-xs text-gray-400 mt-1">영문 제목을 입력하면 슬러그가 자동으로 채워집니다.</p>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-400 font-medium mb-2 block">콘텐츠 블록</label>
        <BlockEditor blocks={form.blocks} onChange={blocks => setField('blocks', blocks)} lang={activeLang} />
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 font-medium">추가 설정</p>
        <div>
          <label className="text-xs text-gray-400">지도 검색 키워드</label>
          <input value={form.map_keyword} onChange={e => setField('map_keyword', e.target.value)}
            placeholder="편의점"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400">대표 이미지 URL</label>
          <div className="flex gap-2 mt-1">
            <input value={form.image_url} onChange={e => setField('image_url', e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
            <button type="button" onClick={() => imageFileRef.current?.click()} disabled={uploading}
              className="px-3 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 disabled:opacity-50">
              {uploading ? '업로드 중...' : '업로드'}
            </button>
          </div>
          {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
          <input ref={imageFileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSave} disabled={saving}
          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
          {saving ? '저장 중...' : '저장'}
        </button>
        <button onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          취소
        </button>
      </div>
    </div>
  )
}
