'use client'
// 한국 편의점 영수증 읽는 법 — 실제 영수증 4종 샘플과 할인 방식별 탭 설명

import { useState } from 'react'
import Image from 'next/image'
import type { Lang } from '@/lib/types'

type TabKey = 'basic' | 'mix' | 'alcohol' | 'bulk'

const TABS: TabKey[] = ['basic', 'mix', 'alcohol', 'bulk']

const IMAGE_SRC: Record<TabKey, string> = {
  basic: '/images/receipts/receipt-1plus1-basic.png',
  mix: '/images/receipts/receipt-mix-match.png',
  alcohol: '/images/receipts/receipt-alcohol.png',
  bulk: '/images/receipts/receipt-bulk-discount.png',
}

// 실제 이미지 픽셀 비율 (여백 없이 딱 맞게 표시하기 위함)
const IMAGE_RATIO: Record<TabKey, number> = {
  basic: 1200 / 1027,
  mix: 1200 / 988,
  alcohol: 1141 / 1200,
  bulk: 1200 / 1079,
}

const LABEL: Record<Lang, {
  tabNames: Record<TabKey, string>
  storeName: string
  storeAddress: string
  body: Record<TabKey, string[]>
}> = {
  ko: {
    tabNames: { basic: '1+1 기본', mix: '섞어 담기', alcohol: '주류 할인', bulk: '개수별 할인' },
    storeName: '제주마트 애월점',
    storeAddress: '제주특별자치도 제주시 애월읍 애월로 123',
    body: {
      basic: [
        '1+1 대상이 아닌 상품(영수증 표기: 파워에이드제로P600)은 2개를 사면 그냥 정가로 2개 값이 찍힙니다.',
        '1+1 대상 상품(영수증 표기: 게토레이제로P600)은 1개만 계산대에 올리면, 점원이 한국어로 "1개 더 가져오셔야 해요"라고 안내합니다. 말이 안 통하면 서로 곤란해질 수 있어요.',
        '1+1을 받으려면 반드시 같은 상품 1개를 더 가져와야 합니다. 받고 싶지 않으면 "1개만 살게요"라고 말하면 정가로 계산됩니다.',
        '만약 매대에 재고가 1개뿐이면, 한국인은 "키핑"이라는 제도로 모바일 쿠폰을 받아 한 달 내 같은 편의점에서 나머지 1개를 나중에 받습니다. 이 제도는 보통 앱 회원가입이 필요해 외국인 관광객은 이용하기 어렵습니다.',
      ],
      mix: [
        '1+1 대상 음료(영수증 표기: 게토레이제로P600)와 전혀 다른 상품(영수증 표기: MIIX아이스더블, 액상카트리지플러스 등)을 함께 계산해도, 1+1은 정확히 대상 상품끼리만 적용됩니다.',
        '순서 상관없이 섞어서 계산대에 올려도 괜찮습니다.',
        '어떤 상품이 1+1 대상인지는 진열대에 붙어있는 "숏카드"(가격 안내 카드)를 보면 알 수 있습니다.',
      ],
      alcohol: [
        '주류는 1+1보다 "여러 개 사면 할인" 방식이 많습니다.',
        '이 영수증 예시(영수증 표기: 대표밀맥주캔500ml): 1개 정가 4,000원, 4개 사면 16,000원이 찍힌 뒤 "상품할인 -6,000원"이 적용되어 실제로는 10,000원(1개당 2,500원)만 결제됩니다.',
        '냉장고 유리문에 안내지가 붙어있기도 하지만, 여러 종류가 섞여있어 알아보기 쉽지 않습니다.',
        '진열대의 "숏카드"를 보면 "1개 4,000원 / 4개 10,000원"처럼 정가와 묶음가가 나란히 적혀 있어 더 명확합니다.',
        '병 음료는 공병보증금(위 예시는 100원)이 별도로 붙습니다.',
      ],
      bulk: [
        '주로 아이스크림에 적용되는 방식입니다. (다른 상품에도 있을 수 있습니다.)',
        '1+1이 아니라, 같은 가격대 상품을 몇 개 사는지에 따라 할인율이 자동으로 정해집니다.',
        '이 영수증 예시(영수증 표기: 쌍쌍바): 1,500원짜리 아이스크림 5개(정가 7,500원)를 구입 → 5개 구매 시 50% 할인이 적용되어 3,750원만 결제됩니다.',
        '몇 개 사면 몇 % 할인인지는 진열대의 숏카드를 보고 확인해야 합니다.',
      ],
    },
  },
  en: {
    tabNames: { basic: '1+1 Basics', mix: 'Mix & Match', alcohol: 'Alcohol Discounts', bulk: 'Bulk Discounts' },
    storeName: 'Jeju Mart Aewol Branch',
    storeAddress: '123 Aewol-ro, Aewol-eup, Jeju-si, Jeju Special Self-Governing Province',
    body: {
      basic: [
        'For items NOT part of a 1+1 deal (receipt shows: 파워에이드제로P600 / Powerade Zero P600), buying 2 just charges full price for both.',
        'For 1+1 items (receipt shows: 게토레이제로P600 / Gatorade Zero P600), if you only bring 1 to the counter, the clerk will tell you in Korean to bring one more. This can be confusing if you don\'t speak Korean.',
        'To get the 1+1 deal, you must bring a second identical item. If you don\'t want it, just say "one only" ("hana-man salgeyo") and you\'ll be charged full price.',
        'If the shelf only has 1 left, Koreans use a "keeping" system to get a mobile coupon for the second item within a month at the same store. This usually requires an app account, making it hard for tourists.',
      ],
      mix: [
        'Even if you check out a 1+1 drink (receipt shows: 게토레이제로P600 / Gatorade Zero P600) together with completely different items (receipt shows: MIIX아이스더블, 액상카트리지플러스 — ice cream, e-cigarette liquid cartridge, etc.), the 1+1 discount still applies correctly, only to the matching items.',
        'You can mix them in any order at the counter — no problem.',
        'Look for the "short card" (price info card) on the shelf to see which items qualify for 1+1.',
      ],
      alcohol: [
        'Alcohol more often uses "buy multiple, get a discount" rather than 1+1.',
        'Example from this receipt (receipt shows: 대표밀맥주캔500ml / a 500ml beer can): 4,000 won each. Buying 4 shows 16,000 won, then a "product discount of -6,000 won" is applied, so you actually pay 10,000 won (2,500 won each).',
        'Fridge doors sometimes have discount signs, but they mix many products together and can be hard to read.',
        'The shelf "short card" is clearer — it shows the single price and bundle price side by side, like "4,000 won each / 4 for 10,000 won."',
        'Bottled drinks may add a separate bottle deposit (100 won in this example).',
      ],
      bulk: [
        'This is mostly seen with ice cream. (Other items may use it too.)',
        'Instead of 1+1, the discount rate is automatically set based on how many same-priced items you buy.',
        'Example from this receipt (receipt shows: 쌍쌍바 / "Ssang Ssang Bar" ice cream): five 1,500-won ice creams (7,500 won full price) — buying 5 triggers a 50% discount, so you pay only 3,750 won.',
        'Check the shelf\'s short card to see how many items you need for which discount.',
      ],
    },
  },
  zh: {
    tabNames: { basic: '1+1基本', mix: '混合结账', alcohol: '酒类折扣', bulk: '按数量折扣' },
    storeName: '济州超市涯月店',
    storeAddress: '济州特别自治道济州市涯月邑涯月路123',
    body: {
      basic: [
        '非1+1商品（小票上写的是：파워에이드제로P600 / Powerade Zero P600）买2个的话，就按原价计算2个的价格。',
        '1+1商品（小票上写的是：게토레이제로P600 / Gatorade Zero P600）如果只拿1个去结账，店员会用韩语告诉你需要再拿一个。如果语言不通，可能会造成沟通困难。',
        '要获得1+1优惠，必须再拿一件相同的商品。如果不需要，只说"一个就好"（하나만 살게요），就会按原价结账。',
        '如果货架上只剩1个，韩国人会使用"keeping"制度，领取手机优惠券，一个月内在同一家店领取第二件。这通常需要注册应用账户，外国游客较难使用。',
      ],
      mix: [
        '即使把1+1饮料（小票上写的是：게토레이제로P600 / Gatorade Zero P600）和完全不同的商品（小票上写的是：MIIX아이스더블、액상카트리지플러스 — 冰淇淋、电子烟油弹等）一起结账，1+1优惠依然只会准确应用于符合条件的商品上。',
        '可以不按顺序混合放在收银台，没有问题。',
        '货架上的"价签卡"（价格说明卡）会标明哪些商品适用1+1。',
      ],
      alcohol: [
        '酒类比起1+1，更常见"买多个打折"的方式。',
        '本收据示例（小票上写的是：대표밀맥주캔500ml / 500ml啤酒罐）：单价4,000韩元，买4个显示16,000韩元，随后应用"商品折扣-6,000韩元"，实际只需支付10,000韩元（每个2,500韩元）。',
        '冰箱玻璃门上有时会贴折扣海报，但由于混合了多种商品，不太容易看清楚。',
        '货架上的"价签卡"更清晰，会并排标注单价和套装价，例如"单个4,000韩元 / 4个10,000韩元"。',
        '瓶装饮料可能会另外收取瓶子押金（本例为100韩元）。',
      ],
      bulk: [
        '主要见于冰淇淋。（其他商品也可能有此方式。）',
        '不是1+1，而是根据购买同价位商品的数量，自动确定折扣率。',
        '本收据示例（小票上写的是：쌍쌍바 / "双双棒"冰淇淋）：购买5个1,500韩元的冰淇淋（原价7,500韩元）→ 购买5个可享受50%折扣，实际只需支付3,750韩元。',
        '具体购买多少个可享受多少折扣，需查看货架上的价签卡确认。',
      ],
    },
  },
  ja: {
    tabNames: { basic: '1+1基本', mix: '混ぜて会計', alcohol: '酒類割引', bulk: '個数別割引' },
    storeName: '済州マート涯月店',
    storeAddress: '済州特別自治道済州市涯月邑涯月路123',
    body: {
      basic: [
        '1+1対象外の商品（レシート表記：파워에이드제로P600／パワーエイドゼロP600）を2個買うと、そのまま定価で2個分の金額になります。',
        '1+1対象商品（レシート表記：게토레이제로P600／ゲータレードゼロP600）を1個だけレジに持っていくと、店員が韓国語で「もう1個持ってきてください」と案内します。言葉が通じないと困ることがあります。',
        '1+1を受けるには、必ず同じ商品をもう1個持ってくる必要があります。不要な場合は「1個だけ買います」と言えば定価で会計されます。',
        '棚に在庫が1個しかない場合、韓国人は「キーピング」という制度でモバイルクーポンを受け取り、1ヶ月以内に同じ店舗で残りの1個を受け取ります。この制度は通常アプリの会員登録が必要なため、外国人観光客には利用しづらいです。',
      ],
      mix: [
        '1+1対象の飲料（レシート表記：게토레이제로P600／ゲータレードゼロP600）と全く違う商品（レシート表記：MIIX아이스더블、액상카트리지플러스 — アイスクリーム、電子タバコ用リキッドカートリッジなど）を一緒に会計しても、1+1は対象商品同士にのみ正確に適用されます。',
        '順番を気にせず混ぜてレジに出しても問題ありません。',
        'どの商品が1+1対象かは、棚に貼られている「ショートカード」（価格案内カード）で確認できます。',
      ],
      alcohol: [
        '酒類は1+1より「複数購入で割引」の方式が多いです。',
        'このレシート例（レシート表記：대표밀맥주캔500ml／ビール缶500ml）：1個の定価は4,000ウォン、4個買うと16,000ウォンと表示された後「商品割引-6,000ウォン」が適用され、実際には10,000ウォン（1個あたり2,500ウォン）のみ支払います。',
        '冷蔵庫のガラス扉に案内が貼られていることもありますが、複数の種類が混在していて分かりにくいです。',
        '棚の「ショートカード」の方が分かりやすく、「1個4,000ウォン／4個10,000ウォン」のように単価とセット価格が並んで書かれています。',
        '瓶飲料は別途、瓶の保証金（この例では100ウォン）が加算されることがあります。',
      ],
      bulk: [
        '主にアイスクリームに適用される方式です。（他の商品にもある場合があります。）',
        '1+1ではなく、同じ価格帯の商品を何個買うかによって割引率が自動的に決まります。',
        'このレシート例（レシート表記：쌍쌍바／「サンサンバー」アイスクリーム）：1,500ウォンのアイスクリームを5個購入（定価7,500ウォン）→ 5個購入で50%割引が適用され、実際には3,750ウォンのみ支払います。',
        '何個買うと何%割引になるかは、棚のショートカードで確認する必要があります。',
      ],
    },
  },
}

export default function ReceiptSamples({ lang }: { lang: Lang }) {
  const L = LABEL[lang]
  const [tab, setTab] = useState<TabKey>('basic')

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
              ${tab === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
            {L.tabNames[t]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-sky-100">
        {/* 가상 상호/주소 헤더 — 실제 매장과 무관한 예시 */}
        <div className="bg-gray-800 text-white px-3 py-2 text-center">
          <p className="text-xs font-bold">{L.storeName}</p>
          <p className="text-[10px] text-gray-300">{L.storeAddress}</p>
        </div>
        <div className="relative w-full bg-sky-100" style={{ aspectRatio: IMAGE_RATIO[tab] }}>
          <Image
            src={IMAGE_SRC[tab]}
            alt={L.tabNames[tab]}
            fill
            className="object-contain"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
      </div>

      <ul className="space-y-1.5">
        {L.body[tab].map((line, i) => (
          <li key={i} className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
