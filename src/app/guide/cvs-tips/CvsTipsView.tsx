'use client'
// 편의점 꿀팁 — 전자레인지·삼각김밥·T-money 외국인 실용 안내

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

const LABEL: Record<Lang, {
  title: string
  microwave: {
    title: string
    steps: string[]
    warning: string
    phraseLabel: string
    phrase: string
  }
  onigiri: {
    title: string
    intro: string
    steps: string[]
    tip: string
    flavors: string
    flavorList: string[]
  }
  tmoney: {
    title: string
    intro: string
    steps: string[]
    phraseLabel: string
    phrase: string
    tip: string
  }
  expand: string
}> = {
  ko: {
    title: '편의점 꿀팁',
    microwave: {
      title: '🔥 전자레인지 사용법',
      steps: [
        '카운터 근처 셀프 전자레인지를 찾으세요.',
        '도시락·컵 등 용기 뚜껑을 열고 넣으세요.',
        '시간 버튼을 누르고 시작하세요. (보통 1~2분)',
        '다 되면 조심히 꺼내세요. 용기가 뜨겁습니다.',
      ],
      warning: '⚠️ 알루미늄 용기·포일은 절대 넣지 마세요. 불이 날 수 있습니다.',
      phraseLabel: '점원에게 부탁할 때',
      phrase: '데워주세요',
    },
    onigiri: {
      title: '🍙 삼각김밥 뜯는 법',
      intro: '포장지에 ①②③ 번호가 있습니다. 순서대로 당기면 김과 밥이 분리되지 않아요.',
      steps: [
        '① 위쪽 테이프를 잡고 아래로 당기세요.',
        '② 왼쪽 포장지를 왼쪽으로 당기세요.',
        '③ 오른쪽 포장지를 오른쪽으로 당기세요.',
      ],
      tip: '💡 천천히 당기면 김이 찢어지지 않아요.',
      flavors: '인기 종류',
      flavorList: ['참치마요 (Tuna Mayo)', '불고기 (Bulgogi)', '명란 (Pollock Roe)', '스팸 (Spam)'],
    },
    tmoney: {
      title: '🚇 T-money 교통카드',
      intro: '버스·지하철·택시 모두 사용 가능. 편의점 카운터에서 구매·충전할 수 있습니다.',
      steps: [
        '카운터에 카드를 올려놓고 충전 금액을 말하세요.',
        '현금 또는 카드로 충전 가능합니다.',
        '최소 1,000원 단위로 충전됩니다.',
      ],
      phraseLabel: '충전할 때 보여주세요',
      phrase: '티머니 충전해주세요',
      tip: '카드가 없으면 편의점에서 구매 가능합니다. (약 3,000~4,000원)',
    },
    expand: '확대',
  },
  en: {
    title: 'CVS Tips',
    microwave: {
      title: '🔥 How to use the microwave',
      steps: [
        'Find the self-service microwave near the counter.',
        'Open the lid of your food container before placing it inside.',
        'Press the time button and start. (Usually 1–2 minutes)',
        'Remove carefully — the container will be hot.',
      ],
      warning: '⚠️ Never put aluminum containers or foil inside. It can cause a fire.',
      phraseLabel: 'Ask the staff',
      phrase: '데워주세요 (Please heat this up)',
    },
    onigiri: {
      title: '🍙 How to open an onigiri',
      intro: 'The wrapper has numbers ①②③. Pull them in order and the seaweed stays crispy.',
      steps: [
        '① Pull the top tab downward.',
        '② Pull the left side of the wrapper to the left.',
        '③ Pull the right side of the wrapper to the right.',
      ],
      tip: '💡 Pull slowly so the seaweed doesn\'t tear.',
      flavors: 'Popular flavors',
      flavorList: ['참치마요 Tuna Mayo', '불고기 Bulgogi', '명란 Pollock Roe', '스팸 Spam'],
    },
    tmoney: {
      title: '🚇 T-money Card',
      intro: 'Works on buses, subways, and taxis. Buy or top up at any convenience store counter.',
      steps: [
        'Place your card on the counter and tell the amount you want to add.',
        'Pay by cash or card.',
        'Minimum top-up is ₩1,000.',
      ],
      phraseLabel: 'Show this to top up',
      phrase: '티머니 충전해주세요 (Please top up my T-money)',
      tip: 'No card? You can buy one at the counter for about ₩3,000–4,000.',
    },
    expand: 'Show',
  },
  zh: {
    title: '便利店小贴士',
    microwave: {
      title: '🔥 微波炉使用方法',
      steps: [
        '在收银台附近找到自助微波炉。',
        '打开食品容器的盖子后放入。',
        '按下时间按钮开始加热。（通常1~2分钟）',
        '小心取出，容器会很烫。',
      ],
      warning: '⚠️ 绝对不能放铝制容器或锡纸，可能引起火灾。',
      phraseLabel: '请店员帮忙时',
      phrase: '데워주세요（请帮我加热）',
    },
    onigiri: {
      title: '🍙 三角饭团拆法',
      intro: '包装上有①②③编号，按顺序撕开，海苔和米饭就不会分离。',
      steps: [
        '① 抓住上方胶带向下拉。',
        '② 将左侧包装纸向左拉。',
        '③ 将右侧包装纸向右拉。',
      ],
      tip: '💡 慢慢拉，海苔就不会碎。',
      flavors: '热门口味',
      flavorList: ['참치마요 金枪鱼蛋黄酱', '불고기 烤牛肉', '명란 明太鱼子', '스팸 午餐肉'],
    },
    tmoney: {
      title: '🚇 T-money 交通卡',
      intro: '可乘坐公交、地铁和出租车。可在便利店柜台购买或充值。',
      steps: [
        '将卡放在柜台上，告知充值金额。',
        '可用现金或刷卡充值。',
        '最低充值单位为1,000韩元。',
      ],
      phraseLabel: '充值时出示',
      phrase: '티머니 충전해주세요（请帮我充值T-money）',
      tip: '没有卡？可在柜台购买，约3,000~4,000韩元。',
    },
    expand: '放大',
  },
  ja: {
    title: 'コンビニお役立ち情報',
    microwave: {
      title: '🔥 電子レンジの使い方',
      steps: [
        'レジ近くのセルフ電子レンジを探してください。',
        '食品容器のフタを開けてから入れてください。',
        '時間ボタンを押してスタート。（通常1〜2分）',
        '容器が熱いので気をつけて取り出してください。',
      ],
      warning: '⚠️ アルミ容器やアルミホイルは絶対に入れないでください。火災の原因になります。',
      phraseLabel: '店員に頼むとき',
      phrase: '데워주세요（温めてください）',
    },
    onigiri: {
      title: '🍙 おにぎりの開け方',
      intro: '包装に①②③の番号があります。順番に引っ張ると海苔がパリパリのまま食べられます。',
      steps: [
        '① 上のテープを持って下に引っ張る。',
        '② 左側の包装を左に引っ張る。',
        '③ 右側の包装を右に引っ張る。',
      ],
      tip: '💡 ゆっくり引っ張ると海苔が破れません。',
      flavors: '人気の種類',
      flavorList: ['참치마요 ツナマヨ', '불고기 プルコギ', '명란 明太子', '스팸 スパム'],
    },
    tmoney: {
      title: '🚇 T-moneyカード',
      intro: 'バス・地下鉄・タクシーで使えます。コンビニのレジで購入・チャージができます。',
      steps: [
        'カードをレジに置いてチャージ金額を伝えてください。',
        '現金またはカードでチャージできます。',
        '最低1,000ウォン単位でチャージできます。',
      ],
      phraseLabel: 'チャージ時に見せる',
      phrase: '티머니 충전해주세요（T-moneyをチャージしてください）',
      tip: 'カードがない場合はレジで購入できます。（約3,000〜4,000ウォン）',
    },
    expand: '拡大',
  },
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

export default function CvsTipsView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-5">
        <h1 className="text-xl font-bold text-gray-900">{L.title}</h1>

        {/* 전자레인지 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-gray-800">{L.microwave.title}</p>
          <ol className="space-y-2">
            {L.microwave.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <p className="text-xs text-red-700">{L.microwave.warning}</p>
          </div>
          <p className="text-xs text-gray-500 font-medium">{L.microwave.phraseLabel}</p>
          <PhraseButton phrase={L.microwave.phrase} expandLabel={L.expand} />
        </div>

        {/* 삼각김밥 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-gray-800">{L.onigiri.title}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{L.onigiri.intro}</p>
          <ol className="space-y-2">
            {L.onigiri.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">{L.onigiri.tip}</p>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">{L.onigiri.flavors}</p>
            <div className="flex flex-wrap gap-2">
              {L.onigiri.flavorList.map((f, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* T-money */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-gray-800">{L.tmoney.title}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{L.tmoney.intro}</p>
          <ol className="space-y-2">
            {L.tmoney.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-gray-500 font-medium">{L.tmoney.phraseLabel}</p>
          <PhraseButton phrase={L.tmoney.phrase} expandLabel={L.expand} />
          <p className="text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2">{L.tmoney.tip}</p>
        </div>

      </main>
      <BottomNav />
    </div>
  )
}
