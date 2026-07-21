'use client'
// 라면 가이드 v2 — FOOD QR 링크 우선 제공, 없으면 제조사 정보를 번역한 아코디언 카드로 안내

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/context/LangContext'
import type { LinkRamenItem, Lang } from '@/lib/types'
import { getLinkRamenField } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  intro: string
  foodqrLink: string
  foodqrSlowNote: string
  foodqrKoreanOnlyNote: string
  manufacturerLink: string
  detailToggle: string
  tabNutrition: string
  tabIngredients: string
  tabAllergens: string
  tabStorage: string
  crossContaminationLabel: string
  sourceNote: string
  checkPackageNote: string
  packageCup: string
  packageBag: string
  filterAll: string
  searchPlaceholder: string
  noResults: string
  spicyLinkLabel: string
}> = {
  ko: {
    intro: '아래 정보는 정부 공식 데이터 또는 제조사 공식 페이지를 기반으로 합니다. 최종 확인은 실물 포장을 참고하세요.',
    foodqrLink: '🔗 식약처 FOOD QR에서 상세 정보 보기 →',
    foodqrSlowNote: '외부 자료라 로딩이 늦어질 수 있어요',
    foodqrKoreanOnlyNote: '이 페이지는 한국어만 지원돼요. 브라우저 번역 기능을 사용해보세요.',
    manufacturerLink: '🔗 제조사 공식 페이지에서 보기 →',
    detailToggle: '영양·원재료·알레르기 정보 보기',
    tabNutrition: '영양표시',
    tabIngredients: '원재료명',
    tabAllergens: '알레르기 유발물질',
    tabStorage: '보관 및 주의사항',
    crossContaminationLabel: '⚠️ 교차오염 주의',
    sourceNote: '출처: 제조사 공식 홈페이지 (번역 제공)',
    checkPackageNote: '⚠️ 최신 정보는 실물 포장을 확인하세요',
    packageCup: '컵',
    packageBag: '봉지',
    filterAll: '전체',
    searchPlaceholder: '라면 이름 검색',
    noResults: '검색 결과가 없어요',
    spicyLinkLabel: '🌶️ 나라별 맵기 평가 보기/남기기 →',
  },
  en: {
    intro: 'The information below is based on official government data or the manufacturer\'s official page. Please check the actual package for final confirmation.',
    foodqrLink: '🔗 View details on Ministry of Food and Drug Safety FOOD QR →',
    foodqrSlowNote: 'Loading external data — may take a moment',
    foodqrKoreanOnlyNote: 'This page is Korean only. Try your browser\'s translate feature.',
    manufacturerLink: '🔗 View on manufacturer\'s official page →',
    detailToggle: 'View nutrition, ingredients, allergen info',
    tabNutrition: 'Nutrition Facts',
    tabIngredients: 'Ingredients',
    tabAllergens: 'Allergens',
    tabStorage: 'Storage & Notes',
    crossContaminationLabel: '⚠️ Cross-contamination notice',
    sourceNote: 'Source: Manufacturer\'s official website (translated)',
    checkPackageNote: '⚠️ Check the actual package for the latest information',
    packageCup: 'Cup',
    packageBag: 'Bag',
    filterAll: 'All',
    searchPlaceholder: 'Search ramen name',
    noResults: 'No results found',
    spicyLinkLabel: '🌶️ See/Add Spiciness Rating by Country →',
  },
  zh: {
    intro: '以下信息基于政府官方数据或制造商官方页面。最终请以实物包装为准。',
    foodqrLink: '🔗 在食品医药品安全处FOOD QR查看详情 →',
    foodqrSlowNote: '加载外部数据，可能需要一点时间',
    foodqrKoreanOnlyNote: '此页面仅支持韩语，请尝试使用浏览器的翻译功能。',
    manufacturerLink: '🔗 在制造商官方页面查看 →',
    detailToggle: '查看营养成分、原材料、过敏原信息',
    tabNutrition: '营养标示',
    tabIngredients: '原材料名称',
    tabAllergens: '过敏原成分',
    tabStorage: '保管及注意事项',
    crossContaminationLabel: '⚠️ 交叉污染提示',
    sourceNote: '出处：制造商官方网站（提供翻译）',
    checkPackageNote: '⚠️ 最新信息请确认实物包装',
    packageCup: '杯面',
    packageBag: '袋装',
    filterAll: '全部',
    searchPlaceholder: '搜索拉面名称',
    noResults: '没有找到结果',
    spicyLinkLabel: '🌶️ 查看/添加各国辣度评价 →',
  },
  ja: {
    intro: '以下の情報は政府公式データまたはメーカー公式ページに基づいています。最終確認は実物のパッケージをご覧ください。',
    foodqrLink: '🔗 食品医薬品安全処FOOD QRで詳細を見る →',
    foodqrSlowNote: '外部データのため、読み込みに時間がかかる場合があります',
    foodqrKoreanOnlyNote: 'このページは韓国語のみ対応です。ブラウザの翻訳機能をお試しください。',
    manufacturerLink: '🔗 メーカー公式ページで見る →',
    detailToggle: '栄養成分・原材料・アレルギー情報を見る',
    tabNutrition: '栄養表示',
    tabIngredients: '原材料名',
    tabAllergens: 'アレルギー物質',
    tabStorage: '保管方法・注意事項',
    crossContaminationLabel: '⚠️ 交差汚染に関する注意',
    sourceNote: '出典：メーカー公式サイト（翻訳提供）',
    checkPackageNote: '⚠️ 最新情報は実物のパッケージをご確認ください',
    packageCup: 'カップ',
    packageBag: '袋',
    filterAll: '全部',
    searchPlaceholder: 'ラーメン名を検索',
    noResults: '検索結果がありません',
    spicyLinkLabel: '🌶️ 国別辛さ評価を見る/投稿する →',
  },
}

type Tab = 'nutrition' | 'ingredients' | 'allergens' | 'storage'
const TABS: Tab[] = ['nutrition', 'ingredients', 'allergens', 'storage']

function RamenCard({ item, lang }: { item: LinkRamenItem; lang: Lang }) {
  const L = LABEL[lang]
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState<Tab>('nutrition')

  const tabLabel = (t: Tab) =>
    t === 'nutrition' ? L.tabNutrition : t === 'ingredients' ? L.tabIngredients : t === 'allergens' ? L.tabAllergens : L.tabStorage

  const foodqrUrl = item.foodqr_barcode ? `https://foodqr.kr/01/0${item.foodqr_barcode}` : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 space-y-2">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          {getLinkRamenField(item, 'name', lang)}
          {item.package_type && (
            <span className={`text-xs font-bold rounded-full px-2.5 py-1 shrink-0 ${
              item.package_type === 'cup' ? 'text-orange-700 bg-orange-100' : 'text-blue-700 bg-blue-100'
            }`}>
              {item.package_type === 'cup' ? L.packageCup : L.packageBag}
            </span>
          )}
        </h2>

        {foodqrUrl ? (
          <>
            <a href={foodqrUrl} target="_blank" rel="noopener noreferrer"
              className="block text-sm font-medium text-emerald-700 hover:text-emerald-800">
              {L.foodqrLink}
            </a>
            <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg px-3 py-2">{L.foodqrSlowNote}</p>
            <p className="text-[11px] text-blue-600 bg-blue-50 rounded-lg px-3 py-2">{L.foodqrKoreanOnlyNote}</p>
          </>
        ) : (
          <>
            <a href={item.manufacturer_url} target="_blank" rel="noopener noreferrer"
              className="block text-sm font-medium text-emerald-700 hover:text-emerald-800">
              {L.manufacturerLink}
            </a>
            <p className="text-[11px] text-blue-600 bg-blue-50 rounded-lg px-3 py-2">{L.foodqrKoreanOnlyNote}</p>
          </>
        )}

        <Link href={`/guide/link-ramen/${item.id}/spicy`}
          className="block text-sm font-medium text-rose-600 hover:text-rose-700">
          {L.spicyLinkLabel}
        </Link>
      </div>

      {/* FOOD QR가 없는 경우에만 번역 카드 제공 */}
      {!foodqrUrl && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <span>📋 {L.detailToggle}</span>
            <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-3">
              {/* 탭 */}
              <div className="flex gap-1.5 flex-wrap">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
                      ${tab === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
                    {tabLabel(t)}
                  </button>
                ))}
              </div>

              {/* 영양표시 */}
              {tab === 'nutrition' && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="text-center py-2 border-b border-gray-200">
                    <span className="text-2xl font-bold text-emerald-700">{item.nutrition_kcal}</span>
                    <span className="text-sm text-gray-500 ml-1">kcal</span>
                    {item.serving_size_g && (
                      <span className="text-xs text-gray-400 ml-2">({item.serving_size_g}g)</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-700">
                    <div className="flex justify-between"><span>Sodium</span><span className="font-medium">{item.nutrition_sodium_mg}mg</span></div>
                    <div className="flex justify-between"><span>Carbs</span><span className="font-medium">{item.nutrition_carbs_g}g</span></div>
                    <div className="flex justify-between"><span>Sugar</span><span className="font-medium">{item.nutrition_sugar_g}g</span></div>
                    <div className="flex justify-between"><span>Fat</span><span className="font-medium">{item.nutrition_fat_g}g</span></div>
                    <div className="flex justify-between"><span>Trans Fat</span><span className="font-medium">{item.nutrition_trans_fat_g}g</span></div>
                    <div className="flex justify-between"><span>Saturated Fat</span><span className="font-medium">{item.nutrition_sat_fat_g}g</span></div>
                    <div className="flex justify-between"><span>Cholesterol</span><span className="font-medium">{item.nutrition_cholesterol_mg}mg</span></div>
                    <div className="flex justify-between"><span>Protein</span><span className="font-medium">{item.nutrition_protein_g}g</span></div>
                    {item.nutrition_calcium_mg != null && (
                      <div className="flex justify-between"><span>Calcium</span><span className="font-medium">{item.nutrition_calcium_mg}mg</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* 원재료명 */}
              {tab === 'ingredients' && (
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                  {getLinkRamenField(item, 'ingredients', lang)}
                </p>
              )}

              {/* 알레르기 유발물질 */}
              {tab === 'allergens' && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 font-medium">
                    {getLinkRamenField(item, 'allergens', lang)}
                  </p>
                  {getLinkRamenField(item, 'cross_contamination', lang) && (
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 leading-relaxed">
                      <p className="font-semibold text-gray-600 mb-1">{L.crossContaminationLabel}</p>
                      {getLinkRamenField(item, 'cross_contamination', lang)}
                    </div>
                  )}
                </div>
              )}

              {/* 보관 및 주의사항 */}
              {tab === 'storage' && (
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                  {getLinkRamenField(item, 'storage_note', lang)}
                </p>
              )}

              <p className="text-[11px] text-gray-400 leading-relaxed">{L.sourceNote}</p>
              <p className="text-[11px] text-amber-600 leading-relaxed">{L.checkPackageNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type PackageFilter = 'all' | 'cup' | 'bag'

export default function LinkRamenView({ items }: { items: LinkRamenItem[] }) {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [filter, setFilter] = useState<PackageFilter>('all')
  const [query, setQuery] = useState('')

  const filtered = items.filter(item => {
    if (filter !== 'all' && item.package_type !== filter) return false
    if (query.trim() && !getLinkRamenField(item, 'name', lang).toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={L.searchPlaceholder}
          className="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />

        <div className="flex gap-2">
          {(['all', 'cup', 'bag'] as PackageFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 text-sm font-bold rounded-xl px-3 py-2 transition-colors ${
                filter === f ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}>
              {f === 'all' ? L.filterAll : f === 'cup' ? L.packageCup : L.packageBag}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">{L.noResults}</p>
        ) : (
          filtered.map(item => (
            <RamenCard key={item.id} item={item} lang={lang} />
          ))
        )}
      </main>
    </div>
  )
}
