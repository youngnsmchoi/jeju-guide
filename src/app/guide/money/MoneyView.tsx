'use client'
// 한국 화폐 안내 — 지폐 카드 + 환율 변환기 + 편의점 가격 감각

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

// ramen-log 나라 목록 기반 통화 구성
const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', label: 'USD',  symbol: '$',  defaultRate: 1513 },
  { code: 'JPY', flag: '🇯🇵', label: 'JPY',  symbol: '¥',  defaultRate: 10.3 },
  { code: 'CNY', flag: '🇨🇳', label: 'CNY',  symbol: '¥',  defaultRate: 209  },
  { code: 'TWD', flag: '🇹🇼', label: 'TWD',  symbol: 'NT$', defaultRate: 46.5 },
  { code: 'VND', flag: '🇻🇳', label: 'VND',  symbol: '₫',  defaultRate: 0.059 },
  { code: 'THB', flag: '🇹🇭', label: 'THB',  symbol: '฿',  defaultRate: 42.5 },
  { code: 'PHP', flag: '🇵🇭', label: 'PHP',  symbol: '₱',  defaultRate: 26.5 },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR',  symbol: '€',  defaultRate: 1680 },
] as const
type CurrencyCode = typeof CURRENCIES[number]['code']

const BILLS = [
  {
    amount: 50000,
    unitAmount: 10000,
    unitCount: 5,
    color: 'bg-yellow-50 border-yellow-400',
    textColor: 'text-yellow-700',
    numColor: 'text-yellow-900',
    dot: 'bg-yellow-400',
    person: { ko: '신사임당', en: 'Shin Saimdang', zh: '申师任堂', ja: '申師任堂' },
    hint: { ko: '노란색 · 여성 초상', en: 'Yellow · Woman portrait', zh: '黄色 · 女性肖像', ja: '黄色 · 女性の肖像' },
  },
  {
    amount: 10000,
    unitAmount: 5000,
    unitCount: 2,
    color: 'bg-blue-50 border-blue-400',
    textColor: 'text-blue-700',
    numColor: 'text-blue-900',
    dot: 'bg-blue-400',
    person: { ko: '세종대왕', en: 'King Sejong', zh: '世宗大王', ja: '世宗大王' },
    hint: { ko: '파란색 · 왕 초상', en: 'Blue · King portrait', zh: '蓝色 · 国王肖像', ja: '青色 · 王の肖像' },
  },
  {
    amount: 5000,
    unitAmount: 1000,
    unitCount: 5,
    color: 'bg-green-50 border-green-400',
    textColor: 'text-green-700',
    numColor: 'text-green-900',
    dot: 'bg-green-400',
    person: { ko: '율곡 이이', en: 'Yulgok Yi I', zh: '栗谷李珥', ja: '栗谷李珥' },
    hint: { ko: '초록색 · 남성 초상', en: 'Green · Man portrait', zh: '绿色 · 男性肖像', ja: '緑色 · 男性の肖像' },
  },
  {
    amount: 1000,
    unitAmount: null,
    unitCount: null,
    color: 'bg-red-50 border-red-300',
    textColor: 'text-red-600',
    numColor: 'text-red-800',
    dot: 'bg-red-400',
    person: { ko: '이황', en: 'Yi Hwang', zh: '李滉', ja: '李滉' },
    hint: { ko: '붉은색 · 남성 초상', en: 'Red · Man portrait', zh: '红色 · 男性肖像', ja: '赤色 · 男性の肖像' },
  },
]

const CVS_ITEMS = [
  { emoji: '🍜', name: { ko: '컵라면', en: 'Cup ramen', zh: '杯面', ja: 'カップ麺' }, price: 1500 },
  { emoji: '🔺', name: { ko: '삼각김밥', en: 'Triangle kimbap', zh: '三角饭团', ja: 'おにぎり' }, price: 1200 },
  { emoji: '🥤', name: { ko: '음료 (캔)', en: 'Canned drink', zh: '罐装饮料', ja: '缶ジュース' }, price: 1500 },
  { emoji: '🍫', name: { ko: '과자/초콜릿', en: 'Snack/chocolate', zh: '零食/巧克力', ja: 'お菓子' }, price: 1800 },
  { emoji: '🥚', name: { ko: '계란 (1개)', en: 'Egg (1pc)', zh: '鸡蛋(1个)', ja: '卵(1個)' }, price: 500 },
  { emoji: '🧃', name: { ko: '봉지 과자', en: 'Bag snack', zh: '袋装零食', ja: '袋菓子' }, price: 1500 },
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
  equals: string
  converterSection: string
  rateLabel: string
  rateEdit: string
  rateDone: string
  inputLabel: string
  inputPlaceholder: string
  currencyLabel: string
  cvsSection: string
  cvsNote: string
  coinsSection: string
  coinsNote: string
}> = {
  ko: {
    title: '한국 돈 안내',
    billsSection: '지폐 종류',
    billHint: '숫자가 바로 금액입니다',
    equals: '장',
    converterSection: '환율 변환기',
    rateLabel: '현재 환율',
    rateEdit: '수정',
    rateDone: '완료',
    inputLabel: '원화 금액을 입력하세요',
    inputPlaceholder: '예) 23600',
    currencyLabel: '통화',
    cvsSection: '편의점 가격 감각',
    cvsNote: '대략적인 가격대입니다. 브랜드·지점마다 다를 수 있습니다.',
    coinsSection: '동전',
    coinsNote: '거스름돈으로 받을 수 있습니다.',
  },
  en: {
    title: 'Korean Money Guide',
    billsSection: 'Banknotes',
    billHint: 'The number on the bill is the amount',
    equals: 'bills',
    converterSection: 'Currency Converter',
    rateLabel: 'Exchange rate',
    rateEdit: 'Edit',
    rateDone: 'Done',
    inputLabel: 'Enter amount in Korean Won',
    inputPlaceholder: 'e.g. 23600',
    currencyLabel: 'Currency',
    cvsSection: 'Convenience Store Price Guide',
    cvsNote: 'Approximate prices. May vary by brand and location.',
    coinsSection: 'Coins',
    coinsNote: 'You may receive coins as change.',
  },
  zh: {
    title: '韩国货币指南',
    billsSection: '纸币种类',
    billHint: '纸币上的数字就是金额',
    equals: '张',
    converterSection: '汇率换算器',
    rateLabel: '当前汇率',
    rateEdit: '修改',
    rateDone: '完成',
    inputLabel: '输入韩元金额',
    inputPlaceholder: '例如 23600',
    currencyLabel: '货币',
    cvsSection: '便利店价格参考',
    cvsNote: '价格仅供参考，可能因品牌和门店而异。',
    coinsSection: '硬币',
    coinsNote: '可能作为找零收到。',
  },
  ja: {
    title: '韓国のお金ガイド',
    billsSection: '紙幣の種類',
    billHint: '紙幣に書かれた数字がそのまま金額です',
    equals: '枚',
    converterSection: '為替換算機',
    rateLabel: '現在の為替レート',
    rateEdit: '編集',
    rateDone: '完了',
    inputLabel: 'ウォン金額を入力',
    inputPlaceholder: '例）23600',
    currencyLabel: '通貨',
    cvsSection: 'コンビニ価格の目安',
    cvsNote: '目安価格です。ブランドや店舗によって異なります。',
    coinsSection: 'コイン',
    coinsNote: 'お釣りとして受け取る場合があります。',
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

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-20 space-y-6">

        {/* 지폐 카드 목록 */}
        <section className="space-y-3">
          <div>
            <p className="text-base font-bold text-gray-900">{L.billsSection}</p>
            <p className="text-xs text-gray-400 mt-0.5">{L.billHint}</p>
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

              {/* 중단: 단위 지폐 관계 */}
              {bill.unitAmount && bill.unitCount && (
                <p className={`text-xs font-semibold ${bill.textColor} pl-5`}>
                  = {bill.unitAmount.toLocaleString()} KRW × {bill.unitCount}{L.equals}
                </p>
              )}

              {/* 하단: 인물 + 색상 힌트 */}
              <div className={`pl-5 flex items-center gap-2 text-xs ${bill.textColor} opacity-80`}>
                <span className="font-semibold">{bill.person[lang]}</span>
                <span>·</span>
                <span>{bill.hint[lang]}</span>
              </div>
            </div>
          ))}
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
                  1 {currency} = {rate.toLocaleString()} KRW
                </p>
                <button
                  onClick={() => { setRateInput(String(rate)); setEditingRate(true) }}
                  className="text-xs text-emerald-600 underline underline-offset-2">
                  {L.rateEdit}
                </button>
              </div>
            )}
          </div>

          {/* KRW 입력 → 변환 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">{L.inputLabel}</label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-400">₩</span>
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
            <p className="text-xs text-gray-400 mt-0.5">{L.coinsNote}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {COINS.map(coin => (
              <div key={coin.amount}
                className={`rounded-full border px-4 py-2 flex items-center gap-1.5 ${coin.color}`}>
                <span className="text-sm font-bold">₩{coin.amount}</span>
                <span className="text-xs opacity-60">{coin.hint[lang]}</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  )
}
