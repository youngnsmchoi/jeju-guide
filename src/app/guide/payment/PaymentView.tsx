'use client'
// 편의점 결제 4단계 가이드 — 외국인 여행자용

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, {
  title: string
  subtitle: string
  back: string
  steps: { emoji: string; title: string; desc: string }[]
  bagTitle: string
  bagNote: string
  bagNote2: string
  bagYes: string
  bagNo: string
  bagExpand: string
  signTitle: string
  signKorean: string
  signForeign: string
  signTip: string
  warning: string
  warningDesc: string
}> = {
  en: {
    title: 'How to Pay',
    subtitle: 'At a Korean convenience store',
    back: '← Back',
    steps: [
      { emoji: '🛒', title: 'Pick your items', desc: 'Choose what you want from the shelves.' },
      { emoji: '🧾', title: 'Bring to the counter', desc: 'Hand your items to the cashier.' },
      { emoji: '🛍️', title: 'Bag question', desc: 'Show the cashier the phrase below before they start scanning.' },
      { emoji: '💳', title: 'Pay', desc: 'Card or cash — both are accepted.' },
    ],
    bagTitle: 'Bag — show this before scanning',
    bagNote: 'Show this when handing over your items.',
    bagNote2: 'Bags are sold as a product — scanned and added to your total. (₩100 each)',
    bagYes: '봉투 주세요 (Yes, a bag please)',
    bagNo: '봉투 필요 없어요 (No bag, thanks)',
    bagExpand: 'Show',
    signTitle: '✍️ Signature guide for foreign cards',
    signKorean: '🇰🇷 Korean card — no signature needed under ₩50,000',
    signForeign: '🌏 Foreign card — signature may be requested regardless of amount',
    signTip: 'If asked, simply sign on the pad naturally.',
    warning: '⚠️ Do not eat before paying',
    warningDesc: 'All items must be paid for before consuming. Opening or eating before payment is not allowed.',
  },
  ko: {
    title: '결제 방법',
    subtitle: '편의점 이용 가이드',
    back: '← 뒤로',
    steps: [
      { emoji: '🛒', title: '상품 고르기', desc: '진열대에서 원하는 상품을 고르세요.' },
      { emoji: '🧾', title: '계산대로 전달', desc: '점원에게 물건을 건네세요.' },
      { emoji: '🛍️', title: '봉투 여부 확인', desc: '상품 바코드를 찍기 전에 아래 문구를 점원에게 보여주세요.' },
      { emoji: '💳', title: '결제', desc: '카드 또는 현금 모두 가능합니다.' },
    ],
    bagTitle: '봉투 — 바코드 찍기 전에 보여주세요',
    bagNote: '상품을 건네기 전에 보여주세요.',
    bagNote2: '봉투도 상품으로 먼저 스캔합니다. (1개 100원)',
    bagYes: '봉투 주세요',
    bagNo: '봉투 필요 없어요',
    bagExpand: '확대',
    signTitle: '✍️ 해외 카드 서명 안내',
    signKorean: '🇰🇷 한국 카드 — 5만원 이하 서명 생략',
    signForeign: '🌏 해외 카드 — 금액과 관계없이 서명 요청 받을 수 있음',
    signTip: '점원이 요청하면 패드에 자연스럽게 서명하세요.',
    warning: '⚠️ 결제 전 섭취 금지',
    warningDesc: '모든 상품은 결제 후에만 섭취 가능합니다.',
  },
  zh: {
    title: '如何付款',
    subtitle: '便利店使用指南',
    back: '← 返回',
    steps: [
      { emoji: '🛒', title: '选择商品', desc: '从货架上挑选您想要的商品。' },
      { emoji: '🧾', title: '拿到收银台', desc: '将商品递给收银员。' },
      { emoji: '🛍️', title: '袋子问题', desc: '在收银员扫描商品前，出示下方短语。' },
      { emoji: '💳', title: '付款', desc: '支持刷卡和现金付款。' },
    ],
    bagTitle: '袋子 — 扫描前出示给收银员',
    bagNote: '递给收银员商品前先出示。',
    bagNote2: '袋子也是商品，需要先扫描。(每个100韩元)',
    bagYes: '봉투 주세요（需要袋子）',
    bagNo: '봉투 필요 없어요（不需要袋子）',
    bagExpand: '放大',
    signTitle: '✍️ 海外卡签名说明',
    signKorean: '🇰🇷 韩国卡 — 5万韩元以下免签名',
    signForeign: '🌏 海外卡 — 无论金额多少都可能需要签名',
    signTip: '收银员要求时，在签名板上自然签名即可。',
    warning: '⚠️ 付款前请勿食用',
    warningDesc: '所有商品必须付款后才能食用，付款前不得拆封或食用。',
  },
  ja: {
    title: 'お会計の方法',
    subtitle: 'コンビニ利用ガイド',
    back: '← 戻る',
    steps: [
      { emoji: '🛒', title: '商品を選ぶ', desc: '棚から欲しい商品を選んでください。' },
      { emoji: '🧾', title: 'レジへ持っていく', desc: '店員に商品を渡してください。' },
      { emoji: '🛍️', title: '袋の確認', desc: '商品をスキャンする前に、下のフレーズを店員に見せてください。' },
      { emoji: '💳', title: 'お支払い', desc: 'カードも現金も使えます。' },
    ],
    bagTitle: '袋 — スキャン前に見せてください',
    bagNote: '商品を渡す前に見せてください。',
    bagNote2: '袋も商品として先にスキャンします。(1枚100ウォン)',
    bagYes: '봉투 주세요（袋をください）',
    bagNo: '봉투 필요 없어요（袋は不要です）',
    bagExpand: '拡大',
    signTitle: '✍️ 海外カードのサイン案内',
    signKorean: '🇰🇷 韓国カード — 5万ウォン以下はサイン不要',
    signForeign: '🌏 海外カード — 金額に関わらずサインを求められる場合あり',
    signTip: '店員に求められたら、パッドに自然にサインしてください。',
    warning: '⚠️ 会計前の飲食禁止',
    warningDesc: 'すべての商品はお会計後にのみお召し上がりください。会計前の開封・飲食はできません。',
  },
}

export default function PaymentView() {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]
  const [overlay, setOverlay] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
            <p className="text-xs text-gray-400">{L.subtitle}</p>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">
        {/* 4단계 */}
        {L.steps.map((step, i) => (
          <div key={i} className={`bg-white rounded-2xl border p-4 flex gap-4 items-start
            ${i === 2 ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-gray-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
              ${i === 2 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{step.emoji} {step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}

        {/* 봉투 문구 카드 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-bold text-emerald-800">{L.bagTitle}</p>
          <p className="text-xs text-emerald-700 font-medium">{L.bagNote}</p>
          <p className="text-xs text-emerald-600">{L.bagNote2}</p>
          <BagButton text={L.bagYes} expandLabel={L.bagExpand} onExpand={() => setOverlay(L.bagYes)} />
          <BagButton text={L.bagNo} expandLabel={L.bagExpand} onExpand={() => setOverlay(L.bagNo)} />
        </div>

        {/* 서명 안내 박스 */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-bold text-blue-800">{L.signTitle}</p>
          <div className="space-y-1.5">
            <p className="text-xs text-blue-700">{L.signKorean}</p>
            <p className="text-xs text-blue-700">{L.signForeign}</p>
          </div>
          <p className="text-xs text-blue-500">{L.signTip}</p>
          <div className="rounded-xl overflow-hidden bg-white flex items-center justify-center p-2">
            <Image src="/card-reader.png" alt="card reader" width={240} height={160} className="object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-red-700">{L.warning}</p>
          <p className="text-xs text-red-500 mt-1">{L.warningDesc}</p>
        </div>
      </main>

      {/* 전체화면 오버레이 */}
      {overlay && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8"
          onClick={() => setOverlay(null)}>
          <p className="text-5xl font-bold text-gray-900 text-center leading-tight">{overlay}</p>
          <button
            onClick={() => setOverlay(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl hover:bg-gray-200">
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

function BagButton({ text, expandLabel, onExpand }: {
  text: string
  expandLabel: string
  onExpand: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-gray-900">{text}</p>
      <button onClick={onExpand}
        className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
        {expandLabel}
      </button>
    </div>
  )
}
