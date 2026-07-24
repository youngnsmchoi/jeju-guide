'use client'
// 교통카드(T-money) 안내 — 구입·충전·사용·편의점 결제 4단계

import { useState } from 'react'
import Image from 'next/image'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

type Tab = 'buy' | 'topup' | 'use' | 'shop' | 'check'
const TABS: Tab[] = ['buy', 'topup', 'use', 'shop', 'check']

const LABEL: Record<Lang, {
  title: string
  intro: string
  tabBuy: string
  tabTopup: string
  tabUse: string
  tabShop: string
  tabCheck: string
  expand: string
  buy: { title: string; points: string[]; phraseLabel: string; phrase: string; paymentTip: string; nextStep: string }
  topup: { title: string; steps: string[]; warning: string; sameLabel: string; samePhrase: string; differentLabel: string; amountLabel: string; phraseLabel: string; phraseTemplate: (amount: string) => string }
  use: { title: string; points: string[]; warning: string }
  shop: { title: string; points: string[]; phraseLabel: string; phrase: string }
  check: { title: string; step1: string; step2: string; step3: string; phrase: string }
}> = {
  ko: {
    title: '🚇 교통카드 안내',
    intro: 'T-money는 한국 대중교통(버스·지하철·택시)에서 쓰는 선불 교통카드입니다. 편의점에서 구입·충전할 수 있고, 편의점 물건 결제에도 쓸 수 있습니다.',
    tabBuy: '① 구입',
    tabTopup: '② 충전',
    tabUse: '③ 사용',
    tabShop: '④ 편의점 결제',
    tabCheck: '⑤ 잔액 확인',
    expand: '확대',
    buy: {
      title: '교통카드 구입',
      points: [
        '편의점 카운터에서 구입 가능합니다 (약 3,000~4,000원).',
        '카드 자체에는 잔액이 없어서, 구입 후 반드시 충전해야 사용할 수 있습니다.',
        '어떤 디자인이든 기능은 동일하니 아무거나 골라도 됩니다.',
      ],
      phraseLabel: '점원에게 보여주세요',
      phrase: '교통카드 구입하려고 합니다',
      paymentTip: '💳 카드 결제도 가능합니다. 현금보다 카드 결제가 더 편합니다. 현금으로 낼 경우, 모니터에 표시된 금액만큼 한국 돈으로 내시면 됩니다.',
      nextStep: '➡️ 구입했다면 다음은 충전입니다. [② 충전] 탭에서 방법을 확인하세요.',
    },
    topup: {
      title: '교통카드 충전',
      steps: [
        '카드리더기에 카드를 올려놓고 충전 금액을 보여주세요.',
        '최소 1,000원 단위로 충전됩니다.',
      ],
      warning: '⚠️ 참고: 티머니 잔액 충전은 현금만 가능합니다. 카드로는 충전할 수 없어요.',
      sameLabel: '낸 돈과 충전 금액이 같으면',
      samePhrase: '충전해주세요',
      differentLabel: '충전할 금액이 다르면',
      amountLabel: '충전할 금액을 입력하세요 (원)',
      phraseLabel: '충전할 때 보여주세요',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요`,
    },
    use: {
      title: '교통카드 사용',
      points: [
        '버스: 탈 때 카드를 리더기에 태그하고, 내릴 때도 반드시 태그하세요. 하차 태그를 하면 전체 이동 거리로 계산되어 환승 할인이 적용되고, 안 하면 환승으로 인식되지 않아 다음 탑승이 별도 요금으로 계산되어 금액이 더 많아질 수 있습니다.',
        '지하철: 개찰구 통과 시 카드를 태그하면 됩니다.',
        '택시: 기사님께 카드 결제 의사를 밝히고, 차량 내 리더기에 카드를 태그하세요.',
      ],
      warning: '⚠️ 버스는 승차·하차 모두 태그해야 정상 요금이 적용됩니다. 정확한 요금·할인 조건은 지역·노선마다 다를 수 있습니다.',
    },
    shop: {
      title: '교통카드로 편의점 물품 구입',
      points: [
        '충전된 잔액으로 편의점 물건도 결제할 수 있습니다 (선불카드처럼 사용).',
        '카운터에서 카드를 리더기에 올리고, 아래 문장을 점원에게 보여주세요.',
        '잔액이 부족하면 다른 결제수단(현금·카드)이 필요합니다.',
      ],
      phraseLabel: '점원에게 보여주세요',
      phrase: '티머니로 결제할게요',
    },
    check: {
      title: '교통카드 잔액 확인',
      step1: '편의점 카운터에서 카드리더기에 교통카드를 놓아주세요.',
      step2: '아래 문장을 점원에게 보여주세요.',
      step3: '결제 단말기의 고객용 화면에 잔액이 표시됩니다. 화면에 보이는 큰 숫자(예: 11,460원)가 카드 잔액입니다.',
      phrase: '교통카드 잔액 확인해주세요',
    },
  },
  en: {
    title: '🚇 Transit Card Guide',
    intro: 'T-money is a prepaid transit card used for buses, subways, and taxis in Korea. You can buy and top it up at convenience stores, and also use it to pay for items there.',
    tabBuy: '① Buy',
    tabTopup: '② Top Up',
    tabUse: '③ Use',
    tabShop: '④ Pay at Store',
    tabCheck: '⑤ Check Balance',
    expand: 'Show',
    buy: {
      title: 'Buying a Transit Card',
      points: [
        'Available at convenience store counters (about 3,000–4,000 won).',
        'The card starts with no balance — you must top it up before using it.',
        'Any design works the same, so pick whichever is available.',
      ],
      phraseLabel: 'Show this to the staff',
      phrase: '교통카드 구입하려고 합니다 (I\'d like to buy a transit card)',
      paymentTip: '💳 Card payment is accepted too, and it\'s more convenient than cash. If paying cash, just pay the amount shown on the screen in Korean won.',
      nextStep: '➡️ Once you\'ve bought the card, the next step is topping it up. Check the [② Top Up] tab for how.',
    },
    topup: {
      title: 'Topping Up',
      steps: [
        'Place the card on the card reader and show the amount you want to add.',
        'Top-ups are in units of at least 1,000 won.',
      ],
      warning: '⚠️ Note: Top-ups can only be paid in cash. Card payment is not accepted for topping up.',
      sameLabel: 'If the cash you\'re paying matches the top-up amount',
      samePhrase: '충전해주세요 (Please top up my card)',
      differentLabel: 'If the top-up amount is different',
      amountLabel: 'Enter the amount to top up (KRW)',
      phraseLabel: 'Show this when topping up',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요 (Please top up ${amount} won on my T-money)`,
    },
    use: {
      title: 'Using the Card',
      points: [
        'Bus: Tag the card on the reader when boarding, and tag again when getting off. Tagging when you get off lets the system calculate your full trip distance and apply the transfer discount. Skipping it means the system won\'t recognize your next ride as a transfer, so it gets charged separately as a new fare — which can add up to more.',
        'Subway: Tag the card at the gate when entering.',
        'Taxi: Tell the driver you\'ll pay by card, then tag your card on the in-car reader.',
      ],
      warning: '⚠️ For buses, tag both when boarding and getting off for the correct fare. Exact fares and discount rules can vary by region and route.',
    },
    shop: {
      title: 'Paying for Store Items with the Card',
      points: [
        'Your balance can also be used to pay for convenience store items, like a prepaid card.',
        'At the counter, place your card on the reader and show the staff the phrase below.',
        'If the balance is insufficient, you\'ll need another payment method (cash or card).',
      ],
      phraseLabel: 'Show this to the staff',
      phrase: '티머니로 결제할게요 (I\'ll pay with T-money)',
    },
    check: {
      title: 'Checking Your Balance',
      step1: 'At the convenience store counter, place your transit card on the card reader.',
      step2: 'Show them the phrase below.',
      step3: 'Your balance will appear on the customer-facing screen of the payment terminal. The large number shown (e.g. 11,460원, meaning 11,460 won) is your card balance.',
      phrase: '교통카드 잔액 확인해주세요 (Please check my transit card balance)',
    },
  },
  zh: {
    title: '🚇 交通卡指南',
    intro: 'T-money是韩国公交、地铁、出租车通用的预付交通卡。可以在便利店购买、充值，也可以用来在便利店结账。',
    tabBuy: '①购买',
    tabTopup: '②充值',
    tabUse: '③使用',
    tabShop: '④便利店结账',
    tabCheck: '⑤查询余额',
    expand: '放大',
    buy: {
      title: '购买交通卡',
      points: [
        '可在便利店柜台购买（约3,000～4,000韩元）。',
        '卡内没有余额，购买后必须先充值才能使用。',
        '任何设计功能都相同，选哪个都可以。',
      ],
      phraseLabel: '请出示给店员',
      phrase: '교통카드 구입하려고 합니다（我想买一张交通卡）',
      paymentTip: '💳 也可以刷卡支付，比现金更方便。如果用现金支付，按屏幕上显示的金额付韩元即可。',
      nextStep: '➡️ 买好卡后，下一步是充值。请查看【②充值】标签了解方法。',
    },
    topup: {
      title: '交通卡充值',
      steps: [
        '把卡放在读卡器上，出示您要充值的金额。',
        '最低以1,000韩元为单位充值。',
      ],
      warning: '⚠️ 请注意：交通卡充值只能使用现金，不支持刷卡充值。',
      sameLabel: '如果您付的现金和要充值的金额相同',
      samePhrase: '충전해주세요（请帮我充值）',
      differentLabel: '如果充值金额不同',
      amountLabel: '请输入要充值的金额（韩元）',
      phraseLabel: '充值时请出示',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요（请帮我充值${amount}韩元）`,
    },
    use: {
      title: '使用交通卡',
      points: [
        '公交车：上车时在读卡器上刷卡，下车时也必须刷卡。下车刷卡后，系统会按全程距离计算并享受换乘优惠；不刷卡的话，系统不会识别为换乘，下次乘车会被单独计费，总费用可能会更高。',
        '地铁：进闸机时刷卡即可。',
        '出租车：告诉司机您要刷卡支付，然后在车内读卡器上刷卡。',
      ],
      warning: '⚠️ 乘坐公交车时，上车和下车都必须刷卡才能正确计费。具体费用和优惠条件可能因地区、路线而异。',
    },
    shop: {
      title: '用交通卡在便利店购物',
      points: [
        '卡内余额也可以用来支付便利店商品，就像预付卡一样。',
        '在柜台把卡放在读卡器上，把下面的句子出示给店员看。',
        '如果余额不足，需要使用其他支付方式（现金或卡）。',
      ],
      phraseLabel: '请出示给店员',
      phrase: '티머니로 결제할게요（我要用T-money支付）',
    },
    check: {
      title: '查询交通卡余额',
      step1: '在便利店柜台，把交通卡放在读卡器上。',
      step2: '把下面的句子出示给店员看。',
      step3: '余额会显示在结账机的顾客端屏幕上。屏幕上显示的大数字（例如11,460원，即11,460韩元）就是您的卡内余额。',
      phrase: '교통카드 잔액 확인해주세요（请帮我查询交通卡余额）',
    },
  },
  ja: {
    title: '🚇 交通カード案内',
    intro: 'T-moneyは韓国のバス・地下鉄・タクシーで使えるプリペイド交通カードです。コンビニで購入・チャージでき、コンビニでの買い物にも使えます。',
    tabBuy: '①購入',
    tabTopup: '②チャージ',
    tabUse: '③使用',
    tabShop: '④コンビニ決済',
    tabCheck: '⑤残高確認',
    expand: '拡大',
    buy: {
      title: '交通カードの購入',
      points: [
        'コンビニのレジで購入できます（約3,000～4,000ウォン）。',
        'カード自体には残高がないため、購入後は必ずチャージしてから使用してください。',
        'デザインが違っても機能は同じなので、どれを選んでも構いません。',
      ],
      phraseLabel: '店員に見せてください',
      phrase: '교통카드 구입하려고 합니다（交通カードを購入したいです）',
      paymentTip: '💳 カード払いも可能で、現金より便利です。現金で払う場合は、画面に表示された金額分の韓国ウォンを支払ってください。',
      nextStep: '➡️ 購入したら次はチャージです。【②チャージ】タブで方法を確認してください。',
    },
    topup: {
      title: '交通カードのチャージ',
      steps: [
        'カードリーダーにカードを置き、チャージしたい金額を見せてください。',
        '最低1,000ウォン単位でチャージされます。',
      ],
      warning: '⚠️ 注意：チャージは現金のみ可能です。カードでのチャージはできません。',
      sameLabel: '支払う現金とチャージ金額が同じ場合',
      samePhrase: '충전해주세요（チャージしてください）',
      differentLabel: 'チャージ金額が異なる場合',
      amountLabel: 'チャージする金額を入力してください（ウォン）',
      phraseLabel: 'チャージの際にお見せください',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요（T-moneyに${amount}ウォンチャージしてください）`,
    },
    use: {
      title: '交通カードの使用',
      points: [
        'バス：乗車時にカードリーダーにタッチし、降車時にも必ずタッチしてください。降車時にタッチすると、全体の移動距離で計算されて乗り換え割引が適用されます。タッチしないと乗り換えと認識されず、次の乗車が別料金として計算され、合計金額が高くなることがあります。',
        '地下鉄：改札を通る際にカードをタッチしてください。',
        'タクシー：運転手にカード払いであることを伝え、車内のカードリーダーにタッチしてください。',
      ],
      warning: '⚠️ バスは乗車時・降車時の両方でタッチしないと正しい料金になりません。正確な料金・割引条件は地域や路線によって異なる場合があります。',
    },
    shop: {
      title: '交通カードでコンビニ商品を購入',
      points: [
        'チャージした残高でコンビニの商品も購入できます（プリペイドカードのように使えます）。',
        'レジでカードをリーダーに置き、下の文章を店員に見せてください。',
        '残高が不足している場合は、他の支払い方法（現金・カード）が必要です。',
      ],
      phraseLabel: '店員に見せてください',
      phrase: '티머니로 결제할게요（T-moneyで払います）',
    },
    check: {
      title: '交通カードの残高確認',
      step1: 'コンビニのレジでカードリーダーに交通カードを置いてください。',
      step2: '下の文章を店員に見せてください。',
      step3: '決済端末のお客様用画面に残高が表示されます。画面に表示される大きな数字（例：11,460원、11,460ウォンという意味）がカードの残高です。',
      phrase: '교통카드 잔액 확인해주세요（交通カードの残高を確認してください）',
    },
  },
}

function HighlightedPhrase({ phrase, amount, className }: { phrase: string; amount: string; className: string }) {
  const segments = phrase.split(amount)
  return (
    <p className={className}>
      {segments.map((seg, i) => (
        <span key={i}>
          {seg}
          {i < segments.length - 1 && <span className="text-emerald-600">{amount}</span>}
        </span>
      ))}
    </p>
  )
}

function AmountPhraseButton({ amountLabel, phraseLabel, phraseTemplate, expandLabel }: {
  amountLabel: string
  phraseLabel: string
  phraseTemplate: (amount: string) => string
  expandLabel: string
}) {
  const [amount, setAmount] = useState('10,000')
  const [overlay, setOverlay] = useState(false)
  const phrase = phraseTemplate(amount || '0')

  return (
    <>
      <div className="space-y-2">
        <label className="text-xs text-gray-500 font-medium block">{amountLabel}</label>
        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
        />
      </div>
      <p className="text-xs text-gray-500 font-medium">{phraseLabel}</p>
      <div className="bg-white rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
        <HighlightedPhrase phrase={phrase} amount={amount || '0'} className="text-sm font-semibold text-gray-900" />
        <button onClick={() => setOverlay(true)}
          className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
          {expandLabel}
        </button>
      </div>
      {overlay && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8"
          onClick={() => setOverlay(false)}>
          <HighlightedPhrase phrase={phrase} amount={amount || '0'} className="text-5xl font-bold text-gray-900 text-center leading-tight" />
          <button onClick={() => setOverlay(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl hover:bg-gray-200">
            ✕
          </button>
        </div>
      )}
    </>
  )
}

function PhraseButton({ phrase, expandLabel }: { phrase: string; expandLabel: string }) {
  const [overlay, setOverlay] = useState(false)
  return (
    <>
      <div className="bg-white rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-900">{phrase}</p>
        <button onClick={() => setOverlay(true)}
          className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
          {expandLabel}
        </button>
      </div>
      {overlay && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8"
          onClick={() => setOverlay(false)}>
          <p className="text-5xl font-bold text-gray-900 text-center leading-tight">{phrase}</p>
          <button onClick={() => setOverlay(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl hover:bg-gray-200">
            ✕
          </button>
        </div>
      )}
    </>
  )
}

export default function TmoneyView() {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [tab, setTab] = useState<Tab>('buy')

  const tabLabel = (t: Tab): string => ({
    buy: L.tabBuy,
    topup: L.tabTopup,
    use: L.tabUse,
    shop: L.tabShop,
    check: L.tabCheck,
  })[t]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <h1 className="text-lg font-bold text-gray-900">{L.title}</h1>
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
                ${tab === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
              {tabLabel(t)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
          {tab === 'buy' && (
            <>
              <p className="text-sm font-bold text-gray-800">{L.buy.title}</p>
              <ul className="space-y-1.5">
                {L.buy.points.map((p, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{p}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 font-medium">{L.buy.phraseLabel}</p>
              <PhraseButton phrase={L.buy.phrase} expandLabel={L.expand} />
              <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 leading-relaxed">{L.buy.paymentTip}</p>
              <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">{L.buy.nextStep}</p>
            </>
          )}

          {tab === 'topup' && (
            <>
              <p className="text-sm font-bold text-gray-800">{L.topup.title}</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                {L.topup.steps.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-relaxed">{s}</li>
                ))}
              </ol>
              <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">{L.topup.warning}</p>
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-100" style={{ aspectRatio: '815 / 1024' }}>
                <Image src="/images/tmoney/card-reader.png" alt={L.topup.title} fill className="object-contain" sizes="(max-width: 512px) 100vw, 512px" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{L.topup.sameLabel}</p>
              <PhraseButton phrase={L.topup.samePhrase} expandLabel={L.expand} />
              <p className="text-xs text-gray-500 font-medium">{L.topup.differentLabel}</p>
              <AmountPhraseButton amountLabel={L.topup.amountLabel} phraseLabel={L.topup.phraseLabel} phraseTemplate={L.topup.phraseTemplate} expandLabel={L.expand} />
            </>
          )}

          {tab === 'use' && (
            <>
              <p className="text-sm font-bold text-gray-800">{L.use.title}</p>
              <ul className="space-y-1.5">
                {L.use.points.map((p, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{p}</li>
                ))}
              </ul>
              <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 leading-relaxed">{L.use.warning}</p>
            </>
          )}

          {tab === 'shop' && (
            <>
              <p className="text-sm font-bold text-gray-800">{L.shop.title}</p>
              <ul className="space-y-1.5">
                {L.shop.points.map((p, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{p}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 font-medium">{L.shop.phraseLabel}</p>
              <PhraseButton phrase={L.shop.phrase} expandLabel={L.expand} />
            </>
          )}

          {tab === 'check' && (
            <>
              <p className="text-sm font-bold text-gray-800">{L.check.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">1. {L.check.step1}</p>
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-100" style={{ aspectRatio: '815 / 1024' }}>
                <Image src="/images/tmoney/check-card-reader.png" alt={L.check.title} fill className="object-contain" sizes="(max-width: 512px) 100vw, 512px" />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">2. {L.check.step2}</p>
              <PhraseButton phrase={L.check.phrase} expandLabel={L.expand} />
              <p className="text-xs text-gray-600 leading-relaxed">3. {L.check.step3}</p>
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-100" style={{ aspectRatio: '1732 / 894' }}>
                <Image src="/images/tmoney/check-monitor.png" alt={L.check.title} fill className="object-contain" sizes="(max-width: 512px) 100vw, 512px" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
