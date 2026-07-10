'use client'
// 귀국 후 한국 라면을 해외에서 구매할 수 있는 쇼핑 채널 안내

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

const LABEL: Record<Lang, {
  title: string
  intro: string
  online: string
  offline: string
  tip: string
  tipText: string
  goTo: string
}> = {
  ko: {
    title: '해외에서 라면 사기',
    intro: '제주에서 맛있게 먹은 라면, 집에서도 먹고 싶다면?',
    online: '🌐 온라인 구매',
    offline: '🏪 오프라인 구매',
    tip: '💡 팁',
    tipText: '신라면, 불닭볶음면은 세계 어디서나 가장 쉽게 찾을 수 있어요. 처음 찾는다면 이 두 가지부터 검색해보세요.',
    goTo: '바로 가기 →',
  },
  en: {
    title: 'Buy Ramen at Home',
    intro: 'Loved the ramen in Jeju? Here\'s where to find it back home.',
    online: '🌐 Online',
    offline: '🏪 In-store',
    tip: '💡 Tip',
    tipText: 'Shin Ramyun and Buldak (fire noodles) are the easiest to find worldwide. Start by searching for these two.',
    goTo: 'Go →',
  },
  zh: {
    title: '回国后买拉面',
    intro: '在济州吃到的拉面，回家也想吃？',
    online: '🌐 网购',
    offline: '🏪 实体店',
    tip: '💡 小贴士',
    tipText: '辛拉面和火鸡面是全球最容易找到的韩国拉面。第一次找的话，先搜索这两款吧。',
    goTo: '前往 →',
  },
  ja: {
    title: '海外でラーメンを買う',
    intro: '済州で食べたラーメン、帰国後も食べたいなら？',
    online: '🌐 ネット通販',
    offline: '🏪 実店舗',
    tip: '💡 ヒント',
    tipText: '辛ラーメンとブルダック（激辛麺）は世界中で一番見つけやすいです。まずこの2つから探してみましょう。',
    goTo: '移動する →',
  },
}

type Shop = {
  name: string
  desc: Record<Lang, string>
  region: Record<Lang, string>
  url: string
}

const ONLINE_SHOPS: Shop[] = [
  {
    name: 'Amazon',
    desc: {
      ko: '신라면·불닭볶음면 등 주요 제품 모두 판매. 전 세계 배송.',
      en: 'Shin Ramyun, Buldak and most Korean brands available. Ships worldwide.',
      zh: '辛拉面、火鸡面等主要产品均有售，全球配送。',
      ja: '辛ラーメン・ブルダックなど主要商品あり。全世界配送。',
    },
    region: {
      ko: '전 세계',
      en: 'Worldwide',
      zh: '全球',
      ja: '全世界',
    },
    url: 'https://www.amazon.com/s?k=korean+ramen',
  },
  {
    name: 'iHerb',
    desc: {
      ko: '한국 라면 카테고리 별도 운영. 미국·유럽·호주 배송 빠름.',
      en: 'Dedicated Korean ramen section. Fast shipping to US, Europe, and Australia.',
      zh: '设有韩国拉面专区，美国、欧洲、澳大利亚配送快速。',
      ja: '韓国ラーメン専用カテゴリあり。米国・欧州・豪州への配送が速い。',
    },
    region: {
      ko: '미국·유럽·호주',
      en: 'US · Europe · Australia',
      zh: '美国·欧洲·澳大利亚',
      ja: '米国·欧州·豪州',
    },
    url: 'https://www.iherb.com/c/korean-noodles',
  },
  {
    name: 'Weee!',
    desc: {
      ko: '북미 최대 아시안 식품 전문 배달. 신선도 좋고 한국 라면 종류 다양.',
      en: 'Largest Asian grocery delivery in North America. Great selection of Korean ramen.',
      zh: '北美最大亚洲食品配送平台，韩国拉面品种丰富。',
      ja: '北米最大のアジア食品デリバリー。韓国ラーメンの品揃えが豊富。',
    },
    region: {
      ko: '미국·캐나다',
      en: 'US · Canada',
      zh: '美国·加拿大',
      ja: '米国·カナダ',
    },
    url: 'https://www.sayweee.com/en',
  },
  {
    name: 'H-Mart Online',
    desc: {
      ko: '미국·캐나다 한인마트 체인 온라인몰. 라면 외 한국 식품 전반.',
      en: 'Online store of the largest Korean supermarket chain in the US/Canada.',
      zh: '美国/加拿大最大韩国超市连锁的网店，除拉面外还有各类韩国食品。',
      ja: '米国・カナダ最大の韓国系スーパーのオンラインストア。',
    },
    region: {
      ko: '미국·캐나다',
      en: 'US · Canada',
      zh: '美国·加拿大',
      ja: '米国·カナダ',
    },
    url: 'https://www.hmart.com/ramen---noodle',
  },
  {
    name: 'K-Ramen.eu',
    desc: {
      ko: '유럽 전용 한국 라면·아시안 식품 쇼핑몰. 유럽 대부분 국가 배송.',
      en: 'European-focused Korean ramen & Asian food shop. Ships to most EU countries.',
      zh: '专为欧洲设计的韩国拉面和亚洲食品网店，可配送至欧洲大部分国家。',
      ja: 'ヨーロッパ向け韓国ラーメン専門ショップ。ほぼ全EU諸国に配送。',
    },
    region: {
      ko: '유럽',
      en: 'Europe',
      zh: '欧洲',
      ja: 'ヨーロッパ',
    },
    url: 'https://k-ramen.eu/',
  },
  {
    name: 'カルディ (Kaldi)',
    desc: {
      ko: '일본 전국 매장 및 온라인몰. 신라면 등 한국 라면 상시 판매.',
      en: 'Japan-wide coffee & food chain with Korean ramen in-store and online.',
      zh: '日本全国连锁咖啡食品店，线上线下均有售韩国拉面。',
      ja: '全国展開のコーヒー＆食品チェーン。辛ラーメンなど韓国ラーメンを常時販売。',
    },
    region: {
      ko: '일본',
      en: 'Japan',
      zh: '日本',
      ja: '日本',
    },
    url: 'https://www.kaldi.co.jp/ec/Facet?category_0=11080800000',
  },
]

type OfflineStore = {
  name: string
  desc: Record<Lang, string>
  region: Record<Lang, string>
}

const OFFLINE_STORES: OfflineStore[] = [
  {
    name: 'H-Mart',
    desc: {
      ko: '미국·캐나다 주요 도시에 오프라인 매장. 한국 라면 전 제품 취급.',
      en: 'Physical stores in major US & Canadian cities. Full range of Korean ramen.',
      zh: '美国和加拿大主要城市均有实体店，韩国拉面品类齐全。',
      ja: '米国・カナダの主要都市に実店舗あり。韓国ラーメン全品取扱い。',
    },
    region: { ko: '미국·캐나다', en: 'US · Canada', zh: '美国·加拿大', ja: '米国·カナダ' },
  },
  {
    name: 'ドン・キホーテ (Don Quijote)',
    desc: {
      ko: '일본 전국 할인점. 한국 라면 코너 별도 운영, 가격 저렴.',
      en: 'Japan\'s nationwide discount chain. Dedicated Korean ramen section at low prices.',
      zh: '日本全国折扣连锁店，设有韩国拉面专区，价格实惠。',
      ja: '全国展開のディスカウントストア。韓国ラーメンコーナーあり、価格も安い。',
    },
    region: { ko: '일본', en: 'Japan', zh: '日本', ja: '日本' },
  },
  {
    name: '업무슈퍼 (Gyomu Super)',
    desc: {
      ko: '일본 식품 전문 대형마트. 한국 라면 박스 단위 저렴하게 구매 가능.',
      en: 'Japanese bulk grocery chain. Korean ramen available by the box at great prices.',
      zh: '日本专业食品大型超市，可按箱购买韩国拉面，价格实惠。',
      ja: '業務用食品専門スーパー。韓国ラーメンをケース単位で安く買える。',
    },
    region: { ko: '일본', en: 'Japan', zh: '日本', ja: '日本' },
  },
  {
    name: 'Asian / Korean Supermarkets',
    desc: {
      ko: '세계 주요 도시의 한인마트·아시안마트에서 구매 가능. "Korean grocery"로 검색.',
      en: 'Available at Korean or Asian supermarkets in most major cities. Search "Korean grocery near me".',
      zh: '全球主要城市的韩国超市或亚洲超市均可购买。搜索"Korean grocery"即可找到。',
      ja: '世界の主要都市の韓国系・アジア系スーパーで購入可能。"Korean grocery"で検索。',
    },
    region: { ko: '전 세계', en: 'Worldwide', zh: '全球', ja: '全世界' },
  },
]

export default function BuyOverseasView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-20 space-y-5">

        {/* 인트로 */}
        <div className="bg-emerald-700 text-white rounded-2xl px-4 py-4">
          <p className="text-sm font-medium leading-relaxed">{L.intro}</p>
        </div>

        {/* 팁 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
          <p className="text-xs font-bold text-yellow-800 mb-1">{L.tip}</p>
          <p className="text-xs text-yellow-700 leading-relaxed">{L.tipText}</p>
        </div>

        {/* 온라인 구매 */}
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">{L.online}</p>
          <div className="space-y-3">
            {ONLINE_SHOPS.map((shop) => (
              <a
                key={shop.name}
                href={shop.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-gray-900">{shop.name}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{shop.region[lang]}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{shop.desc[lang]}</p>
                <p className="text-xs text-emerald-600 mt-2 font-medium">{L.goTo}</p>
              </a>
            ))}
          </div>
        </div>

        {/* 오프라인 구매 */}
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">{L.offline}</p>
          <div className="space-y-3">
            {OFFLINE_STORES.map((store) => (
              <div
                key={store.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-gray-900">{store.name}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{store.region[lang]}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{store.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
      <BottomNav />
    </div>
  )
}
