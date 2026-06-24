'use client'
// 블록 배열을 화면에 렌더링하는 컴포넌트

import type { Block, Lang, ImageSize } from '@/lib/types'
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

// 이미지+텍스트 블록에서 이미지 크기별 고정 높이
const imageTextSizeClass: Record<ImageSize, string> = {
  small: 'w-20 h-20',
  medium: 'w-32 h-32',
  full: 'w-40 h-40',
}

interface Props {
  blocks: Block[]
  lang: Lang
}

export default function BlockRenderer({ blocks, lang }: Props) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
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
          return (
            <div key={i} className="space-y-1">
              <img
                src={block.url}
                alt=""
                className={`${imageSizeClass[size]} rounded-xl object-cover`}
              />
              {getBlockCaption(block, lang) && (
                <p className="text-xs text-gray-400 text-center">{getBlockCaption(block, lang)}</p>
              )}
            </div>
          )
        }

        if (block.type === 'image_text') {
          const size = block.size || 'medium'
          const text = getBlockText(block, lang)
          return (
            <div key={i} className="flex gap-3 items-start">
              <img
                src={block.url}
                alt=""
                className={`${imageTextSizeClass[size]} object-cover rounded-xl flex-shrink-0`}
              />
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
