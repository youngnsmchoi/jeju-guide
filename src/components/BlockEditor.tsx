'use client'
// 블록 방식 콘텐츠 에디터 컴포넌트

import { useRef } from 'react'
import type { Block, Lang, ImageSize, ImageAlign, ImagePosition, TextValign, TipVariant } from '@/lib/types'

interface Props {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  lang: Lang
}

const BLOCK_TYPES = [
  { type: 'text', label: '📝 텍스트' },
  { type: 'image', label: '🖼 이미지' },
  { type: 'image_text', label: '🖼+📝 이미지+텍스트' },
  { type: 'youtube', label: '▶ YouTube' },
  { type: 'tip', label: '💡 팁/주의' },
] as const

const TIP_VARIANT_OPTIONS: { value: TipVariant; label: string }[] = [
  { value: 'tip', label: '💡 팁' },
  { value: 'warning', label: '⚠️ 주의' },
  { value: 'info', label: 'ℹ️ 정보' },
]

const SIZE_OPTIONS: { value: ImageSize; label: string }[] = [
  { value: 'small', label: '소 (1/3)' },
  { value: 'medium', label: '중 (1/2)' },
  { value: 'full', label: '대 (전체)' },
]

const ALIGN_OPTIONS: { value: ImageAlign; label: string }[] = [
  { value: 'left', label: '◀ 좌측' },
  { value: 'center', label: '■ 중앙' },
  { value: 'right', label: '▶ 우측' },
]

const POSITION_OPTIONS: { value: ImagePosition; label: string }[] = [
  { value: 'left', label: '◀ 이미지 왼쪽' },
  { value: 'right', label: '▶ 이미지 오른쪽' },
]

const VALIGN_OPTIONS: { value: TextValign; label: string }[] = [
  { value: 'top', label: '▲ 상단' },
  { value: 'middle', label: '■ 중앙' },
  { value: 'bottom', label: '▼ 하단' },
]

function newBlock(type: Block['type']): Block {
  if (type === 'text') return { type, text_ko: '', text_en: '', text_zh: '', text_ja: '' }
  if (type === 'image') return { type, url: '', size: 'full' as const, align: 'left' as const, caption_ko: '', caption_en: '', caption_zh: '', caption_ja: '' }
  if (type === 'image_text') return { type, url: '', size: 'medium' as const, position: 'left' as const, valign: 'top' as const, text_ko: '', text_en: '', text_zh: '', text_ja: '' }
  if (type === 'tip') return { type, variant: 'tip' as const, text_ko: '', text_en: '', text_zh: '', text_ja: '' }
  return { type: 'youtube', url: '' }
}

// 이미지 크기별 에디터 미리보기 클래스
const sizePreviewClass: Record<ImageSize, string> = {
  small: 'w-1/3',
  medium: 'w-1/2',
  full: 'w-full',
}

export default function BlockEditor({ blocks, onChange, lang }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTargetIndex = useRef<number>(-1)

  const update = (index: number, patch: Partial<Block>) =>
    onChange(blocks.map((b, i) => i === index ? { ...b, ...patch } as Block : b))

  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index))

  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...blocks]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return
    const next = [...blocks]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  const uploadImage = async (file: File, index: number) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const { url, error } = await res.json()
    if (error) { alert('업로드 실패: ' + error); return }
    update(index, { url } as Partial<Block>)
  }

  const textKey = `text_${lang}` as const
  const captionKey = `caption_${lang}` as const

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* 블록 헤더 */}
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500">
              {BLOCK_TYPES.find(t => t.type === block.type)?.label}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => moveUp(i)} className="text-xs px-2 py-1 rounded hover:bg-gray-200">↑</button>
              <button type="button" onClick={() => moveDown(i)} className="text-xs px-2 py-1 rounded hover:bg-gray-200">↓</button>
              <button type="button" onClick={() => remove(i)} className="text-xs px-2 py-1 rounded hover:bg-red-100 text-red-400">✕</button>
            </div>
          </div>

          {/* 블록 내용 */}
          <div className="p-3 space-y-2">

            {/* 텍스트 블록 */}
            {block.type === 'text' && (
              <>
                <textarea
                  value={(block as any)[textKey] || ''}
                  onChange={e => update(i, { [textKey]: e.target.value } as Partial<Block>)}
                  placeholder="텍스트를 입력하세요&#10;굵게: **텍스트** 형식으로 입력"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
                <p className="text-xs text-gray-400">굵게 표시: <code className="bg-gray-100 px-1 rounded">**텍스트**</code> 형식으로 입력하세요.</p>
              </>
            )}

            {/* 이미지 블록 */}
            {block.type === 'image' && (
              <>
                {/* 크기 선택 */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">크기.</span>
                  {SIZE_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => update(i, { size: s.value } as Partial<Block>)}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${(block as any).size === s.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >{s.label}</button>
                  ))}
                </div>
                {/* 정렬 선택 */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">정렬.</span>
                  {ALIGN_OPTIONS.map(a => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => update(i, { align: a.value } as Partial<Block>)}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${((block as any).align || 'left') === a.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >{a.label}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={(block as any).url || ''}
                    onChange={e => update(i, { url: e.target.value } as Partial<Block>)}
                    placeholder="이미지 URL"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => { uploadTargetIndex.current = i; fileInputRef.current?.click() }}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                  >업로드</button>
                </div>
                {(block as any).url && (
                  <img
                    src={(block as any).url}
                    className={`${sizePreviewClass[(block as any).size as ImageSize || 'full']} max-h-48 object-cover rounded-lg`}
                  />
                )}
                <input
                  value={(block as any)[captionKey] || ''}
                  onChange={e => update(i, { [captionKey]: e.target.value } as Partial<Block>)}
                  placeholder="사진 설명 (선택)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </>
            )}

            {/* 이미지+텍스트 블록 */}
            {block.type === 'image_text' && (
              <>
                {/* 크기 선택 */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">이미지 크기.</span>
                  {SIZE_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => update(i, { size: s.value } as Partial<Block>)}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${(block as any).size === s.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >{s.label}</button>
                  ))}
                </div>
                {/* 이미지 위치 선택 */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">이미지 위치.</span>
                  {POSITION_OPTIONS.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => update(i, { position: p.value } as Partial<Block>)}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${((block as any).position || 'left') === p.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >{p.label}</button>
                  ))}
                </div>
                {/* 텍스트 수직 정렬 */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">글자 위치.</span>
                  {VALIGN_OPTIONS.map(v => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => update(i, { valign: v.value } as Partial<Block>)}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${((block as any).valign || 'top') === v.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >{v.label}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={(block as any).url || ''}
                    onChange={e => update(i, { url: e.target.value } as Partial<Block>)}
                    placeholder="이미지 URL"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => { uploadTargetIndex.current = i; fileInputRef.current?.click() }}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                  >업로드</button>
                </div>
                <textarea
                  value={(block as any)[textKey] || ''}
                  onChange={e => update(i, { [textKey]: e.target.value } as Partial<Block>)}
                  placeholder="이미지 옆 설명 텍스트&#10;굵게: **텍스트** 형식으로 입력"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
                <p className="text-xs text-gray-400">굵게 표시: <code className="bg-gray-100 px-1 rounded">**텍스트**</code> 형식으로 입력하세요.</p>
                {/* 미리보기 */}
                {(block as any).url && (
                  <div className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                    {((block as any).position || 'left') === 'left' ? (
                      <>
                        <img src={(block as any).url} className={`${sizePreviewClass[(block as any).size as ImageSize || 'medium']} max-h-32 object-cover rounded-lg flex-shrink-0`} />
                        <p className="text-xs text-gray-600 whitespace-pre-line">{(block as any)[textKey]}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-gray-600 whitespace-pre-line flex-1">{(block as any)[textKey]}</p>
                        <img src={(block as any).url} className={`${sizePreviewClass[(block as any).size as ImageSize || 'medium']} max-h-32 object-cover rounded-lg flex-shrink-0`} />
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 팁 블록 */}
            {block.type === 'tip' && (
              <>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">종류.</span>
                  {TIP_VARIANT_OPTIONS.map(v => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => update(i, { variant: v.value } as Partial<Block>)}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${((block as any).variant || 'tip') === v.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >{v.label}</button>
                  ))}
                </div>
                <textarea
                  value={(block as any)[textKey] || ''}
                  onChange={e => update(i, { [textKey]: e.target.value } as Partial<Block>)}
                  placeholder="팁 내용을 입력하세요&#10;굵게: **텍스트** 형식으로 입력"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
              </>
            )}

            {/* YouTube 블록 */}
            {block.type === 'youtube' && (
              <input
                value={(block as any).url || ''}
                onChange={e => update(i, { url: e.target.value } as Partial<Block>)}
                placeholder="YouTube URL (https://youtube.com/watch?v=...)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>
        </div>
      ))}

      {/* 블록 추가 버튼 */}
      <div className="flex flex-wrap gap-2">
        {BLOCK_TYPES.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange([...blocks, newBlock(type as Block['type'])])}
            className="px-3 py-2 text-sm border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
          >+ {label}</button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file && uploadTargetIndex.current >= 0) uploadImage(file, uploadTargetIndex.current)
          e.target.value = ''
        }}
      />
    </div>
  )
}
