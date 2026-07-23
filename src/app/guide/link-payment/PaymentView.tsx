'use client'
// 편의점 결제 순서 가이드 — 외국인 여행자용

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import ReceiptSamples from './ReceiptSamples'

type BillBreakdown = { fiftyK: number; tenK: number; fiveK: number; oneK: number; paid: number; change: number }

function makeBreakdown(total: number, fiftyK: number, tenK: number, fiveK: number, oneK: number): BillBreakdown {
  const paid = fiftyK * 50000 + tenK * 10000 + fiveK * 5000 + oneK * 1000
  return { fiftyK, tenK, fiveK, oneK, paid, change: paid - total }
}

// 권종별로 어떤 지폐를 갖고 있을지 상황이 다르므로, 4가지 조합을 모두 계산해 사용자가 고르게 함
function calcBillOptions(total: number) {
  const rounded = Math.floor(total / 100) * 100

  // 1. 오만원 위주
  const fiftyKOnly = Math.ceil(rounded / 50000)

  // 2. 만원 위주 (오만원 없음)
  const tenKOnly = Math.ceil(rounded / 10000)

  // 3. 전 권종으로 딱 맞게 (오만원+만원+오천원+천원)
  const fiftyK = Math.floor(rounded / 50000)
  const afterFiftyK = rounded - fiftyK * 50000
  const tenK = Math.floor(afterFiftyK / 10000)
  const afterTenK = afterFiftyK - tenK * 10000
  const fiveK = afterTenK >= 5000 ? 1 : 0
  const afterFiveK = afterTenK - fiveK * 5000
  const oneK = Math.ceil(afterFiveK / 1000)

  // 4. 오천원 없이 딱 맞게 (오만원+만원+천원만)
  const oneKNoFiveK = Math.ceil(afterTenK / 1000)

  return [
    makeBreakdown(total, fiftyKOnly, 0, 0, 0),
    makeBreakdown(total, 0, tenKOnly, 0, 0),
    makeBreakdown(total, fiftyK, tenK, fiveK, oneK),
    makeBreakdown(total, fiftyK, tenK, 0, oneKNoFiveK),
  ]
}

const LABEL: Record<Lang, {
  bagYes: string
  bagNo: string
  expand: string
  warning: string
  warningDesc: string
  receiptLabel: string
  receiptYes: string
  receiptSampleTitle: string
  onePlusOneLink: string
  moneyGuideLink: string
  cashOnlyNote: string
  cashLink: string
  discountTranslate: {
    title: string
    body: string[]
    guideNote: string
  }
  cashPopup: {
    title: string
    inputLabel: string
    inputPlaceholder: string
    chooseLabel: string
    give: string
    change: string
    bill50k: string
    bill10k: string
    bill5k: string
    bill1k: string
    note: string
    close: string
    empty: string
    unit: string
  }
  steps: {
    emoji: string
    title: string
    desc: string
    detail?: string
    tip?: string
    bagButtons?: boolean
    signBox?: boolean
    receiptButton?: boolean
    receiptSample?: boolean
    cashGuide?: boolean
    onePlusOne?: boolean
    moneyGuide?: boolean
    discountTranslate?: boolean
  }[]
}> = {
  en: {
    bagYes: '봉투 주세요 (Yes, a bag please)',
    bagNo: '봉투 필요 없어요 (No bag, thanks)',
    expand: 'Show',
    warning: '⚠️ Do not eat before paying',
    warningDesc: 'All items must be paid for before consuming — including pouring hot water into your cup ramen.',
    receiptLabel: 'Ask for a receipt and check it',
    receiptYes: 'Receipt, please',
    receiptSampleTitle: '🧾 How to read a Korean receipt',
    cashOnlyNote: '💵 Paid in cash? Use the calculator below to check your change.',
    onePlusOneLink: '🏷️ How to Save (1+1 / 2+1 deals) →',
    moneyGuideLink: '💵 Korean Money Guide →',
    cashLink: '💵 How to use Korean cash →',
    discountTranslate: {
      title: '🗣️ The cashier may ask you something about a discount',
      body: [
        'If an item is a 1+1 / 2+1 deal but the quantity doesn\'t match, the cashier will check with you before scanning.',
        'You don\'t need to understand Korean — turn on a translation app\'s voice/conversation mode (like Papago or Google Translate) beforehand so you can respond in real time.',
        'If you hear words like "discount," "1+1," or "one more," it\'s almost always about this.',
      ],
      guideNote: '💡 Before you check out, it also helps to look at "How to Save" and "How to read a Korean receipt" below.',
    },
    cashPopup: {
      title: '💵 Korean Cash Guide',
      inputLabel: 'Enter the total on the register',
      inputPlaceholder: 'e.g. 23600',
      chooseLabel: 'Choose one of 4 ways to pay',
      give: 'Hand the cashier:',
      change: 'You get back:',
      bill50k: '50,000 KRW',
      bill10k: '10,000 KRW',
      bill5k: '5,000 KRW',
      bill1k: '1,000 KRW',
      note: 'Cashier will give you the change. Just hand over the bills and wait.',
      close: 'Close',
      empty: 'Enter the amount shown on the register screen.',
      unit: ' KRW',
    },
    steps: [
      {
        emoji: '🛒', title: 'Pick items & bring to the counter',
        desc: 'Choose what you want and hand it to the cashier.',
        onePlusOne: true,
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
        discountTranslate: true,
      },
      {
        emoji: '💳', title: 'Pay',
        desc: 'Card or cash — both accepted.',
        detail: '🌍 Foreign cards — Visa·Mastercard usually work, signature required.\n(Korean cards: no signature needed under ₩50,000)',
        tip: 'When the signature pad appears, sign it.',
        signBox: true,
        receiptButton: true,
        receiptSample: true,
        cashGuide: true,
        moneyGuide: true,
      },
    ],
  },
  ko: {
    bagYes: '봉투 주세요',
    bagNo: '봉투 필요 없어요',
    expand: '확대',
    warning: '⚠️ 결제 전 섭취 금지',
    warningDesc: '모든 상품은 결제 후에만 섭취 가능합니다. 컵라면에 물 붓기 전에도 반드시 계산부터 하세요.',
    receiptLabel: '영수증을 받아서 확인하세요',
    receiptYes: '영수증 주세요',
    receiptSampleTitle: '🧾 한국 영수증 읽는 법',
    cashOnlyNote: '💵 현금으로 내셨다면, 아래 계산기로 거스름돈이 맞는지 확인해보세요.',
    onePlusOneLink: '🏷️ 할인 득템법 (1+1·2+1) →',
    moneyGuideLink: '💵 한국 돈 안내 →',
    cashLink: '💵 한국 현금 사용법 →',
    discountTranslate: {
      title: '🗣️ 점원이 할인 관련해서 말을 걸 수 있어요',
      body: [
        '1+1·2+1 할인 상품인데 개수가 맞지 않으면, 점원이 스캔 전에 확인 차 말을 겁니다.',
        '한국어를 몰라도 괜찮습니다 — 계산 전에 번역 앱(파파고, 구글 번역 등)의 음성·대화 모드를 미리 켜두면 실시간으로 대응할 수 있습니다.',
        '"할인", "1+1", "하나 더" 같은 단어가 들리면 대부분 이 상황입니다.',
      ],
      guideNote: '💡 계산 전에 아래 "할인 득템법"과 "한국 영수증 읽는 법"도 참고하면 도움이 됩니다.',
    },
    cashPopup: {
      title: '💵 한국 현금 안내',
      inputLabel: 'POS 화면 금액을 입력하세요',
      inputPlaceholder: '예) 23600',
      chooseLabel: '4가지 방법 중 선택하세요',
      give: '점원에게 건네기',
      change: '거스름돈',
      bill50k: '오만원',
      bill10k: '만원',
      bill5k: '오천원',
      bill1k: '천원',
      note: '점원이 거스름돈을 돌려줍니다. 지폐만 건네고 기다리면 됩니다.',
      close: '닫기',
      empty: 'POS 화면에 표시된 금액을 입력하세요.',
      unit: '원',
    },
    steps: [
      {
        emoji: '🛒', title: '상품 고르고 계산대로',
        desc: '진열대에서 원하는 상품을 고른 뒤 점원에게 건네세요.',
        onePlusOne: true,
      },
      {
        emoji: '🛍️', title: '봉투 여부 먼저 말하기',
        desc: '바코드 찍기 전에 봉투 필요 여부를 말하세요. 점원이 봉투도 바코드를 찍어서 같이 계산해드립니다. (1개 100원)',
        tip: '화면 문구를 보여주면 말 안 해도 됩니다.',
        bagButtons: true,
      },
      {
        emoji: '📱', title: '바코드 스캔',
        desc: '점원이 상품 바코드를 스캔합니다.',
        discountTranslate: true,
      },
      {
        emoji: '💳', title: '결제',
        desc: '카드 또는 현금 모두 가능합니다.',
        detail: '🌍 외국 카드 — Visa·Mastercard 대부분 가능, 서명 필요\n(한국 카드는 5만원 이하 서명 생략)',
        tip: '서명 패드가 나오면 바로 서명하세요.',
        signBox: true,
        receiptButton: true,
        receiptSample: true,
        cashGuide: true,
        moneyGuide: true,
      },
    ],
  },
  zh: {
    bagYes: '봉투 주세요（需要袋子）',
    bagNo: '봉투 필요 없어요（不需要袋子）',
    expand: '放大',
    warning: '⚠️ 付款前请勿食用',
    warningDesc: '所有商品必须付款后才能食用。往杯面里倒热水前也一定要先结账。',
    receiptLabel: '请索要收据并确认',
    receiptYes: '请给我收据',
    receiptSampleTitle: '🧾 韩国收据阅读方法',
    cashOnlyNote: '💵 如果用现金支付，请用下方计算器确认找零是否正确。',
    onePlusOneLink: '🏷️ 优惠攻略 (1+1·2+1) →',
    moneyGuideLink: '💵 韩元指南 →',
    cashLink: '💵 韩元现金使用指南 →',
    discountTranslate: {
      title: '🗣️ 收银员可能会就折扣询问您',
      body: [
        '如果商品是1+1·2+1优惠，但数量不符，收银员会在扫码前向您确认。',
        '不懂韩语也没关系——结账前请提前打开翻译应用（如Papago、谷歌翻译）的语音/对话模式，即可实时沟通。',
        '如果听到"折扣"、"1+1"、"再拿一个"之类的词，基本都是这种情况。',
      ],
      guideNote: '💡 结账前，参考下方的"优惠攻略"和"韩国收据阅读方法"也会有帮助。',
    },
    cashPopup: {
      title: '💵 韩元现金指南',
      inputLabel: '请输入收银台显示的金额',
      inputPlaceholder: '例如 23600',
      chooseLabel: '请选择以下4种支付方式之一',
      give: '递给收银员：',
      change: '找零：',
      bill50k: '50,000 KRW',
      bill10k: '10,000 KRW',
      bill5k: '5,000 KRW',
      bill1k: '1,000 KRW',
      note: '收银员会找零给您。只需递上纸币等待即可。',
      close: '关闭',
      empty: '请输入收银台屏幕上显示的金额。',
      unit: ' KRW',
    },
    steps: [
      {
        emoji: '🛒', title: '选好商品，拿到收银台',
        desc: '从货架上挑选您想要的商品并递给收银员。',
        onePlusOne: true,
      },
      {
        emoji: '🛍️', title: '先说袋子问题',
        desc: '在扫描商品前，告知是否需要袋子。收银员会把袋子也一起扫码计入总价。(每个100韩元)',
        tip: '出示屏幕上的短语即可，无需开口说话。',
        bagButtons: true,
      },
      {
        emoji: '📱', title: '扫描条码',
        desc: '收银员扫描您的商品。',
        discountTranslate: true,
      },
      {
        emoji: '💳', title: '付款',
        desc: '支持刷卡和现金付款。',
        detail: '🌍 外国卡 — Visa·Mastercard 大多可用，需要签名\n（韩国卡5万韩元以下免签名）',
        tip: '签名板出现时请直接签名。',
        signBox: true,
        receiptButton: true,
        receiptSample: true,
        cashGuide: true,
        moneyGuide: true,
      },
    ],
  },
  ja: {
    bagYes: '봉투 주세요（袋をください）',
    bagNo: '봉투 필요 없어요（袋は不要です）',
    expand: '拡大',
    warning: '⚠️ 会計前の飲食禁止',
    warningDesc: 'すべての商品はお会計後にのみお召し上がりください。カップ麺にお湯を注ぐ前も必ずお会計を。',
    receiptLabel: 'レシートをもらって確認しましょう',
    receiptYes: 'レシートください',
    receiptSampleTitle: '🧾 韓国のレシートの読み方',
    cashOnlyNote: '💵 現金で支払った場合は、下の計算機でおつりが合っているか確認してください。',
    onePlusOneLink: '🏷️ お得な買い方 (1+1・2+1) →',
    moneyGuideLink: '💵 韓国のお金ガイド →',
    cashLink: '💵 韓国現金の使い方 →',
    discountTranslate: {
      title: '🗣️ 店員が割引について話しかけてくることがあります',
      body: [
        '1+1・2+1対象商品なのに個数が合わない場合、店員がスキャン前に確認のため話しかけます。',
        '韓国語がわからなくても大丈夫です。会計前に翻訳アプリ（Papago、Google翻訳など）の音声・会話モードをオンにしておけば、リアルタイムでやり取りできます。',
        '「割引」「1+1」「もう1つ」といった言葉が聞こえたら、たいていこの状況です。',
      ],
      guideNote: '💡 会計前に、下記の「お得な買い方」と「韓国のレシートの読み方」も参考にすると役立ちます。',
    },
    cashPopup: {
      title: '💵 韓国現金ガイド',
      inputLabel: 'レジ画面の金額を入力してください',
      inputPlaceholder: '例）23600',
      chooseLabel: '4つの支払い方法から選んでください',
      give: 'レジ係に渡す：',
      change: 'おつり：',
      bill50k: '50,000 KRW',
      bill10k: '10,000 KRW',
      bill5k: '5,000 KRW',
      bill1k: '1,000 KRW',
      note: 'レジ係がおつりを返してくれます。お札を渡して待つだけ。',
      close: '閉じる',
      empty: 'レジ画面に表示された金額を入力してください。',
      unit: ' KRW',
    },
    steps: [
      {
        emoji: '🛒', title: '商品を選んでレジへ',
        desc: '棚から欲しい商品を選び、店員に渡してください。',
        onePlusOne: true,
      },
      {
        emoji: '🛍️', title: '先に袋の有無を伝える',
        desc: 'スキャン前に袋が必要かどうかを伝えてください。店員が袋もスキャンして一緒に会計します。(1枚100ウォン)',
        tip: '画面のフレーズを見せるだけでOKです。',
        bagButtons: true,
      },
      {
        emoji: '📱', title: 'バーコードスキャン',
        desc: '店員が商品をスキャンします。',
        discountTranslate: true,
      },
      {
        emoji: '💳', title: 'お支払い',
        desc: 'カードも現金も使えます。',
        detail: '🌍 海外カード — Visa・Mastercardはほぼ使用可、サイン必要\n（韓国カードは5万ウォン以下サイン不要）',
        tip: 'サインパッドが出たらすぐにサインを。',
        signBox: true,
        receiptButton: true,
        receiptSample: true,
        cashGuide: true,
        moneyGuide: true,
      },
    ],
  },
}

type OverlayType = 'bag-yes' | 'bag-no' | 'receipt' | 'cash' | null

export default function PaymentView() {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [overlay, setOverlay] = useState<OverlayType>(null)
  const [posInput, setPosInput] = useState('')

  const posAmount = parseInt(posInput.replace(/,/g, ''), 10)
  const billOptions = !isNaN(posAmount) && posAmount > 0 ? calcBillOptions(posAmount) : null

  const bagYesText = L.bagYes
  const bagNoText = L.bagNo

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-3">

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

            {/* 할인 득템법 링크 */}
            {step.onePlusOne && (
              <div className="pl-10">
                <Link href="/guide/convenience-store-1plus1"
                  className="text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                  {L.onePlusOneLink}
                </Link>
              </div>
            )}

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

            {/* 한국 돈 안내 링크 */}
            {step.moneyGuide && (
              <div className="pl-10">
                <Link href="/guide/link-money"
                  className="text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                  {L.moneyGuideLink}
                </Link>
              </div>
            )}

            {/* 할인 확인 시 점원과의 대화 — 번역 앱 안내 */}
            {step.discountTranslate && (
              <div className="pl-10 space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5">
                  <p className="text-xs font-bold text-blue-800">{L.discountTranslate.title}</p>
                  {L.discountTranslate.body.map((line, li) => (
                    <p key={li} className="text-xs text-blue-700 leading-relaxed">{line}</p>
                  ))}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{L.discountTranslate.guideNote}</p>
                <Link href="/guide/convenience-store-1plus1"
                  className="block text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                  {L.onePlusOneLink}
                </Link>
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

            {/* 영수증 요청 버튼 */}
            {step.receiptButton && (
              <div className="pl-10 space-y-2">
                <p className="text-xs text-gray-500 font-medium">{L.receiptLabel}</p>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">{L.receiptYes}</p>
                  <button onClick={() => setOverlay('receipt')}
                    className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                    {L.expand}
                  </button>
                </div>
              </div>
            )}

            {/* 샘플 영수증 */}
            {step.receiptSample && (
              <div className="pl-10 space-y-2">
                <p className="text-xs font-bold text-gray-700">{L.receiptSampleTitle}</p>
                <ReceiptSamples lang={lang} />
              </div>
            )}

            {/* 현금 안내 링크 (현금 결제자 전용) */}
            {step.cashGuide && (
              <div className="pl-10 space-y-1.5">
                <p className="text-xs text-gray-500 leading-relaxed">{L.cashOnlyNote}</p>
                <button
                  onClick={() => setOverlay('cash')}
                  className="text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                  {L.cashLink}
                </button>
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

      {/* 영수증 문구 오버레이 */}
      {overlay === 'receipt' && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8"
          onClick={() => setOverlay(null)}>
          <p className="text-5xl font-bold text-gray-900 text-center leading-tight">
            {L.receiptYes}
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
          <div className="bg-white rounded-t-3xl w-full max-w-lg px-6 pt-6 pb-10 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">{L.cashPopup.title}</p>
              <button onClick={() => setOverlay(null)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm hover:bg-gray-300 transition-colors">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">{L.cashPopup.inputLabel}</label>
              <input
                type="number"
                value={posInput}
                onChange={e => setPosInput(e.target.value)}
                placeholder={L.cashPopup.inputPlaceholder}
                className="w-full text-2xl font-bold text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 outline-none focus:border-emerald-400"
              />
            </div>

            {billOptions ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-bold text-gray-500">{L.cashPopup.chooseLabel}</p>
                  <p className="text-xs font-bold text-gray-400">{L.cashPopup.change}</p>
                </div>

                {billOptions.map((b, i) => (
                  <div key={i} className="bg-white rounded-xl border-2 border-gray-200 pl-3 pr-4 py-2.5 flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>

                    <div className="flex-1 flex flex-wrap gap-x-2 gap-y-0.5 min-w-0">
                      {b.fiftyK > 0 && (
                        <p className="text-sm font-bold text-gray-900">{L.cashPopup.bill50k} × {b.fiftyK}</p>
                      )}
                      {b.tenK > 0 && (
                        <p className="text-sm font-bold text-gray-900">{L.cashPopup.bill10k} × {b.tenK}</p>
                      )}
                      {b.fiveK > 0 && (
                        <p className="text-sm font-bold text-gray-900">{L.cashPopup.bill5k} × {b.fiveK}</p>
                      )}
                      {b.oneK > 0 && (
                        <p className="text-sm font-bold text-gray-900">{L.cashPopup.bill1k} × {b.oneK}</p>
                      )}
                    </div>

                    <p className="text-sm font-bold text-emerald-600 shrink-0">{b.change.toLocaleString()}{L.cashPopup.unit}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">{L.cashPopup.empty}</p>
            )}

            <p className="text-xs text-gray-400 leading-relaxed text-center">{L.cashPopup.note}</p>

            <button onClick={() => setOverlay(null)}
              className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
              {L.cashPopup.close}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
