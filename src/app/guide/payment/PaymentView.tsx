'use client'
// 편의점 결제 4단계 가이드 — 외국인 여행자용

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
  bagYes: string
  bagNo: string
  bagCopy: string
  bagCopied: string
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
      { emoji: '🛍️', title: 'Bag question', desc: 'The cashier will ask if you need a bag. Show them the phrase below.' },
      { emoji: '💳', title: 'Pay', desc: 'Card or cash — both are accepted.' },
      { emoji: '✍️', title: 'Signature', desc: 'Korean cards skip signatures under ₩50,000. Foreign cards may require a signature regardless of amount — just sign the pad naturally if asked.' },
    ],
    bagTitle: 'Bag question — show this to the cashier',
    bagNote: 'The cashier asks right before payment. Be ready!',
    bagYes: '봉투 주세요 (Yes, a bag please)',
    bagNo: '필요 없어요 (No bag, thanks)',
    bagCopy: 'Copy',
    bagCopied: 'Copied!',
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
      { emoji: '🛍️', title: '봉투 여부 확인', desc: '점원이 봉투가 필요한지 물어봅니다. 아래 문구를 미리 준비하세요.' },
      { emoji: '💳', title: '결제', desc: '카드 또는 현금 모두 가능합니다.' },
      { emoji: '✍️', title: '결제 서명 안내', desc: '한국 발급 카드는 5만원 이하 서명 생략. 해외 발급 카드는 금액과 관계없이 서명을 요청받을 수 있습니다. 점원이 요청하면 패드에 자연스럽게 서명하세요.' },
    ],
    bagTitle: '봉투 질문 — 점원에게 보여주세요',
    bagNote: '결제 직전에 묻습니다. 미리 준비해 두세요.',
    bagYes: '봉투 주세요',
    bagNo: '필요 없어요',
    bagCopy: '복사',
    bagCopied: '복사됨!',
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
      { emoji: '🛍️', title: '袋子问题', desc: '收银员会问您是否需要袋子。提前准备好下方的短语。' },
      { emoji: '💳', title: '付款', desc: '支持刷卡和现金付款。' },
      { emoji: '✍️', title: '签名说明', desc: '韩国发行的卡在5万韩元以下免签名。海外发行的卡无论金额多少都可能需要签名。收银员要求时，在签名板上自然签名即可。' },
    ],
    bagTitle: '袋子问题 — 出示给收银员',
    bagNote: '付款前会被问到，提前准备好！',
    bagYes: '봉투 주세요（需要袋子）',
    bagNo: '필요 없어요（不需要袋子）',
    bagCopy: '复制',
    bagCopied: '已复制！',
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
      { emoji: '🛍️', title: '袋の確認', desc: '店員が袋が必要か聞いてきます。下のフレーズを事前に準備しておきましょう。' },
      { emoji: '💳', title: 'お支払い', desc: 'カードも現金も使えます。' },
      { emoji: '✍️', title: 'サイン案内', desc: '韓国発行のカードは5万ウォン以下でサイン不要。海外発行のカードは金額に関わらずサインを求められる場合があります。店員に求められたらパッドに自然にサインしてください。' },
    ],
    bagTitle: '袋の質問 — 店員に見せてください',
    bagNote: 'お会計直前に聞かれます。事前に準備しておきましょう！',
    bagYes: '봉투 주세요（袋をください）',
    bagNo: '필요 없어요（袋は不要です）',
    bagCopy: 'コピー',
    bagCopied: 'コピー済み！',
    warning: '⚠️ 会計前の飲食禁止',
    warningDesc: 'すべての商品はお会計後にのみお召し上がりください。会計前の開封・飲食はできません。',
  },
}

export default function PaymentView() {
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
          <p className="text-xs text-emerald-600">{L.bagNote}</p>
          <BagButton text={L.bagYes} korean="봉투 주세요" copyLabel={L.bagCopy} copiedLabel={L.bagCopied} />
          <BagButton text={L.bagNo} korean="필요 없어요" copyLabel={L.bagCopy} copiedLabel={L.bagCopied} />
        </div>

        {/* 주의사항 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-red-700">{L.warning}</p>
          <p className="text-xs text-red-500 mt-1">{L.warningDesc}</p>
        </div>
      </main>
    </div>
  )
}

function BagButton({ text, korean, copyLabel, copiedLabel }: {
  text: string; korean: string; copyLabel: string; copiedLabel: string
}) {
  const copy = async () => {
    await navigator.clipboard.writeText(korean)
    const btn = document.activeElement as HTMLButtonElement
    if (btn) {
      const orig = btn.textContent
      btn.textContent = copiedLabel
      setTimeout(() => { btn.textContent = orig }, 1500)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-gray-900">{text}</p>
      <button onClick={copy}
        className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
        {copyLabel}
      </button>
    </div>
  )
}
