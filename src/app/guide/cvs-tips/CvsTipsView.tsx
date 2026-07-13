'use client'
// 편의점 꿀팁 — 전자레인지·삼각김밥·T-money 외국인 실용 안내

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

type Tab = 'microwave' | 'onigiri' | 'tmoney' | 'toilet' | 'trash' | 'wifi'
const TABS: Tab[] = ['microwave', 'onigiri', 'tmoney', 'toilet', 'trash', 'wifi']

const LABEL: Record<Lang, {
  title: string
  tabMicrowave: string
  tabOnigiri: string
  tabTmoney: string
  tabToilet: string
  tabTrash: string
  tabWifi: string
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
  toilet: {
    title: string
    intro: string
    points: string[]
    phraseLabel: string
    phrase: string
  }
  trash: {
    title: string
    intro: string
    points: string[]
    tip: string
  }
  wifi: {
    title: string
    intro: string
    points: string[]
    tip: string
  }
  expand: string
}> = {
  ko: {
    title: '편의점 꿀팁',
    tabMicrowave: '🔥 전자레인지',
    tabOnigiri: '🍙 삼각김밥',
    tabTmoney: '🚇 T-money',
    tabToilet: '🚻 화장실',
    tabTrash: '🗑️ 쓰레기',
    tabWifi: '📶 와이파이',
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
    toilet: {
      title: '🚻 화장실 이용',
      intro: '한국 편의점은 대부분 손님용 화장실이 없거나 직원 전용입니다. "편의점=화장실"이라고 생각하면 당황할 수 있어요.',
      points: [
        '매장 안에 화장실 표시가 없으면 이용 불가로 보면 됩니다.',
        '일부 매장은 물어보면 열쇠를 빌려주기도 합니다. 안 되면 정중히 넘어가세요.',
        '지하철역·대형마트·프랜차이즈 카페(스타벅스 등) 화장실이 더 확실합니다.',
      ],
      phraseLabel: '점원에게 물어볼 때',
      phrase: '화장실 있어요?',
    },
    trash: {
      title: '🗑️ 쓰레기 버리는 법',
      intro: '한국은 일반쓰레기·플라스틱·비닐을 나눠서 버립니다. 매장 안 쓰레기통도 분리되어 있는 경우가 많아요.',
      points: [
        '먹고 남은 국물·음식물은 지정된 구멍(음식물)에 버리세요.',
        '컵라면 용기·플라스틱은 플라스틱 칸에, 비닐 포장지는 비닐 칸에 버리세요.',
        '헷갈리면 아무 칸에나 넣지 말고 점원에게 물어보세요.',
      ],
      tip: '💡 매장 내 취식(이트인) 후에는 자리 정리까지가 매너입니다.',
    },
    wifi: {
      title: '📶 와이파이',
      intro: '매장마다 정책이 달라서, 무료 와이파이가 항상 되는 것은 아닙니다.',
      points: [
        '일부 매장은 통신사 제휴 와이파이(olleh WiFi 등)만 잡히고 편의점 자체 와이파이는 없을 수 있습니다.',
        '와이파이가 급하면 지하철역·카페·숙소 와이파이를 먼저 이용하는 게 확실합니다.',
        '유심(USIM)이나 포켓 와이파이를 미리 준비하면 편의점 와이파이에 의존하지 않아도 됩니다.',
      ],
      tip: '💡 확실하지 않은 정보라 매장에서 직접 확인하는 걸 권장합니다.',
    },
    expand: '확대',
  },
  en: {
    title: 'CVS Tips',
    tabMicrowave: '🔥 Microwave',
    tabOnigiri: '🍙 Onigiri',
    tabTmoney: '🚇 T-money',
    tabToilet: '🚻 Toilet',
    tabTrash: '🗑️ Trash',
    tabWifi: '📶 Wi-Fi',
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
    toilet: {
      title: '🚻 Using the toilet',
      intro: 'Most Korean convenience stores don\'t have a customer toilet, or it\'s staff-only. Don\'t assume "convenience store = bathroom."',
      points: [
        'If there\'s no toilet sign inside, assume it\'s not available.',
        'Some stores will lend you a key if you ask nicely. If not, just move on politely.',
        'Subway stations, large marts, and franchise cafes (like Starbucks) are more reliable options.',
      ],
      phraseLabel: 'Ask the staff',
      phrase: '화장실 있어요? (Is there a restroom?)',
    },
    trash: {
      title: '🗑️ How to sort your trash',
      intro: 'Korea separates general waste, plastic, and vinyl/plastic film. In-store trash bins are often split the same way.',
      points: [
        'Leftover liquid or food waste goes in the marked food-waste slot.',
        'Cup noodle containers and hard plastic go in the plastic bin; wrappers and film go in the vinyl bin.',
        'If you\'re not sure, don\'t just pick one — ask the staff.',
      ],
      tip: '💡 If you ate at the eat-in table, clean up your spot before leaving — it\'s expected here.',
    },
    wifi: {
      title: '📶 Wi-Fi',
      intro: 'Policy varies by store, so free Wi-Fi isn\'t guaranteed everywhere.',
      points: [
        'Some stores only carry carrier Wi-Fi (like olleh WiFi), not a store-run network.',
        'If you need Wi-Fi urgently, a subway station, cafe, or your accommodation is more reliable.',
        'Getting a local SIM or pocket Wi-Fi in advance means you won\'t have to rely on store Wi-Fi at all.',
      ],
      tip: '💡 This varies a lot by location — best to check with staff on the spot.',
    },
    expand: 'Show',
  },
  zh: {
    title: '便利店小贴士',
    tabMicrowave: '🔥 微波炉',
    tabOnigiri: '🍙 三角饭团',
    tabTmoney: '🚇 T-money',
    tabToilet: '🚻 洗手间',
    tabTrash: '🗑️ 垃圾分类',
    tabWifi: '📶 WiFi',
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
    toilet: {
      title: '🚻 洗手间使用',
      intro: '韩国大部分便利店没有顾客专用洗手间，或仅限员工使用。请不要认为"便利店=有洗手间"。',
      points: [
        '如果店内没有洗手间标志，基本可以认为不能使用。',
        '有些店铺询问后会借钥匙，如果不行请礼貌地放弃。',
        '地铁站、大型超市、连锁咖啡店（如星巴克）的洗手间更可靠。',
      ],
      phraseLabel: '询问店员时',
      phrase: '화장실 있어요?（有洗手间吗？）',
    },
    trash: {
      title: '🗑️ 垃圾分类方法',
      intro: '韩国将垃圾分为一般垃圾、塑料、塑料袋（食品包装膜）等，店内垃圾桶也常按此分类。',
      points: [
        '吃剩的汤汁、食物残渣请倒入指定的食物垃圾口。',
        '杯面容器等硬塑料放入塑料桶，包装袋等薄膜放入塑料袋垃圾桶。',
        '如果分不清，不要随便丢，请询问店员。',
      ],
      tip: '💡 在店内食用区（Eat-in）用餐后，请整理好座位再离开，这是基本礼仪。',
    },
    wifi: {
      title: '📶 WiFi',
      intro: '每家店的政策不同，并非所有店铺都提供免费WiFi。',
      points: [
        '有些店铺只有运营商合作WiFi（如olleh WiFi），没有便利店自己的WiFi。',
        '如果急需WiFi，地铁站、咖啡店、住宿地点会更可靠。',
        '提前准备当地SIM卡或随身WiFi，就不用依赖便利店WiFi了。',
      ],
      tip: '💡 这个信息因店而异，建议到店后直接确认。',
    },
    expand: '放大',
  },
  ja: {
    title: 'コンビニお役立ち情報',
    tabMicrowave: '🔥 電子レンジ',
    tabOnigiri: '🍙 おにぎり',
    tabTmoney: '🚇 T-money',
    tabToilet: '🚻 トイレ',
    tabTrash: '🗑️ ゴミ分別',
    tabWifi: '📶 Wi-Fi',
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
    toilet: {
      title: '🚻 トイレの利用',
      intro: '韓国のコンビニはほとんどお客様用トイレがないか、従業員専用です。「コンビニ＝トイレがある」とは思わないでください。',
      points: [
        '店内にトイレの表示がなければ、利用できないと考えてください。',
        '店舗によっては聞けば鍵を貸してくれることもあります。断られたら丁寧に諦めましょう。',
        '地下鉄駅・大型スーパー・カフェチェーン（スターバックスなど）の方が確実です。',
      ],
      phraseLabel: '店員に聞くとき',
      phrase: '화장실 있어요?（トイレありますか？）',
    },
    trash: {
      title: '🗑️ ゴミの捨て方',
      intro: '韓国では一般ゴミ・プラスチック・ビニールを分けて捨てます。店内のゴミ箱も分別されていることが多いです。',
      points: [
        '残った汁物や食べ残しは指定の食品ゴミ口に捨ててください。',
        'カップ麺の容器などプラスチックはプラスチック用に、包装フィルムはビニール用に捨ててください。',
        '分からないときは適当に入れず、店員に聞いてください。',
      ],
      tip: '💡 イートインで食べた後は、席の片付けまでがマナーです。',
    },
    wifi: {
      title: '📶 Wi-Fi',
      intro: '店舗によって方針が違うため、どこでも無料Wi-Fiが使えるわけではありません。',
      points: [
        '店舗によっては通信会社提携Wi-Fi（olleh WiFiなど）のみで、コンビニ独自のWi-Fiがない場合があります。',
        '急ぎでWi-Fiが必要なときは、地下鉄駅・カフェ・宿泊先の方が確実です。',
        '現地SIMやポケットWi-Fiを事前に用意しておけば、コンビニのWi-Fiに頼らずに済みます。',
      ],
      tip: '💡 店舗によって差が大きいので、現地で直接確認することをおすすめします。',
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
  const [tab, setTab] = useState<Tab>('microwave')

  const tabLabel = (t: Tab): string => ({
    microwave: L.tabMicrowave,
    onigiri: L.tabOnigiri,
    tmoney: L.tabTmoney,
    toilet: L.tabToilet,
    trash: L.tabTrash,
    wifi: L.tabWifi,
  })[t]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-2 py-1.5 rounded-xl text-sm font-medium transition-colors truncate
                ${tab === t ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {tabLabel(t)}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-5">
        {tab === 'microwave' && (
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
        )}

        {tab === 'onigiri' && (
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
        )}

        {tab === 'tmoney' && (
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
        )}

        {tab === 'toilet' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <p className="text-sm font-bold text-gray-800">{L.toilet.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{L.toilet.intro}</p>
            <ul className="space-y-2">
              {L.toilet.points.map((point, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700">
                  <span className="shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 font-medium">{L.toilet.phraseLabel}</p>
            <PhraseButton phrase={L.toilet.phrase} expandLabel={L.expand} />
          </div>
        )}

        {tab === 'trash' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <p className="text-sm font-bold text-gray-800">{L.trash.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{L.trash.intro}</p>
            <ul className="space-y-2">
              {L.trash.points.map((point, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700">
                  <span className="shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">{L.trash.tip}</p>
          </div>
        )}

        {tab === 'wifi' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <p className="text-sm font-bold text-gray-800">{L.wifi.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{L.wifi.intro}</p>
            <ul className="space-y-2">
              {L.wifi.points.map((point, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700">
                  <span className="shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2">{L.wifi.tip}</p>
          </div>
        )}
      </main>
    </div>
  )
}
