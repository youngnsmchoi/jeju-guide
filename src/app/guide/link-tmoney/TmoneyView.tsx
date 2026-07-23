'use client'
// 교통카드(T-money) 안내 — 구입·충전·사용·편의점 결제 4단계

import { useState } from 'react'
import Image from 'next/image'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

type Tab = 'buy' | 'topup' | 'use' | 'shop'
const TABS: Tab[] = ['buy', 'topup', 'use', 'shop']

const LABEL: Record<Lang, {
  title: string
  intro: string
  tabBuy: string
  tabTopup: string
  tabUse: string
  tabShop: string
  expand: string
  buy: { title: string; points: string[] }
  topup: { title: string; steps: string[]; warning: string; amountLabel: string; phraseLabel: string; phraseTemplate: (amount: string) => string }
  use: { title: string; points: string[]; warning: string }
  shop: { title: string; points: string[] }
}> = {
  ko: {
    title: '🚇 교통카드 안내',
    intro: 'T-money는 한국 대중교통(버스·지하철·택시)에서 쓰는 선불 교통카드입니다. 편의점에서 구입·충전할 수 있고, 편의점 물건 결제에도 쓸 수 있습니다.',
    tabBuy: '① 구입',
    tabTopup: '② 충전',
    tabUse: '③ 사용',
    tabShop: '④ 편의점 결제',
    expand: '확대',
    buy: {
      title: '교통카드 구입',
      points: [
        '편의점 카운터에서 구입 가능합니다 (약 3,000~4,000원).',
        '카드 자체에는 잔액이 없어서, 구입 후 반드시 충전해야 사용할 수 있습니다.',
        '어떤 디자인이든 기능은 동일하니 아무거나 골라도 됩니다.',
      ],
    },
    topup: {
      title: '교통카드 충전',
      steps: [
        '카드리더기에 카드를 올려놓고 충전 금액을 보여주세요.',
        '최소 1,000원 단위로 충전됩니다.',
      ],
      warning: '⚠️ 참고: 티머니 잔액 충전은 현금만 가능합니다. 카드로는 충전할 수 없어요.',
      amountLabel: '충전할 금액을 입력하세요 (원)',
      phraseLabel: '충전할 때 보여주세요',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요`,
    },
    use: {
      title: '교통카드 사용',
      points: [
        '버스: 탈 때 카드를 리더기에 태그하고, 내릴 때도 반드시 태그하세요. 하차 태그를 안 하면 환승 할인이 안 되고 다음 탑승 시 요금이 더 나올 수 있습니다.',
        '지하철: 개찰구 통과 시 카드를 태그하면 됩니다.',
        '택시: 기사님께 카드 결제 의사를 밝히고, 차량 내 리더기에 카드를 태그하세요.',
      ],
      warning: '⚠️ 버스는 승차·하차 모두 태그해야 정상 요금이 적용됩니다.',
    },
    shop: {
      title: '교통카드로 편의점 물품 구입',
      points: [
        '충전된 잔액으로 편의점 물건도 결제할 수 있습니다 (선불카드처럼 사용).',
        '카운터에서 "티머니로 결제할게요"라고 말하고 카드를 리더기에 대면 됩니다.',
        '잔액이 부족하면 다른 결제수단(현금·카드)이 필요합니다.',
      ],
    },
  },
  en: {
    title: '🚇 Transit Card Guide',
    intro: 'T-money is a prepaid transit card used for buses, subways, and taxis in Korea. You can buy and top it up at convenience stores, and also use it to pay for items there.',
    tabBuy: '① Buy',
    tabTopup: '② Top Up',
    tabUse: '③ Use',
    tabShop: '④ Pay at Store',
    expand: 'Show',
    buy: {
      title: 'Buying a Transit Card',
      points: [
        'Available at convenience store counters (about 3,000–4,000 won).',
        'The card starts with no balance — you must top it up before using it.',
        'Any design works the same, so pick whichever is available.',
      ],
    },
    topup: {
      title: 'Topping Up',
      steps: [
        'Place the card on the card reader and show the amount you want to add.',
        'Top-ups are in units of at least 1,000 won.',
      ],
      warning: '⚠️ Note: Top-ups can only be paid in cash. Card payment is not accepted for topping up.',
      amountLabel: 'Enter the amount to top up (KRW)',
      phraseLabel: 'Show this when topping up',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요 (Please top up ${amount} won on my T-money)`,
    },
    use: {
      title: 'Using the Card',
      points: [
        'Bus: Tag the card on the reader when boarding, and tag again when getting off. Skipping the exit tag means no transfer discount and possibly a higher fare next ride.',
        'Subway: Tag the card at the gate when entering.',
        'Taxi: Tell the driver you\'ll pay by card, then tag your card on the in-car reader.',
      ],
      warning: '⚠️ For buses, tag both when boarding and getting off for the correct fare.',
    },
    shop: {
      title: 'Paying for Store Items with the Card',
      points: [
        'Your balance can also be used to pay for convenience store items, like a prepaid card.',
        'Say "T-money please" at the counter and tag your card on the reader.',
        'If the balance is insufficient, you\'ll need another payment method (cash or card).',
      ],
    },
  },
  zh: {
    title: '🚇 交通卡指南',
    intro: 'T-money是韩国公交、地铁、出租车通用的预付交通卡。可以在便利店购买、充值，也可以用来在便利店结账。',
    tabBuy: '①购买',
    tabTopup: '②充值',
    tabUse: '③使用',
    tabShop: '④便利店结账',
    expand: '放大',
    buy: {
      title: '购买交通卡',
      points: [
        '可在便利店柜台购买（约3,000～4,000韩元）。',
        '卡内没有余额，购买后必须先充值才能使用。',
        '任何设计功能都相同，选哪个都可以。',
      ],
    },
    topup: {
      title: '交通卡充值',
      steps: [
        '把卡放在读卡器上，出示您要充值的金额。',
        '最低以1,000韩元为单位充值。',
      ],
      warning: '⚠️ 请注意：交通卡充值只能使用现金，不支持刷卡充值。',
      amountLabel: '请输入要充值的金额（韩元）',
      phraseLabel: '充值时请出示',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요（请帮我充值${amount}韩元）`,
    },
    use: {
      title: '使用交通卡',
      points: [
        '公交车：上车时在读卡器上刷卡，下车时也必须刷卡。不刷卡下车会导致无法享受换乘优惠，下次乘车可能被收取更高费用。',
        '地铁：进闸机时刷卡即可。',
        '出租车：告诉司机您要刷卡支付，然后在车内读卡器上刷卡。',
      ],
      warning: '⚠️ 乘坐公交车时，上车和下车都必须刷卡才能正确计费。',
    },
    shop: {
      title: '用交通卡在便利店购物',
      points: [
        '卡内余额也可以用来支付便利店商品，就像预付卡一样。',
        '在柜台说"用T-money支付"，然后在读卡器上刷卡即可。',
        '如果余额不足，需要使用其他支付方式（现金或卡）。',
      ],
    },
  },
  ja: {
    title: '🚇 交通カード案内',
    intro: 'T-moneyは韓国のバス・地下鉄・タクシーで使えるプリペイド交通カードです。コンビニで購入・チャージでき、コンビニでの買い物にも使えます。',
    tabBuy: '①購入',
    tabTopup: '②チャージ',
    tabUse: '③使用',
    tabShop: '④コンビニ決済',
    expand: '拡大',
    buy: {
      title: '交通カードの購入',
      points: [
        'コンビニのレジで購入できます（約3,000～4,000ウォン）。',
        'カード自体には残高がないため、購入後は必ずチャージしてから使用してください。',
        'デザインが違っても機能は同じなので、どれを選んでも構いません。',
      ],
    },
    topup: {
      title: '交通カードのチャージ',
      steps: [
        'カードリーダーにカードを置き、チャージしたい金額を見せてください。',
        '最低1,000ウォン単位でチャージされます。',
      ],
      warning: '⚠️ 注意：チャージは現金のみ可能です。カードでのチャージはできません。',
      amountLabel: 'チャージする金額を入力してください（ウォン）',
      phraseLabel: 'チャージの際にお見せください',
      phraseTemplate: (amount) => `티머니 ${amount}원 충전해주세요（T-moneyに${amount}ウォンチャージしてください）`,
    },
    use: {
      title: '交通カードの使用',
      points: [
        'バス：乗車時にカードリーダーにタッチし、降車時にも必ずタッチしてください。降車時のタッチを忘れると乗り換え割引が適用されず、次回乗車時に高い料金になることがあります。',
        '地下鉄：改札を通る際にカードをタッチしてください。',
        'タクシー：運転手にカード払いであることを伝え、車内のカードリーダーにタッチしてください。',
      ],
      warning: '⚠️ バスは乗車時・降車時の両方でタッチしないと正しい料金になりません。',
    },
    shop: {
      title: '交通カードでコンビニ商品を購入',
      points: [
        'チャージした残高でコンビニの商品も購入できます（プリペイドカードのように使えます）。',
        'レジで「T-moneyで払います」と伝え、カードをリーダーにタッチしてください。',
        '残高が不足している場合は、他の支払い方法（現金・カード）が必要です。',
      ],
    },
  },
}

function AmountPhraseButton({ amountLabel, phraseTemplate, expandLabel }: {
  amountLabel: string
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
              <p className="text-xs text-gray-500 font-medium">{L.topup.phraseLabel}</p>
              <AmountPhraseButton amountLabel={L.topup.amountLabel} phraseTemplate={L.topup.phraseTemplate} expandLabel={L.expand} />
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
