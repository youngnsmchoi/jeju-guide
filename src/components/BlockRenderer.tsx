'use client'
// 블록 배열을 화면에 렌더링하는 컴포넌트

import type { Block, Lang, ImageSize, ImageAlign, ImagePosition, TextValign, TipVariant } from '@/lib/types'
import { getBlockText, getBlockCaption } from '@/lib/types'

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return m ? m[1] : null
}

// **텍스트** → <strong>텍스트</strong> 변환
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// 이미지 크기별 클래스
const imageSizeClass: Record<ImageSize, string> = {
  small: 'w-1/3',
  medium: 'w-1/2',
  full: 'w-full',
}

// 이미지+텍스트 블록에서 이미지 크기별 클래스
const imageTextSizeClass: Record<ImageSize, string> = {
  small: 'w-1/4',
  medium: 'w-1/2',
  full: 'w-2/3',
}

// 텍스트 수직 정렬
const textValignClass: Record<TextValign, string> = {
  top: 'items-start',
  middle: 'items-center',
  bottom: 'items-end',
}

// 팁 박스 스타일
const tipStyle: Record<TipVariant, { bg: string; border: string; icon: string }> = {
  tip:     { bg: 'bg-emerald-50', border: 'border-emerald-300', icon: '💡' },
  warning: { bg: 'bg-amber-50',   border: 'border-amber-300',   icon: '⚠️' },
  info:    { bg: 'bg-blue-50',    border: 'border-blue-300',    icon: 'ℹ️' },
}

// 단독 이미지 정렬
const imageAlignClass: Record<ImageAlign, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
}

interface Props {
  blocks: Block[]
  lang: Lang
}

export default function BlockRenderer({ blocks, lang }: Props) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const text = getBlockText(block, lang)
          if (block.level === 'h3') {
            return (
              <h3 key={i} className="text-base font-semibold text-gray-800 pt-2">
                {text}
              </h3>
            )
          }
          return (
            <div key={i} className="pt-4 pb-1 border-t border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{text}</h2>
            </div>
          )
        }

        if (block.type === 'text') {
          const text = getBlockText(block, lang)
          return (
            <p key={i} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {renderText(text)}
            </p>
          )
        }

        if (block.type === 'image') {
          const size = block.size || 'full'
          const align = block.align || 'left'
          return (
            <div key={i} className="space-y-1">
              <img
                src={block.url}
                alt=""
                className={`${imageSizeClass[size]} ${imageAlignClass[align]} block rounded-xl object-cover`}
              />
              {getBlockCaption(block, lang) && (
                <p className="text-xs text-gray-400 text-center">{getBlockCaption(block, lang)}</p>
              )}
            </div>
          )
        }

        if (block.type === 'image_text') {
          const size = block.size || 'medium'
          const position = block.position || 'left'
          const valign = block.valign || 'top'
          const text = getBlockText(block, lang)
          const img = (
            <img
              src={block.url}
              alt=""
              className={`${imageTextSizeClass[size]} object-cover rounded-xl flex-shrink-0 max-h-48`}
            />
          )
          const txt = (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {renderText(text)}
            </p>
          )
          return (
            <div key={i} className={`flex gap-3 ${textValignClass[valign]}`}>
              {position === 'left' ? <>{img}{txt}</> : <>{txt}{img}</>}
            </div>
          )
        }

        if (block.type === 'tip') {
          const variant = block.variant || 'tip'
          const { bg, border, icon } = tipStyle[variant]
          const text = getBlockText(block, lang)
          return (
            <div key={i} className={`flex gap-2 ${bg} border-l-4 ${border} rounded-r-xl px-4 py-3`}>
              <span className="flex-shrink-0">{icon}</span>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {renderText(text)}
              </p>
            </div>
          )
        }

        if (block.type === 'youtube') {
          const id = getYoutubeId(block.url)
          if (!id) return null
          return (
            <div key={i} className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${id}`}
                allowFullScreen
              />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
