'use client'
// 한국 화폐 안내 — 지폐 카드 + 환율 변환기 + 편의점 가격 감각

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

// 한국은행 공식 페이지 — 실물 화폐 이미지는 저작권 보호 대상이라 직접 게재하지 않고 공식 출처로 연결
// 한국은행 사이트는 한국어(ko)·영어(en)만 지원. zh/ja 이용자는 영어 페이지로 연결
const BOK_BILLS_URL: Record<Lang, string> = {
  ko: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200017',
  en: 'https://www.bok.or.kr/eng/main/contents.do?menuNo=400112',
  zh: 'https://www.bok.or.kr/eng/main/contents.do?menuNo=400112',
  ja: 'https://www.bok.or.kr/eng/main/contents.do?menuNo=400112',
}
const BOK_COINS_URL: Record<Lang, string> = {
  ko: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200367',
  en: 'https://www.bok.or.kr/eng/main/contents.do?menuNo=400113',
  zh: 'https://www.bok.or.kr/eng/main/contents.do?menuNo=400113',
  ja: 'https://www.bok.or.kr/eng/main/contents.do?menuNo=400113',
}

// ramen-log 나라 목록 기반 통화 구성
// defaultRate는 실시간 환율이 아니라 암산하기 좋도록 반올림한 참고용 고정값
// unit: 표시 기준 단위 (환율이 작은 통화는 100/1000 단위가 더 익숙함)
const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', label: 'USD',  symbol: '$',  defaultRate: 1500, unit: 1 },
  { code: 'JPY', flag: '🇯🇵', label: 'JPY',  symbol: '¥',  defaultRate: 10,   unit: 100 },
  { code: 'CNY', flag: '🇨🇳', label: 'CNY',  symbol: '¥',  defaultRate: 200,  unit: 1 },
  { code: 'TWD', flag: '🇹🇼', label: 'TWD',  symbol: 'NT$', defaultRate: 45,  unit: 1 },
  { code: 'VND', flag: '🇻🇳', label: 'VND',  symbol: '₫',  defaultRate: 0.06, unit: 1000 },
  { code: 'THB', flag: '🇹🇭', label: 'THB',  symbol: '฿',  defaultRate: 40,   unit: 1 },
  { code: 'PHP', flag: '🇵🇭', label: 'PHP',  symbol: '₱',  defaultRate: 25,   unit: 1 },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR',  symbol: '€',  defaultRate: 1700, unit: 1 },
] as const
type CurrencyCode = typeof CURRENCIES[number]['code']

const BILLS = [
  {
    amount: 50000,
    color: 'bg-yellow-50 border-yellow-400',
    textColor: 'text-yellow-700',
    numColor: 'text-yellow-900',
    dot: 'bg-yellow-400',
    hint: { ko: '노란색', en: 'Yellow', zh: '黄色', ja: '黄色' },
  },
  {
    amount: 10000,
    color: 'bg-blue-50 border-blue-400',
    textColor: 'text-blue-700',
    numColor: 'text-blue-900',
    dot: 'bg-blue-400',
    hint: { ko: '파란색', en: 'Blue', zh: '蓝色', ja: '青色' },
  },
  {
    amount: 5000,
    color: 'bg-green-50 border-green-400',
    textColor: 'text-green-700',
    numColor: 'text-green-900',
    dot: 'bg-green-400',
    hint: { ko: '초록색', en: 'Green', zh: '绿色', ja: '緑色' },
  },
  {
    amount: 1000,
    color: 'bg-red-50 border-red-300',
    textColor: 'text-red-600',
    numColor: 'text-red-800',
    dot: 'bg-red-400',
    hint: { ko: '붉은색', en: 'Red', zh: '红色', ja: '赤色' },
  },
]

const CVS_ITEMS = [
  { emoji: '🥚', name: { ko: '계란 (1개)', en: 'Egg (1pc)', zh: '鸡蛋(1个)', ja: '卵(1個)' }, price: 500 },
  { emoji: '💧', name: { ko: '생수 (500ml)', en: 'Water (500ml)', zh: '矿泉水 (500ml)', ja: 'ミネラルウォーター (500ml)' }, price: 700 },
  { emoji: '🔺', name: { ko: '삼각김밥', en: 'Triangle kimbap', zh: '三角饭团', ja: 'おにぎり' }, price: 1200 },
  { emoji: '🍜', name: { ko: '컵라면', en: 'Cup ramen', zh: '杯面', ja: 'カップ麺' }, price: 1500 },
  { emoji: '🥤', name: { ko: '음료 (캔)', en: 'Canned drink', zh: '罐装饮料', ja: '缶ジュース' }, price: 1500 },
  { emoji: '🧃', name: { ko: '봉지 과자', en: 'Bag snack', zh: '袋装零食', ja: '袋菓子' }, price: 1500 },
  { emoji: '🍫', name: { ko: '과자/초콜릿', en: 'Snack/chocolate', zh: '零食/巧克力', ja: 'お菓子' }, price: 1800 },
  { emoji: '🍱', name: { ko: '도시락', en: 'Lunch box', zh: '便当', ja: '弁当' }, price: 5500 },
]

const COINS = [
  { amount: 500, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', hint: { ko: '금색', en: 'Gold', zh: '金色', ja: '金色' } },
  { amount: 100, color: 'bg-gray-200 text-gray-700 border-gray-300',       hint: { ko: '은색', en: 'Silver', zh: '银色', ja: '銀色' } },
  { amount: 50,  color: 'bg-gray-100 text-gray-500 border-gray-200',       hint: { ko: '작은 은색', en: 'Small silver', zh: '小银色', ja: '小さな銀' } },
  { amount: 10,  color: 'bg-orange-100 text-orange-700 border-orange-200', hint: { ko: '구리색', en: 'Copper', zh: '铜色', ja: '銅色' } },
]

const LABEL: Record<Lang, {
  title: string
  billsSection: string
  billHint: string
  converterSection: string
  rateLabel: string
  rateEdit: string
  rateDone: string
  rateFluctuates: string
  inputLabel: string
  inputPlaceholder: string
  currencyLabel: string
  cvsSection: string
  cvsNote: string
  coinsSection: string
  coinsNote: string
  coinsHint: string
  coinsWarning: string
  bokBillsLink: string
  bokCoinsLink: string
}> = {
  ko: {
    title: '한국 돈 안내',
    billsSection: '지폐 종류',
    billHint: '한국 지폐에는 커다란 숫자가 적혀 있습니다. 그 숫자가 금액입니다.',
    converterSection: '환율 변환기',
    rateLabel: '참고 환율',
    rateEdit: '수정',
    rateDone: '완료',
    rateFluctuates: '환율은 매일 변동되니, 실제 결제 시점의 환율과 다를 수 있습니다.',
    inputLabel: '원화 금액을 입력하세요',
    inputPlaceholder: '예) 23600',
    currencyLabel: '통화',
    cvsSection: '편의점 가격 감각',
    cvsNote: '대략적인 가격대입니다. 브랜드·지점마다 다를 수 있습니다.',
    coinsSection: '동전',
    coinsNote: '거스름돈으로 받을 수 있습니다.',
    coinsHint: '동전에도 숫자가 적혀 있습니다. 지폐와 마찬가지로 그 숫자가 금액입니다.',
    coinsWarning: '⚠️ 500원과 100원은 크기가 비슷해 보이니 숫자를 꼭 확인하세요.',
    bokBillsLink: '🏦 한국은행에서 실제 지폐 이미지 보기 →',
    bokCoinsLink: '🏦 한국은행에서 실제 동전 이미지 보기 →',
  },
  en: {
    title: 'Korean Money Guide',
    billsSection: 'Banknotes',
    billHint: 'Korean bills have a large number printed on them. That number is the amount.',
    converterSection: 'Currency Converter',
    rateLabel: 'Reference rate',
    rateEdit: 'Edit',
    rateDone: 'Done',
    rateFluctuates: 'Exchange rates change daily, so the actual rate may differ when you pay.',
    inputLabel: 'Enter amount in Korean Won',
    inputPlaceholder: 'e.g. 23600',
    currencyLabel: 'Currency',
    cvsSection: 'Convenience Store Price Guide',
    cvsNote: 'Approximate prices. May vary by brand and location.',
    coinsSection: 'Coins',
    coinsNote: 'You may receive coins as change.',
    coinsHint: 'Coins have numbers too. Just like bills, that number is the amount.',
    coinsWarning: '⚠️ 500 and 100 won coins look similar in size — check the number carefully.',
    bokBillsLink: '🏦 See real banknote images on the Bank of Korea site →',
    bokCoinsLink: '🏦 See real coin images on the Bank of Korea site →',
  },
  zh: {
    title: '韩国货币指南',
    billsSection: '纸币种类',
    billHint: '韩国纸币上印有较大的数字，那个数字就是金额。',
    converterSection: '汇率换算器',
    rateLabel: '参考汇率',
    rateEdit: '修改',
    rateDone: '完成',
    rateFluctuates: '汇率每天都会变动，实际支付时可能会有所不同。',
    inputLabel: '输入韩元金额',
    inputPlaceholder: '例如 23600',
    currencyLabel: '货币',
    cvsSection: '便利店价格参考',
    cvsNote: '价格仅供参考，可能因品牌和门店而异。',
    coinsSection: '硬币',
    coinsNote: '可能作为找零收到。',
    coinsHint: '硬币上也印有数字，和纸币一样，那个数字就是金额。',
    coinsWarning: '⚠️ 500韩元和100韩元硬币大小相似，请仔细确认数字。',
    bokBillsLink: '🏦 在韩国银行官网查看真实纸币图片 →',
    bokCoinsLink: '🏦 在韩国银行官网查看真实硬币图片 →',
  },
  ja: {
    title: '韓国のお金ガイド',
    billsSection: '紙幣の種類',
    billHint: '韓国の紙幣には大きな数字が書かれています。その数字がそのまま金額です。',
    converterSection: '為替換算機',
    rateLabel: '参考為替レート',
    rateEdit: '編集',
    rateDone: '完了',
    rateFluctuates: '為替レートは毎日変動するため、実際の決済時のレートと異なる場合があります。',
    inputLabel: 'ウォン金額を入力',
    inputPlaceholder: '例）23600',
    currencyLabel: '通貨',
    cvsSection: 'コンビニ価格の目安',
    cvsNote: '目安価格です。ブランドや店舗によって異なります。',
    coinsSection: 'コイン',
    coinsNote: 'お釣りとして受け取る場合があります。',
    coinsHint: 'コインにも数字が書かれています。紙幣と同じく、その数字が金額です。',
    coinsWarning: '⚠️ 500ウォンと100ウォンは大きさが似ているので、数字をよく確認してください。',
    bokBillsLink: '🏦 韓国銀行サイトで実際の紙幣画像を見る →',
    bokCoinsLink: '🏦 韓国銀行サイトで実際のコイン画像を見る →',
  },
}

function convertFromKRW(krw: number, rate: number, symbol: string): string {
  const result = krw / rate
  if (result < 0.01) return symbol + result.toFixed(4)
  if (result < 1) return symbol + result.toFixed(2)
  if (result < 100) return symbol + result.toFixed(1)
  return symbol + Math.round(result).toLocaleString()
}

export default function MoneyView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [rateInput, setRateInput] = useState('')
  const [editingRate, setEditingRate] = useState(false)
  const [krwInput, setKrwInput] = useState('')

  const cur = CURRENCIES.find(c => c.code === currency)!
  const rate = parseFloat(rateInput) || cur.defaultRate

  const krwValue = parseInt(krwInput.replace(/,/g, ''), 10)
  const converted = !isNaN(krwValue) && krwValue > 0
    ? convertFromKRW(krwValue, rate, cur.symbol)
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">

        {/* 지폐 카드 목록 */}
        <section className="space-y-3">
          <div>
            <p className="text-base font-bold text-gray-900">{L.billsSection}</p>
            <p className="text-sm font-bold text-gray-600 mt-0.5">{L.billHint}</p>
          </div>

          {BILLS.map(bill => (
            <div key={bill.amount}
              className={`rounded-2xl border-2 ${bill.color} px-4 py-4 space-y-2`}>

              {/* 상단: 색상 점 + 숫자(크게) + KRW(작게) + 환산값 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${bill.dot}`} />
                  <p className={`font-black ${bill.numColor}`}>
                    <span className="text-3xl">{bill.amount.toLocaleString()}</span>
                    <span className={`text-sm font-semibold ml-1 ${bill.textColor} opacity-60`}>KRW</span>
                  </p>
                </div>
                <p className={`text-base font-bold ${bill.textColor} shrink-0`}>
                  ≈ {convertFromKRW(bill.amount, rate, cur.symbol)}
                </p>
              </div>

              {/* 하단: 색상 힌트 */}
              <p className={`pl-5 text-xs ${bill.textColor} opacity-80`}>{bill.hint[lang]}</p>
            </div>
          ))}

          <a href={BOK_BILLS_URL[lang]} target="_blank" rel="noopener noreferrer"
            className="block text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
            {L.bokBillsLink}
          </a>
        </section>

        {/* 환율 변환기 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <p className="text-base font-bold text-gray-900">{L.converterSection}</p>

          {/* 통화 선택 */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">{L.currencyLabel}</p>
            <div className="flex gap-1.5 flex-wrap">
              {CURRENCIES.map(c => (
                <button key={c.code}
                  onClick={() => { setCurrency(c.code); setRateInput('') }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1
                    ${currency === c.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 환율 표시/수정 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-gray-500">{L.rateLabel}</p>
              {editingRate ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">1 {currency} =</span>
                  <input
                    type="number"
                    value={rateInput}
                    onChange={e => setRateInput(e.target.value)}
                    placeholder={String(cur.defaultRate)}
                    className="w-24 text-xs border border-gray-300 rounded-lg px-2 py-1 text-right"
                  />
                  <span className="text-xs text-gray-500">KRW</span>
                  <button
                    onClick={() => setEditingRate(false)}
                    className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-lg">
                    {L.rateDone}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-700">
                    {cur.unit.toLocaleString()} {currency} = {(rate * cur.unit).toLocaleString()} KRW
                  </p>
                  <button
                    onClick={() => { setRateInput(String(rate)); setEditingRate(true) }}
                    className="text-xs text-emerald-600 underline underline-offset-2">
                    {L.rateEdit}
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">{L.rateFluctuates}</p>
          </div>

          {/* KRW 입력 → 변환 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">{L.inputLabel}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={krwInput}
                onChange={e => setKrwInput(e.target.value)}
                placeholder={L.inputPlaceholder}
                className="flex-1 text-2xl font-bold text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 outline-none focus:border-emerald-400"
              />
            </div>
            {converted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-emerald-700">{converted}</p>
              </div>
            )}
          </div>
        </section>

        {/* 편의점 가격 감각 */}
        <section className="space-y-3">
          <div>
            <p className="text-base font-bold text-gray-900">{L.cvsSection}</p>
            <p className="text-xs text-gray-400 mt-0.5">{L.cvsNote}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {CVS_ITEMS.map((item, i) => (
              <div key={i}
                className={`flex items-center justify-between px-4 py-3 gap-3
                  ${i !== CVS_ITEMS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <p className="text-sm font-medium text-gray-800">{item.name[lang]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{item.price.toLocaleString()} KRW</p>
                  <p className="text-xs text-gray-400">≈ {convertFromKRW(item.price, rate, cur.symbol)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 동전 */}
        <section className="space-y-3">
          <div>
            <p className="text-base font-bold text-gray-900">{L.coinsSection}</p>
            <p className="text-sm font-bold text-gray-600 mt-0.5">{L.coinsHint}</p>
            <p className="text-xs text-gray-400 mt-0.5">{L.coinsNote}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {COINS.map(coin => (
              <div key={coin.amount}
                className={`rounded-full border px-4 py-2 flex items-center gap-1.5 ${coin.color}`}>
                <span className="text-sm font-bold">{coin.amount} KRW</span>
                <span className="text-xs opacity-60">{coin.hint[lang]}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">{L.coinsWarning}</p>
          </div>

          <a href={BOK_COINS_URL[lang]} target="_blank" rel="noopener noreferrer"
            className="block text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
            {L.bokCoinsLink}
          </a>
        </section>

      </main>

    </div>
  )
}
