'use client'
// 블록 배열을 화면에 렌더링하는 컴포넌트

import type { Block, Lang } from '@/lib/types'
import { getBlockText, getBlockCaption } from '@/lib/types'

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return m ? m[1] : null
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
          return (
            <p key={i} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {getBlockText(block, lang)}
            </p>
          )
        }

        if (block.type === 'image') {
          return (
            <div key={i} className="space-y-1">
              <img src={block.url} alt="" className="w-full rounded-xl object-cover" />
              {getBlockCaption(block, lang) && (
                <p className="text-xs text-gray-400 text-center">{getBlockCaption(block, lang)}</p>
              )}
            </div>
          )
        }

        if (block.type === 'image_text') {
          return (
            <div key={i} className="flex gap-3 items-start">
              <img src={block.url} alt="" className="w-32 h-32 object-cover rounded-xl flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {getBlockText(block, lang)}
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
