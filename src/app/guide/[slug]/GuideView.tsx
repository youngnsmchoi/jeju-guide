'use client'
// 상세 화면 렌더링 — 사진/영상 + 설명 + 지도 연동 버튼

import { useLang } from '@/context/LangContext'
import { getTitle, getContent } from '@/lib/types'
import type { Item, Category, Lang, RamenItem } from '@/lib/types'
import BlockRenderer from '@/components/BlockRenderer'
import RamenList from '@/components/RamenList'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

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

export default function GuideView({ item, category, ramenItems }: { item: Item; category: Category | null; ramenItems: RamenItem[] | null }) {
  const { lang } = useLang()

  const mapLabels = MAP_LABELS[lang]
  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null
  const content = getContent(item, lang)

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full pb-20">
        {/* 제목 */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-xl font-bold text-gray-900">{getTitle(item, lang)}</h1>
        </div>

        {/* 라면 가이드: 레코드 카드 목록 */}
        {ramenItems ? (
          <RamenList items={ramenItems} lang={lang} />
        ) : (
          <>
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
          </>
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
      <BottomNav />
    </div>
  )
}
