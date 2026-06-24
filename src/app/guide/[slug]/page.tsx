'use client'
// 상세 페이지 — 사진/영상 + 설명 + 지도 연동 버튼

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import { getTitle, getContent } from '@/lib/types'
import type { Item, Category, Lang } from '@/lib/types'
import BlockRenderer from '@/components/BlockRenderer'

const LANG_LABELS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const MAP_LABELS: Record<Lang, { kakao: string; naver: string; google: string }> = {
  ko: { kakao: '카카오맵', naver: '네이버맵', google: '구글맵' },
  en: { kakao: 'Kakao Map', naver: 'Naver Map', google: 'Google Map' },
  zh: { kakao: 'Kakao地图', naver: 'Naver地图', google: '谷歌地图' },
  ja: { kakao: 'カカオマップ', naver: 'ネイバーマップ', google: 'Googleマップ' },
}

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return m ? m[1] : null
}

export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { lang, setLang } = useLang()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(async ({ slug }) => {
      const res = await fetch(`/api/guide?slug=${slug}`).then((r) => r.json())
      if (res.item) setItem(res.item)
      if (res.category) setCategory(res.category)
      setLoading(false)
    })
  }, [params])

  if (loading) return <div className="text-center text-gray-400 py-20">불러오는 중...</div>
  if (!item) return <div className="text-center text-gray-400 py-20">항목을 찾을 수 없습니다.</div>

  const mapLabels = MAP_LABELS[lang]
  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null
  const content = getContent(item, lang)

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => category ? router.push(`/category/${category.slug}`) : router.push('/')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600"
          >
            ← {category ? getTitle(category, lang) : '홈'}
          </button>
          <div className="flex gap-2">
            {LANG_LABELS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors
                  ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full">
        {/* 제목 */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-xl font-bold text-gray-900">{getTitle(item, lang)}</h1>
        </div>

        {/* 영상 */}
        {youtubeId && (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allowFullScreen
            />
          </div>
        )}

        {/* 이미지 (영상 없을 때) */}
        {!youtubeId && item.image_url && (
          <div className="w-full aspect-video overflow-hidden">
            <img src={item.image_url} alt={getTitle(item, lang)} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 블록 콘텐츠 (새 방식) */}
        {item.blocks && item.blocks.length > 0 && (
          <div className="px-4 py-5">
            <BlockRenderer blocks={item.blocks} lang={lang} />
          </div>
        )}

        {/* 기존 텍스트 콘텐츠 (이전 데이터 호환) */}
        {(!item.blocks || item.blocks.length === 0) && content && (
          <div className="px-4 py-5">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        )}

        {/* 지도 버튼 */}
        {item.map_keyword && (
          <div className="px-4 pb-8">
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">지도에서 찾기</p>
            <div className="flex gap-2">
              <a
                href={`https://map.kakao.com/?q=${encodeURIComponent(item.map_keyword)}&panel=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-yellow-400 text-gray-900 text-sm font-semibold py-3 rounded-xl text-center hover:bg-yellow-500 transition-colors"
              >
                {mapLabels.kakao}
              </a>
              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(item.map_keyword)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white text-sm font-semibold py-3 rounded-xl text-center hover:bg-green-600 transition-colors"
              >
                {mapLabels.naver}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map_keyword)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-500 text-white text-sm font-semibold py-3 rounded-xl text-center hover:bg-blue-600 transition-colors"
              >
                {mapLabels.google}
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
