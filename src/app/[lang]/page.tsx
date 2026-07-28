// 언어별 홈 화면 페이지 — /ko, /en, /zh, /ja 로 접근, 검색엔진에 언어별 URL 제공
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LANGS } from '@/lib/langs'
import type { Lang } from '@/lib/types'
import { LangProvider } from '@/context/LangContext'
import HomeScreen from '../HomeScreen'

const VALID_LANGS = LANGS.map(l => l.code)

const METADATA: Record<Lang, { title: string; description: string }> = {
  ko: {
    title: '한국 편의점 이용 가이드 | Korea Convenience Store Guide',
    description: '외국인을 위한 한국 편의점 실전 가이드. 결제 방법, 라면 조리법, 교통카드, 화폐, 할인 정보까지.',
  },
  en: {
    title: 'Korea Convenience Store Guide',
    description: "Real answers for when you're stuck at a Korean convenience store. Payment, ramen cooking, T-money and more.",
  },
  zh: {
    title: '韩国便利店使用指南 | Korea Convenience Store Guide',
    description: '为外国游客准备的韩国便利店实用指南。支付方式、拉面煮法、交通卡、货币、优惠信息。',
  },
  ja: {
    title: '韓国コンビニ利用ガイド | Korea Convenience Store Guide',
    description: '外国人観光客のための韓国コンビニ実践ガイド。支払い方法、ラーメンの作り方、交通カード、通貨、割引情報。',
  },
}

export function generateStaticParams() {
  return VALID_LANGS.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) return {}
  const m = METADATA[lang as Lang]
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `https://www.koreacvsguide.com/${lang}`,
    },
  }
}

export default async function LangHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) notFound()
  return (
    <LangProvider initialLang={lang as Lang}>
      <HomeScreen />
    </LangProvider>
  )
}
