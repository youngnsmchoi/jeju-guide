'use client'
// 한국 편의점 브랜드 소개 — 외국인 여행자용

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, {
  title: string
  subtitle: string
  back: string
  storeCount: string
  source: string
  commonTitle: string
  commonFeatures: string[]
  dataNote: string
}> = {
  ko: {
    title: '편의점 브랜드',
    subtitle: '한국 대표 편의점 4곳',
    back: '← 뒤로',
    storeCount: '매장 수',
    source: '출처',
    commonTitle: '모든 편의점 공통 특징',
    commonFeatures: [
      '24시간 운영 (일부 매장 제외)',
      '라면 취식 공간(이트인) 대부분 보유',
      '컵라면용 온수기 비치',
      '카드·현금 모두 결제 가능',
      '냉장·냉동 식품, 음료, 간식 판매',
    ],
    dataNote: '매장 수는 2025년 기준이며 변동될 수 있습니다.',
  },
  en: {
    title: 'Convenience Store Brands',
    subtitle: '4 major Korean convenience stores',
    back: '← Back',
    storeCount: 'Stores',
    source: 'Source',
    commonTitle: 'What all convenience stores have',
    commonFeatures: [
      'Open 24 hours (most locations)',
      'Eat-in seating area in most stores',
      'Hot water dispenser for cup ramen',
      'Card and cash both accepted',
      'Chilled drinks, snacks, and frozen foods',
    ],
    dataNote: 'Store counts are based on 2025 data and may change.',
  },
  zh: {
    title: '便利店品牌',
    subtitle: '韩国四大连锁便利店',
    back: '← 返回',
    storeCount: '门店数',
    source: '来源',
    commonTitle: '所有便利店共同特点',
    commonFeatures: [
      '24小时营业（部分门店除外）',
      '大多数门店设有堂食区',
      '配备杯面专用热水机',
      '支持刷卡和现金付款',
      '销售冷藏饮料、零食及冷冻食品',
    ],
    dataNote: '门店数据基于2025年，可能有所变动。',
  },
  ja: {
    title: 'コンビニブランド',
    subtitle: '韓国の主要コンビニ4チェーン',
    back: '← 戻る',
    storeCount: '店舗数',
    source: '出典',
    commonTitle: '全コンビニ共通の特徴',
    commonFeatures: [
      '24時間営業（一部店舗を除く）',
      'ほとんどの店舗にイートインスペースあり',
      'カップ麺用お湯サーバー設置',
      'カード・現金どちらも利用可能',
      '冷蔵飲料・スナック・冷凍食品販売',
    ],
    dataNote: '店舗数は2025年基準で、変動する場合があります。',
  },
}

type Brand = {
  name: string
  color: string
  textColor: string
  borderColor: string
  storeCount: Record<Lang, string>
  desc: Record<Lang, string>
  sourceLabel: string
  sourceUrl: string
}

const BRANDS: Brand[] = [
  {
    name: 'CU',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    storeCount: { ko: '약 18,500개', en: 'approx. 18,500', zh: '约18,500家', ja: '約18,500店' },
    desc: {
      ko: '보라색 로고. BGF리테일 운영.',
      en: 'Purple logo. Operated by BGF Retail.',
      zh: '紫色标志，由BGF零售运营。',
      ja: 'パープルロゴ。BGFリテール運営。',
    },
    sourceLabel: 'BGF리테일 공식',
    sourceUrl: 'https://www.bgfretail.com/',
  },
  {
    name: 'GS25',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    storeCount: { ko: '약 18,100개', en: 'approx. 18,100', zh: '约18,100家', ja: '約18,100店' },
    desc: {
      ko: '파란색 로고. GS리테일 운영.',
      en: 'Blue logo. Operated by GS Retail.',
      zh: '蓝色标志，由GS零售运营。',
      ja: 'ブルーロゴ。GSリテール運営。',
    },
    sourceLabel: 'GS리테일 공식',
    sourceUrl: 'https://gs25.gsretail.com/',
  },
  {
    name: '세븐일레븐',
    color: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    storeCount: { ko: '약 11,900개', en: 'approx. 11,900', zh: '约11,900家', ja: '約11,900店' },
    desc: {
      ko: '빨간·초록 로고. 코리아세븐 운영.',
      en: 'Red & green logo. Operated by Korea Seven.',
      zh: '红绿标志，由韩国7-Eleven运营。',
      ja: '赤・緑ロゴ。コリアセブン運営。',
    },
    sourceLabel: '세븐일레븐 공식',
    sourceUrl: 'http://www.7-eleven.co.kr/',
  },
  {
    name: '이마트24',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    storeCount: { ko: '약 5,700개', en: 'approx. 5,700', zh: '约5,700家', ja: '約5,700店' },
    desc: {
      ko: '노란색 로고. 이마트 계열.',
      en: 'Yellow logo. Part of Emart group.',
      zh: '黄色标志，属于易买得集团。',
      ja: 'イエローロゴ。イーマート系列。',
    },
    sourceLabel: '이마트24 공식',
    sourceUrl: 'https://emart24.co.kr/',
  },
]

export default function CvsBrandsView() {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
            <p className="text-xs text-gray-400">{L.subtitle}</p>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        {/* 브랜드 카드 */}
        {BRANDS.map((brand) => (
          <div key={brand.name} className={`rounded-2xl border ${brand.borderColor} ${brand.color} p-4 space-y-2`}>
            <div className="flex items-center justify-between">
              <p className={`text-lg font-bold ${brand.textColor}`}>{brand.name}</p>
              <p className="text-xs text-gray-500">{L.storeCount}: {brand.storeCount[lang]}</p>
            </div>
            <p className="text-sm text-gray-700">{brand.desc[lang]}</p>
            <a href={brand.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs text-gray-400 underline hover:text-gray-600">
              {L.source}: {brand.sourceLabel}
            </a>
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

        {/* 데이터 기준 안내 */}
        <p className="text-xs text-gray-400 text-center pb-2">{L.dataNote}</p>
      </main>
    </div>
  )
}
