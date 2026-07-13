'use client'
// 나라별 인기 한국 라면 — DB 연동, 국가 선택 후 라면 리스트 표시

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import type { CountryPick } from '@/app/admin/CountryPicksAdmin'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  title: string; intro: string; selectPrompt: string
  source: string; rank: string; score: string; comingSoon: string
  popularityLegend: string; refSites: string
}> = {
  ko: { title: '나라별 인기 라면', intro: '내 나라 사람들은 어떤 한국 라면을 좋아할까요?', selectPrompt: '나라를 선택하세요', source: '출처', rank: '위', score: '점', comingSoon: '준비 중', popularityLegend: '🔥🔥🔥 매우 인기   🔥🔥 인기   🔥 보통', refSites: '참고 사이트' },
  en: { title: 'Popular Ramen by Country', intro: 'What Korean ramen do people from your country love?', selectPrompt: 'Select your country', source: 'Source', rank: '#', score: 'pts', comingSoon: 'Coming soon', popularityLegend: '🔥🔥🔥 Very popular   🔥🔥 Popular   🔥 Moderate', refSites: 'Reference sites' },
  zh: { title: '各国人气拉面', intro: '你的国家的人喜欢哪款韩国拉面？', selectPrompt: '选择国家', source: '来源', rank: '位', score: '分', comingSoon: '即将推出', popularityLegend: '🔥🔥🔥 非常热门   🔥🔥 热门   🔥 一般', refSites: '参考网站' },
  ja: { title: '国別人気ラーメン', intro: '自分の国の人はどんな韓国ラーメンが好き？', selectPrompt: '国を選んでください', source: '出典', rank: '位', score: '点', comingSoon: '準備中', popularityLegend: '🔥🔥🔥 大人気   🔥🔥 人気   🔥 普通', refSites: '参考サイト' },
}

// 나라별 참고 사이트 (여러 개일 경우 여기에 추가)
const REF_SITES: Record<string, { name: string; url: string }[]> = {
  cn: [
    { name: '韩国最受欢迎的十大拉面 — 金吉列留学', url: 'https://www.jjl.cn/article/1018154.html' },
    { name: '韩式炸酱面的破圈时刻！— 知乎', url: 'https://zhuanlan.zhihu.com/p/656351549' },
    { name: '2025最新韩国泡面排名 — Extrabux', url: 'https://www.extrabux.com/chs/guide/8575976' },
  ],
  jp: [
    { name: '일본인이 선택한 한국라면 Top 10 — 카카오 뉴스', url: 'https://v.daum.net/v/fw7shoc6Ho' },
  ],
  tw: [
    { name: '辛拉麵竟沒上榜！台灣人最愛韓國泡麵TOP5 — beauty321', url: 'https://www.beauty321.com/post/64318' },
  ],
  th: [
    { name: 'แนะนำ 10 มาม่าเกาหลี ยี่ห้อไหนอร่อย — Thairath Shopping', url: 'https://www.thairath.co.th/shopping/food/1000387' },
  ],
  us: [
    { name: '미국에서 사랑받는 한국라면 TOP 5 — College Inside(미주중앙일보)', url: 'https://college.koreadaily.com/%EB%AF%B8%EA%B5%AD%EC%97%90%EC%84%9C-%EC%82%AC%EB%9E%91%EB%B0%9B%EB%8A%94-%ED%95%9C%EA%B5%AD%EB%9D%BC%EB%A9%B4-top-5/' },
  ],
  vn: [
    { name: 'Top 10 Mì Gói Hàn Quốc Ngon Nhất — Bún Đậu Mắm Tôm Tiến Hải', url: 'https://bundaumamtomtienhai.vn/mi-goi-han-quoc-ngon-nhat/' },
  ],
  ph: [
    { name: '10 Best Korean Noodles in the Philippines — mybest', url: 'https://ph.my-best.com/15643' },
  ],
}

const COMING_SOON_COUNTRIES: { flag: string; name: Record<Lang, string> }[] = []

export default function CountryPicksView({ picks }: { picks: CountryPick[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [selected, setSelected] = useState<string | null>(null)

  const countries = Array.from(new Map(picks.map(p => [p.country_code, p])).values())
  const selectedPicks = selected ? picks.filter(p => p.country_code === selected) : []
  const selectedCountry = countries.find(c => c.country_code === selected)

  // 선택한 나라에 🔥 인기도가 있는지 확인 (점수 없는 나라)
  const hasPopularity = selectedPicks.some(p => p.popularity && !p.score)
  const refSites = selected ? (REF_SITES[selected] ?? []) : []

  // 출처 텍스트 (DB의 source 컬럼)
  const sourceLabel = selectedCountry
    ? (selectedCountry[`source_${lang}` as keyof CountryPick] as string) || selectedCountry.source_ko
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

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
                <span>{(c[`country_${lang}` as keyof CountryPick] as string) || c.country_ko}</span>
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
            {/* 타이틀 */}
            <h2 className="text-sm font-bold text-gray-800">
              {selectedCountry.flag} {(selectedCountry[`country_${lang}` as keyof CountryPick] as string) || selectedCountry.country_ko} Top {selectedPicks.length}
            </h2>

            {/* 순위 기준 — 타이틀 바로 아래 */}
            {sourceLabel && (
              <p className="text-xs text-gray-400">{L.source}: {sourceLabel}</p>
            )}

            {/* 🔥 범례 — 인기도 방식일 때만 표시 */}
            {hasPopularity && (
              <p className="text-xs text-gray-400">{L.popularityLegend}</p>
            )}

            {/* 라면 카드 */}
            {selectedPicks.map(pick => (
              <div key={pick.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0
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
                  {pick.score != null
                    ? <span className="text-xs text-emerald-600 font-medium shrink-0">{pick.score}{L.score}</span>
                    : pick.popularity
                      ? <span className="text-sm shrink-0">{pick.popularity}</span>
                      : null
                  }
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {(pick[`reason_${lang}` as keyof CountryPick] as string) || pick.reason_ko}
                </p>
              </div>
            ))}

            {/* 하단 출처 영역 */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {/* 데이터 기준 설명 */}
              {sourceLabel && (
                <p className="text-xs text-gray-400">{L.source}: {sourceLabel}</p>
              )}

              {/* 참고 사이트 링크 목록 */}
              {refSites.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">{L.refSites}</p>
                  <ul className="space-y-1">
                    {refSites.map((site, i) => (
                      <li key={i}>
                        <a href={site.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:text-emerald-800 underline leading-relaxed">
                          {site.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
