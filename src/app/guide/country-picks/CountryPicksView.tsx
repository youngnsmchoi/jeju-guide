'use client'
// 나라별 인기 한국 라면 — DB 연동, 국가 선택 후 라면 리스트 표시

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import type { CountryPick } from '@/app/admin/CountryPicksAdmin'

const LABEL: Record<Lang, {
  title: string; back: string; intro: string; selectPrompt: string
  source: string; rank: string; score: string; comingSoon: string
}> = {
  ko: { title: '나라별 인기 라면', back: '← 뒤로', intro: '내 나라 사람들은 어떤 한국 라면을 좋아할까요?', selectPrompt: '나라를 선택하세요', source: '출처', rank: '위', score: '점', comingSoon: '준비 중' },
  en: { title: 'Popular Ramen by Country', back: '← Back', intro: 'What Korean ramen do people from your country love?', selectPrompt: 'Select your country', source: 'Source', rank: '#', score: 'pts', comingSoon: 'Coming soon' },
  zh: { title: '各国人气拉面', back: '← 返回', intro: '你的国家的人喜欢哪款韩国拉面？', selectPrompt: '选择国家', source: '来源', rank: '位', score: '分', comingSoon: '即将推出' },
  ja: { title: '国別人気ラーメン', back: '← 戻る', intro: '自分の国の人はどんな韓国ラーメンが好き？', selectPrompt: '国を選んでください', source: '出典', rank: '位', score: '点', comingSoon: '準備中' },
}

const COMING_SOON_COUNTRIES = [
  { flag: '🇨🇳', name: { ko: '중국', en: 'China', zh: '中国', ja: '中国' } },
  { flag: '🇹🇭', name: { ko: '태국', en: 'Thailand', zh: '泰国', ja: 'タイ' } },
  { flag: '🇺🇸', name: { ko: '미국', en: 'USA', zh: '美国', ja: 'アメリカ' } },
  { flag: '🇻🇳', name: { ko: '베트남', en: 'Vietnam', zh: '越南', ja: 'ベトナム' } },
  { flag: '🇵🇭', name: { ko: '필리핀', en: 'Philippines', zh: '菲律宾', ja: 'フィリピン' } },
]

export default function CountryPicksView({ picks }: { picks: CountryPick[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]
  const [selected, setSelected] = useState<string | null>(null)

  // DB에서 나라 목록 추출 (중복 제거)
  const countries = Array.from(new Map(picks.map(p => [p.country_code, p])).values())

  const selectedPicks = selected ? picks.filter(p => p.country_code === selected) : []
  const selectedCountry = countries.find(c => c.country_code === selected)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-5">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 나라 선택 */}
        <div>
          <p className="text-xs text-gray-400 font-medium mb-3">{L.selectPrompt}</p>
          <div className="flex flex-wrap gap-2">
            {countries.map(c => (
              <button key={c.country_code}
                onClick={() => setSelected(selected === c.country_code ? null : c.country_code)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all
                  ${selected === c.country_code
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}>
                <span>{c.flag}</span>
                <span>{c[`country_${lang}` as keyof CountryPick] as string || c.country_ko}</span>
              </button>
            ))}
            {COMING_SOON_COUNTRIES.map(c => (
              <button key={c.name.ko} disabled
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border bg-gray-50 text-gray-300 border-gray-100 cursor-default">
                <span>{c.flag}</span>
                <span>{c.name[lang]}</span>
                <span className="text-xs">({L.comingSoon})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 나라 라면 목록 */}
        {selectedCountry && selectedPicks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">
                {selectedCountry.flag} {(selectedCountry[`country_${lang}` as keyof CountryPick] as string) || selectedCountry.country_ko} Top {selectedPicks.length}
              </h2>
              {selectedCountry.source_url && (
                <a href={selectedCountry.source_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 underline">{L.source}</a>
              )}
            </div>
            {selectedCountry[`source_${lang}` as keyof CountryPick] && (
              <p className="text-xs text-gray-400">{selectedCountry[`source_${lang}` as keyof CountryPick] as string}</p>
            )}

            {selectedPicks.map(pick => (
              <div key={pick.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${pick.rank_num === 1 ? 'bg-yellow-100 text-yellow-700' :
                        pick.rank_num === 2 ? 'bg-gray-100 text-gray-600' :
                        pick.rank_num === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-50 text-gray-500'}`}>
                      {pick.rank_num}{L.rank}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">
                      {(pick[`name_${lang}` as keyof CountryPick] as string) || pick.name_ko}
                    </h3>
                  </div>
                  {pick.score != null && (
                    <span className="text-xs text-emerald-600 font-medium shrink-0">{pick.score}{L.score}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {(pick[`reason_${lang}` as keyof CountryPick] as string) || pick.reason_ko}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
