'use client'
// 편의점 결제 순서 가이드 — 외국인 여행자용

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

const LABEL: Record<Lang, {
  bagYes: string
  bagNo: string
  expand: string
  warning: string
  warningDesc: string
  cashLink: string
  cashPopup: {
    title: string
    example: string
    bills: string
    give: string
    change: string
    changeAmt: string
    note: string
    close: string
  }
  steps: {
    emoji: string
    title: string
    desc: string
    detail?: string
    tip?: string
    bagButtons?: boolean
    signBox?: boolean
    cashGuide?: boolean
  }[]
}> = {
  en: {
    bagYes: '봉투 주세요 (Yes, a bag please)',
    bagNo: '봉투 필요 없어요 (No bag, thanks)',
    expand: 'Show',
    warning: '⚠️ Do not eat before paying',
    warningDesc: 'All items must be paid for before consuming.',
    cashLink: '💵 How to use Korean cash →',
    cashPopup: {
      title: '💵 Korean Cash Guide',
      example: 'Example total: ₩23,600',
      bills: 'Hand the cashier:',
      give: '💴 ₩10,000 × 3 bills',
      change: 'You get back:',
      changeAmt: '💰 ₩6,400',
      note: 'Cashier will give you the change. Just hand over the bills and wait.',
      close: 'Close',
    },
    steps: [
      {
        emoji: '🛒', title: 'Pick your items',
        desc: 'Choose what you want from the shelves.',
      },
      {
        emoji: '🧾', title: 'Bring to the counter',
        desc: 'Hand your items to the cashier.',
      },
      {
        emoji: '🛍️', title: 'Bag question — say this first',
        desc: 'Tell the cashier before they start scanning. Bags are sold separately (₩100 each).',
        tip: 'Show the phrase on the screen — no need to speak.',
        bagButtons: true,
      },
      {
        emoji: '📱', title: 'Barcode scanning',
        desc: 'The cashier scans your items.',
      },
      {
        emoji: '💳', title: 'Pay',
        desc: 'Card or cash — both accepted.',
        detail: '🇰🇷 Korean card — no signature needed under ₩50,000.',
        tip: 'When the signature pad appears, sign it. Foreign cards almost always require a signature.',
        signBox: true,
        cashGuide: true,
      },
    ],
  },
  ko: {
    bagYes: '봉투 주세요',
    bagNo: '봉투 필요 없어요',
    expand: '확대',
    warning: '⚠️ 결제 전 섭취 금지',
    warningDesc: '모든 상품은 결제 후에만 섭취 가능합니다.',
    cashLink: '💵 한국 현금 사용법 →',
    cashPopup: {
      title: '💵 한국 현금 안내',
      example: '예시 금액: ₩23,600',
      bills: '점원에게 건네기',
      give: '💴 만원 × 3장',
      change: '거스름돈 받기',
      changeAmt: '💰 6,400원',
      note: '점원이 거스름돈을 돌려줍니다. 지폐만 건네고 기다리면 됩니다.',
      close: '닫기',
    },
    steps: [
      {
        emoji: '🛒', title: '상품 고르기',
        desc: '진열대에서 원하는 상품을 고르세요.',
      },
      {
        emoji: '🧾', title: '계산대로 이동',
        desc: '점원에게 물건을 건네세요.',
      },
      {
        emoji: '🛍️', title: '봉투 여부 먼저 말하기',
        desc: '바코드 찍기 전에 봉투 필요 여부를 말하세요. 봉투는 별도 상품으로 먼저 스캔합니다. (1개 100원)',
        tip: '화면 문구를 보여주면 말 안 해도 됩니다.',
        bagButtons: true,
      },
      {
        emoji: '📱', title: '바코드 스캔',
        desc: '점원이 상품 바코드를 스캔합니다.',
      },
      {
        emoji: '💳', title: '결제',
        desc: '카드 또는 현금 모두 가능합니다.',
        detail: '🇰🇷 한국 카드 — 5만원 이하 서명 생략',
        tip: '서명 패드가 나오면 바로 서명하세요. 외국 카드는 거의 항상 서명을 요청합니다.',
        signBox: true,
        cashGuide: true,
      },
    ],
  },
  zh: {
    bagYes: '봉투 주세요（需要袋子）',
    bagNo: '봉투 필요 없어요（不需要袋子）',
    expand: '放大',
    warning: '⚠️ 付款前请勿食用',
    warningDesc: '所有商品必须付款后才能食用。',
    cashLink: '💵 韩元现金使用指南 →',
    cashPopup: {
      title: '💵 韩元现金指南',
      example: '示例金额：₩23,600',
      bills: '递给收银员：',
      give: '💴 ₩10,000 × 3张',
      change: '找零：',
      changeAmt: '💰 ₩6,400',
      note: '收银员会找零给您。只需递上纸币等待即可。',
      close: '关闭',
    },
    steps: [
      {
        emoji: '🛒', title: '选择商品',
        desc: '从货架上挑选您想要的商品。',
      },
      {
        emoji: '🧾', title: '拿到收银台',
        desc: '将商品递给收银员。',
      },
      {
        emoji: '🛍️', title: '先说袋子问题',
        desc: '在扫描商品前，告知是否需要袋子。袋子作为商品单独扫描。(每个100韩元)',
        tip: '出示屏幕上的短语即可，无需开口说话。',
        bagButtons: true,
      },
      {
        emoji: '📱', title: '扫描条码',
        desc: '收银员扫描您的商品。',
      },
      {
        emoji: '💳', title: '付款',
        desc: '支持刷卡和现金付款。',
        detail: '🇰🇷 韩国卡 — 5万韩元以下免签名',
        tip: '签名板出现时请直接签名。外国卡几乎都需要签名。',
        signBox: true,
        cashGuide: true,
      },
    ],
  },
  ja: {
    bagYes: '봉투 주세요（袋をください）',
    bagNo: '봉투 필요 없어요（袋は不要です）',
    expand: '拡大',
    warning: '⚠️ 会計前の飲食禁止',
    warningDesc: 'すべての商品はお会計後にのみお召し上がりください。',
    cashLink: '💵 韓国現金の使い方 →',
    cashPopup: {
      title: '💵 韓国現金ガイド',
      example: '例：₩23,600',
      bills: 'レジ係に渡す：',
      give: '💴 ₩10,000 × 3枚',
      change: 'おつり：',
      changeAmt: '💰 ₩6,400',
      note: 'レジ係がおつりを返してくれます。お札を渡して待つだけ。',
      close: '閉じる',
    },
    steps: [
      {
        emoji: '🛒', title: '商品を選ぶ',
        desc: '棚から欲しい商品を選んでください。',
      },
      {
        emoji: '🧾', title: 'レジへ持っていく',
        desc: '店員に商品を渡してください。',
      },
      {
        emoji: '🛍️', title: '先に袋の有無を伝える',
        desc: 'スキャン前に袋が必要かどうかを伝えてください。袋は商品として先にスキャンします。(1枚100ウォン)',
        tip: '画面のフレーズを見せるだけでOKです。',
        bagButtons: true,
      },
      {
        emoji: '📱', title: 'バーコードスキャン',
        desc: '店員が商品をスキャンします。',
      },
      {
        emoji: '💳', title: 'お支払い',
        desc: 'カードも現金も使えます。',
        detail: '🇰🇷 韓国カード — 5万ウォン以下はサイン不要',
        tip: 'サインパッドが出たらすぐにサインを。海外カードはほぼ必ずサインが求められます。',
        signBox: true,
        cashGuide: true,
      },
    ],
  },
}

type OverlayType = 'bag-yes' | 'bag-no' | 'cash' | null

export default function PaymentView() {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [overlay, setOverlay] = useState<OverlayType>(null)

  const bagYesText = L.bagYes
  const bagNoText = L.bagNo

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-20 space-y-3">

        {L.steps.map((step, i) => (
          <div key={i} className={`bg-white rounded-2xl border p-4 space-y-3
            ${step.bagButtons ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-gray-100'}`}>

            {/* 단계 헤더 */}
            <div className="flex gap-3 items-start">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                ${step.bagButtons ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{step.emoji} {step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>

            {/* 봉투 버튼 */}
            {step.bagButtons && (
              <div className="space-y-2 pl-10">
                {([['bag-yes', bagYesText], ['bag-no', bagNoText]] as const).map(([key, text]) => (
                  <div key={key} className="bg-emerald-50 rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">{text}</p>
                    <button onClick={() => setOverlay(key)}
                      className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                      {L.expand}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 결제 상세 (카드 서명 안내) */}
            {step.detail && (
              <div className="pl-10 space-y-1.5">
                {step.detail.split('\n').map((line, li) => (
                  <p key={li} className="text-xs text-blue-700 leading-relaxed">{line}</p>
                ))}
              </div>
            )}

            {/* 현금 안내 링크 */}
            {step.cashGuide && (
              <div className="pl-10">
                <button
                  onClick={() => setOverlay('cash')}
                  className="text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                  {L.cashLink}
                </button>
              </div>
            )}

            {/* 팁 */}
            {step.tip && (
              <div className="pl-10">
                {step.signBox ? (
                  <>
                    <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 mb-2">
                      <p className="text-sm font-bold text-amber-800">✍️ {step.tip}</p>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                      <Image src="/card-reader.png" alt="card reader" width={200} height={130} className="object-contain mix-blend-multiply" />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-emerald-600 font-medium">💡 {step.tip}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 주의사항 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-red-700">{L.warning}</p>
          <p className="text-xs text-red-500 mt-1">{L.warningDesc}</p>
        </div>

      </main>

      {/* 봉투 문구 오버레이 */}
      {(overlay === 'bag-yes' || overlay === 'bag-no') && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8"
          onClick={() => setOverlay(null)}>
          <p className="text-5xl font-bold text-gray-900 text-center leading-tight">
            {overlay === 'bag-yes' ? bagYesText : bagNoText}
          </p>
          <button onClick={() => setOverlay(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl hover:bg-gray-200">
            ✕
          </button>
        </div>
      )}

      {/* 현금 안내 팝업 */}
      {overlay === 'cash' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          onClick={() => setOverlay(null)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg px-6 pt-6 pb-10 space-y-5"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">{L.cashPopup.title}</p>
              <button onClick={() => setOverlay(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-200">
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl px-5 py-4 space-y-4">
              <p className="text-sm font-semibold text-gray-700">{L.cashPopup.example}</p>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">{L.cashPopup.bills}</p>
                <p className="text-2xl font-bold text-gray-900">{L.cashPopup.give}</p>
                <div className="flex gap-1 pt-1">
                  {['💴', '💴', '💴'].map((bill, i) => (
                    <span key={i} className="text-3xl">{bill}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-1">
                <p className="text-xs text-gray-500 font-medium">{L.cashPopup.change}</p>
                <p className="text-2xl font-bold text-emerald-600">{L.cashPopup.changeAmt}</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed text-center">{L.cashPopup.note}</p>

            <button onClick={() => setOverlay(null)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors">
              {L.cashPopup.close}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
