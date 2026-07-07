'use client'
// 한국 편의점 브랜드 소개 — 외국인 여행자용

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  title: string
  subtitle: string
  commonTitle: string
  commonFeatures: string[]
}> = {
  ko: {
    title: '편의점 브랜드',
    subtitle: '한국 대표 편의점 4곳',
    commonTitle: '모든 편의점 공통 특징',
    commonFeatures: [
      '24시간 운영 (일부 매장 제외)',
      '라면 취식 공간(이트인) 대부분 보유',
      '컵라면용 온수기 비치',
      '카드·현금 모두 결제 가능',
      '냉장·냉동 식품, 음료, 간식 판매',
    ],
  },
  en: {
    title: 'Convenience Store Brands',
    subtitle: '4 major Korean convenience stores',
    commonTitle: 'What all convenience stores have',
    commonFeatures: [
      'Open 24 hours (most locations)',
      'Eat-in seating area in most stores',
      'Hot water dispenser for cup ramen',
      'Card and cash both accepted',
      'Chilled drinks, snacks, and frozen foods',
    ],
  },
  zh: {
    title: '便利店品牌',
    subtitle: '韩国四大连锁便利店',
    commonTitle: '所有便利店共同特点',
    commonFeatures: [
      '24小时营业（部分门店除外）',
      '大多数门店设有堂食区',
      '配备杯面专用热水机',
      '支持刷卡和现金付款',
      '销售冷藏饮料、零食及冷冻食品',
    ],
  },
  ja: {
    title: 'コンビニブランド',
    subtitle: '韓国の主要コンビニ4チェーン',
    commonTitle: '全コンビニ共通の特徴',
    commonFeatures: [
      '24時間営業（一部店舗を除く）',
      'ほとんどの店舗にイートインスペースあり',
      'カップ麺用お湯サーバー設置',
      'カード・現金どちらも利用可能',
      '冷蔵飲料・スナック・冷凍食品販売',
    ],
  },
}

type Brand = {
  name: string
  badgeBg: string
  badgeText: string
  borderColor: string
  cardBg: string
  url: string
  desc: Record<Lang, string>
  feature: Record<Lang, string>
}

const BRANDS: Brand[] = [
  {
    name: 'CU',
    badgeBg: 'bg-purple-600',
    badgeText: 'text-white',
    borderColor: 'border-purple-200',
    cardBg: 'bg-purple-50',
    url: 'https://cu.bgfretail.com/',
    desc: {
      ko: 'BGF리테일 운영. 보라색 간판.',
      en: 'Operated by BGF Retail. Purple signage.',
      zh: 'BGF零售运营，紫色招牌。',
      ja: 'BGFリテール運営。紫色の看板。',
    },
    feature: {
      ko: '베이커리 품목 강함 (뚜레쥬르 계열)',
      en: 'Strong bakery selection (TOUS les JOURS)',
      zh: '烘焙品类丰富（多乐之日系列）',
      ja: 'ベーカリーが充実（トゥレジュール系列）',
    },
  },
  {
    name: 'GS25',
    badgeBg: 'bg-blue-600',
    badgeText: 'text-white',
    borderColor: 'border-blue-200',
    cardBg: 'bg-blue-50',
    url: 'https://gs25.gsretail.com/',
    desc: {
      ko: 'GS리테일 운영. 파란색 간판.',
      en: 'Operated by GS Retail. Blue signage.',
      zh: 'GS零售运营，蓝色招牌。',
      ja: 'GSリテール運営。青い看板。',
    },
    feature: {
      ko: '와인·주류 품목 다양 (와인25 운영)',
      en: 'Wide wine & alcohol selection (Wine25)',
      zh: '葡萄酒及酒类品种丰富（Wine25）',
      ja: 'ワイン・お酒が充実（Wine25運営）',
    },
  },
  {
    name: '세븐일레븐',
    badgeBg: 'bg-red-600',
    badgeText: 'text-white',
    borderColor: 'border-red-200',
    cardBg: 'bg-red-50',
    url: 'https://www.7-eleven.co.kr/',
    desc: {
      ko: '코리아세븐 운영. 빨간·초록 간판.',
      en: 'Operated by Korea Seven. Red & green signage.',
      zh: '韩国7-Eleven运营，红绿色招牌。',
      ja: 'コリアセブン運営。赤・緑の看板。',
    },
    feature: {
      ko: '도시락·즉석식품 품목 강함',
      en: 'Strong ready-to-eat meal selection',
      zh: '便当及即食食品品类丰富',
      ja: '弁当・即席食品が充実',
    },
  },
  {
    name: 'Emart24',
    badgeBg: 'bg-yellow-400',
    badgeText: 'text-gray-900',
    borderColor: 'border-yellow-200',
    cardBg: 'bg-yellow-50',
    url: 'https://emart24.co.kr/',
    desc: {
      ko: '이마트 계열. 노란색 간판.',
      en: 'Part of Emart group. Yellow signage.',
      zh: '易买得集团旗下，黄色招牌。',
      ja: 'イーマート系列。黄色の看板。',
    },
    feature: {
      ko: '신선식품·샐러드 품목 강함',
      en: 'Strong fresh food & salad selection',
      zh: '新鲜食品及沙拉品类丰富',
      ja: '生鮮食品・サラダが充実',
    },
  },
]

export default function CvsBrandsView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {/* 브랜드 카드 */}
        {BRANDS.map((brand) => (
          <div key={brand.name} className={`rounded-2xl border ${brand.borderColor} ${brand.cardBg} p-4 flex gap-4 items-start`}>
            {/* 브랜드 배지 — 클릭 시 공식 홈페이지 이동 */}
            <a href={brand.url} target="_blank" rel="noopener noreferrer"
              className={`${brand.badgeBg} ${brand.badgeText} rounded-xl px-3 py-4 flex items-center justify-center shrink-0 w-28 text-center font-black text-sm leading-tight hover:opacity-80 transition-opacity`}>
              {brand.name}
            </a>
            {/* 설명 */}
            <div className="flex-1 space-y-1">
              <p className="text-sm text-gray-700">{brand.desc[lang]}</p>
              <p className="text-xs text-gray-500">★ {brand.feature[lang]}</p>
            </div>
          </div>
        ))}

        {/* 공통 특징 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-gray-800">{L.commonTitle}</p>
          <ul className="space-y-2">
            {L.commonFeatures.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
