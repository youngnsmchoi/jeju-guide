'use client'
// 편의점 꿀팁 — 전자레인지·삼각김밥 등 외국인 실용 안내

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

type Tab = 'microwave' | 'toilet' | 'trash' | 'wifi' | 'common'
const TABS: Tab[] = ['microwave', 'toilet', 'trash', 'wifi', 'common']

const LABEL: Record<Lang, {
  title: string
  tabMicrowave: string
  tabToilet: string
  tabTrash: string
  tabWifi: string
  tabCommon: string
  microwave: {
    title: string
    steps: string[]
    timeTableTitle: string
    timeTable: string[]
    exampleLabel: string
    buttonGuide: string[]
    warning: string
    phraseLabel: string
    phrase: string
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
  common: {
    title: string
    points: string[]
  }
  tmoneyLink: string
  expand: string
}> = {
  ko: {
    title: '편의점 꿀팁',
    tabMicrowave: '🔥 전자레인지',
    tabToilet: '🚻 화장실',
    tabTrash: '🗑️ 쓰레기',
    tabWifi: '📶 와이파이',
    tabCommon: '🏪 공통 정보',
    microwave: {
      title: '🔥 전자레인지 사용법',
      steps: [
        '전자레인지를 찾으세요. (의자·탁자가 있는 취식 공간 주변에 있습니다)',
        '제품(삼각김밥, 김밥, 도시락 등) 포장에 적힌 설명서에 따라 뚜껑을 열거나 그대로 넣으세요.',
        '시간 버튼을 눌러 원하는 시간을 맞추고 시작 버튼을 누르세요.',
        '다 되면 조심히 꺼내세요. 용기가 뜨겁습니다.',
      ],
      timeTableTitle: '⏱️ 시간 참고표',
      timeTable: [
        '삼각김밥: 1000W(편의점 전자레인지) 기준 20~30초 · 700W(가정용) 기준 35~40초',
        '도시락: 뚜껑 제거 후 1분 40초(매장용) · 2분(가정용)',
      ],
      exampleLabel: '📸 실물 예시: 이 도시락은 "1분 40초"라고 적혀 있어요. 전자레인지에서는 이렇게 시간 버튼을 눌러 맞추고 시작하면 됩니다.',
      buttonGuide: [
        '① "1분" 버튼 1번 누르기',
        '② "30초" 버튼 1번 누르기',
        '③ "10초" 버튼 1번 누르기 (1분+30초+10초 = 1분 40초)',
        '④ "시작" 버튼 누르기',
      ],
      warning: '⚠️ 알루미늄 용기·포일은 절대 넣지 마세요. 불이 날 수 있습니다.',
      phraseLabel: '점원에게 부탁할 때',
      phrase: '데워주세요',
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
      intro: '한국은 쓰레기를 일반쓰레기·음식물쓰레기·캔·병·플라스틱, 이렇게 나눠서 버립니다. 매장 안 쓰레기통도 이 3가지로 분리되어 있는 경우가 많아요.',
      points: [
        '비닐 포장지, 냅킨 등은 "일반쓰레기(General Waste)" 칸에 버리세요.',
        '먹다 남은 음식물은 "음식물쓰레기(Food Waste)" 칸에 버리세요.',
        '캔·병·플라스틱 용기(컵라면 용기 포함)는 "캔·병·플라스틱(Can·Bottle·Plastic)" 칸에 버리세요.',
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
    common: {
      title: '🏪 모든 편의점 공통 특징',
      points: [
        '24시간 운영 (일부 매장 제외)',
        '라면 취식 공간(이트인) 대부분 보유',
        '컵라면용 온수기 비치',
        '카드·현금 모두 결제 가능',
        '냉장·냉동 식품, 음료, 간식 판매',
      ],
    },
    tmoneyLink: '🚇 교통카드(T-money) 자세히 보기 →',
    expand: '확대',
  },
  en: {
    title: 'CVS Tips',
    tabMicrowave: '🔥 Microwave',
    tabToilet: '🚻 Toilet',
    tabTrash: '🗑️ Trash',
    tabWifi: '📶 Wi-Fi',
    tabCommon: '🏪 General Info',
    microwave: {
      title: '🔥 How to use the microwave',
      steps: [
        'Find the microwave. (It\'s usually near the eat-in seating area with chairs and tables.)',
        'Follow the instructions printed on the food package (triangle kimbap, gimbap, bento, etc.) — open the lid or leave it as is, depending on the product.',
        'Press the time button to set how long you need, then press start.',
        'Remove carefully — the container will be hot.',
      ],
      timeTableTitle: '⏱️ Time reference',
      timeTable: [
        'Triangle kimbap: about 20–30 sec at 1000W (store microwave) · 35–40 sec at 700W (home microwave)',
        'Bento (dosirak): remove the lid first, then 1 min 40 sec (store microwave) · 2 min (home microwave)',
      ],
      exampleLabel: '📸 Real example: this bento says "1 min 40 sec." On the microwave, you\'d press the time buttons to set that, then press start — like this.',
      buttonGuide: [
        '① Press the "1 min" (1분) button once',
        '② Press the "30 sec" (30초) button once',
        '③ Press the "10 sec" (10초) button once (1 min + 30 sec + 10 sec = 1 min 40 sec)',
        '④ Press "Start" (시작)',
      ],
      warning: '⚠️ Never put aluminum containers or foil inside. It can cause a fire.',
      phraseLabel: 'Ask the staff',
      phrase: '데워주세요 (Please heat this up)',
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
      intro: 'Korea sorts trash into three types: general waste, food waste, and cans/bottles/plastic. In-store trash bins are often split the same way.',
      points: [
        'Wrappers, napkins, etc. go in the "General Waste" slot.',
        'Leftover food goes in the "Food Waste" slot.',
        'Cans, bottles, and plastic containers (including cup noodle containers) go in the "Can·Bottle·Plastic" slot.',
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
    common: {
      title: '🏪 What All Convenience Stores Have',
      points: [
        'Open 24 hours (most locations)',
        'Eat-in seating area in most stores',
        'Hot water dispenser for cup ramen',
        'Card and cash both accepted',
        'Chilled drinks, snacks, and frozen foods',
      ],
    },
    tmoneyLink: '🚇 See Transit Card (T-money) Guide →',
    expand: 'Show',
  },
  zh: {
    title: '便利店小贴士',
    tabMicrowave: '🔥 微波炉',
    tabToilet: '🚻 洗手间',
    tabTrash: '🗑️ 垃圾分类',
    tabWifi: '📶 WiFi',
    tabCommon: '🏪 通用信息',
    microwave: {
      title: '🔥 微波炉使用方法',
      steps: [
        '找到微波炉。（通常在有椅子和桌子的用餐区附近）',
        '请按照食品包装（饭团、紫菜包饭、便当等）上印的说明操作——根据产品打开盖子或直接放入。',
        '按时间按钮设置所需时间，然后按开始键。',
        '小心取出，容器会很烫。',
      ],
      timeTableTitle: '⏱️ 时间参考',
      timeTable: [
        '饭团：1000W（便利店微波炉）约20~30秒 · 700W（家用微波炉）约35~40秒',
        '便当：先取下盖子，1分40秒（店用微波炉）· 2分钟（家用微波炉）',
      ],
      exampleLabel: '📸 实物示例：这个便当上写着"1分40秒"。在微波炉上，按时间按钮设置好这个时间后按开始即可，如下图所示。',
      buttonGuide: [
        '① 按一次"1分"（1분）按钮',
        '② 按一次"30秒"（30초）按钮',
        '③ 按一次"10秒"（10초）按钮（1分+30秒+10秒＝1分40秒）',
        '④ 按"开始"（시작）按钮',
      ],
      warning: '⚠️ 绝对不能放铝制容器或锡纸，可能引起火灾。',
      phraseLabel: '请店员帮忙时',
      phrase: '데워주세요（请帮我加热）',
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
      intro: '韩国将垃圾分为一般垃圾、食物垃圾、罐·瓶·塑料三大类，店内垃圾桶也常按此分类。',
      points: [
        '包装袋、纸巾等请丢入"一般垃圾（General Waste）"口。',
        '吃剩的食物请倒入"食物垃圾（Food Waste）"口。',
        '罐、瓶、塑料容器（包括杯面容器）请丢入"罐·瓶·塑料（Can·Bottle·Plastic）"口。',
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
    common: {
      title: '🏪 所有便利店共同特点',
      points: [
        '24小时营业（部分门店除外）',
        '大多数门店设有堂食区',
        '配备杯面专用热水机',
        '支持刷卡和现金付款',
        '销售冷藏饮料、零食及冷冻食品',
      ],
    },
    tmoneyLink: '🚇 查看交通卡(T-money)详情 →',
    expand: '放大',
  },
  ja: {
    title: 'コンビニお役立ち情報',
    tabMicrowave: '🔥 電子レンジ',
    tabToilet: '🚻 トイレ',
    tabTrash: '🗑️ ゴミ分別',
    tabWifi: '📶 Wi-Fi',
    tabCommon: '🏪 共通情報',
    microwave: {
      title: '🔥 電子レンジの使い方',
      steps: [
        '電子レンジを探してください。（椅子・テーブルがあるイートインスペース付近にあります）',
        '商品（おにぎり、のり巻き、弁当など）のパッケージに書かれた説明に従ってください。フタを開けるか、そのまま入れるかは商品によります。',
        '時間ボタンを押して必要な時間を設定し、スタートボタンを押してください。',
        '容器が熱いので気をつけて取り出してください。',
      ],
      timeTableTitle: '⏱️ 時間の目安',
      timeTable: [
        'おにぎり：1000W（コンビニの電子レンジ）で約20〜30秒 ・ 700W（家庭用）で約35〜40秒',
        '弁当：フタを外してから1分40秒（店舗用）・ 2分（家庭用）',
      ],
      exampleLabel: '📸 実物例：この弁当には「1分40秒」と書かれています。電子レンジではこのように時間ボタンを押して設定し、スタートを押してください。',
      buttonGuide: [
        '① 「1分」（1분）ボタンを1回押す',
        '② 「30秒」（30초）ボタンを1回押す',
        '③ 「10秒」（10초）ボタンを1回押す（1分＋30秒＋10秒＝1分40秒）',
        '④ 「スタート」（시작）ボタンを押す',
      ],
      warning: '⚠️ アルミ容器やアルミホイルは絶対に入れないでください。火災の原因になります。',
      phraseLabel: '店員に頼むとき',
      phrase: '데워주세요（温めてください）',
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
      intro: '韓国ではゴミを一般ゴミ・食品ゴミ・缶びんプラスチックの3種類に分けて捨てます。店内のゴミ箱もこの3分類になっていることが多いです。',
      points: [
        '包装フィルムやナプキンなどは「一般ゴミ（General Waste）」口に捨ててください。',
        '食べ残しは「食品ゴミ（Food Waste）」口に捨ててください。',
        '缶・びん・プラスチック容器（カップ麺の容器含む）は「缶びんプラスチック（Can・Bottle・Plastic）」口に捨ててください。',
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
    common: {
      title: '🏪 全コンビニ共通の特徴',
      points: [
        '24時間営業（一部店舗を除く）',
        'ほとんどの店舗にイートインスペースあり',
        'カップ麺用お湯サーバー設置',
        'カード・現金どちらも利用可能',
        '冷蔵飲料・スナック・冷凍食品販売',
      ],
    },
    tmoneyLink: '🚇 交通カード(T-money)の詳細を見る →',
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
  const searchParams = useSearchParams()
  const initialTab = TABS.includes(searchParams.get('tab') as Tab) ? (searchParams.get('tab') as Tab) : 'microwave'
  const [tab, setTab] = useState<Tab>(initialTab)

  const tabLabel = (t: Tab): string => ({
    microwave: L.tabMicrowave,
    toilet: L.tabToilet,
    trash: L.tabTrash,
    wifi: L.tabWifi,
    common: L.tabCommon,
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
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-orange-800">{L.microwave.timeTableTitle}</p>
              {L.microwave.timeTable.map((line, i) => (
                <p key={i} className="text-xs text-orange-700 leading-relaxed">{line}</p>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-700">{L.microwave.exampleLabel}</p>
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-50" style={{ aspectRatio: 1000 / 984 }}>
              <Image src="/images/cvs-tips/dosirak.png" alt="dosirak time label example" fill className="object-contain" sizes="(max-width: 512px) 100vw, 512px" />
            </div>
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-50" style={{ aspectRatio: 1000 / 561 }}>
              <Image src="/images/cvs-tips/microwave.png" alt={L.microwave.title} fill className="object-contain" sizes="(max-width: 512px) 100vw, 512px" />
            </div>
            <ol className="space-y-1">
              {L.microwave.buttonGuide.map((line, i) => (
                <li key={i} className="text-xs text-gray-600 leading-relaxed">{line}</li>
              ))}
            </ol>

            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <p className="text-xs text-red-700">{L.microwave.warning}</p>
            </div>
            <p className="text-xs text-gray-500 font-medium">{L.microwave.phraseLabel}</p>
            <PhraseButton phrase={L.microwave.phrase} expandLabel={L.expand} />
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
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-50" style={{ aspectRatio: 1000 / 690 }}>
              <Image src="/images/cvs-tips/trash-bins.png" alt={L.trash.title} fill className="object-contain" sizes="(max-width: 512px) 100vw, 512px" />
            </div>
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

        {tab === 'common' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <p className="text-sm font-bold text-gray-800">{L.common.title}</p>
            <ul className="space-y-2">
              {L.common.points.map((point, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link href="/guide/link-tmoney"
              className="block text-sm font-medium text-emerald-700 hover:text-emerald-800 pt-1">
              {L.tmoneyLink}
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
