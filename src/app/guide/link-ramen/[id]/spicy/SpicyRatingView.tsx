'use client'
// 나라별 맵기 평가 제출/조회 화면 — 우리는 판단하지 않고 이용자 평가의 평균만 참고치로 보여줌

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/context/LangContext'
import type { LinkRamenItem, Lang } from '@/lib/types'
import { getLinkRamenField } from '@/lib/types'
import { COUNTRIES, getCountryName } from '@/lib/countries'
import NavBar from '@/components/NavBar'

const LABEL: Record<Lang, {
  back: string
  intro: string
  selectCountry: string
  selectLevel: string
  submit: string
  submitted: string
  alreadyRated: string
  levelNames: string[]
  viewAverage: string
  averageResult: (avg: number, count: number) => string
  notEnough: (count: number, min: number) => string
  referenceNote: string
}> = {
  ko: {
    back: '← 목록으로',
    intro: '이 라면이 얼마나 매운지, 여러분의 나라 기준으로 평가해주세요. 이용자들의 평가를 모은 참고 자료이며, 공식 정보가 아닙니다.',
    selectCountry: '내 나라 선택',
    selectLevel: '느낀 맵기 정도',
    submit: '평가 제출하기',
    submitted: '평가해주셔서 감사합니다!',
    alreadyRated: '이미 최근에 평가하셨어요. 24시간 후 다시 시도해주세요.',
    levelNames: ['0 - 안 매움', '1 - 약간 매움', '2 - 보통 매움', '3 - 매움', '4 - 매우 매움'],
    viewAverage: '평가 결과 보기',
    averageResult: (avg, count) => `참고 평균: ${avg}단계 (${count}명 평가)`,
    notEnough: (count, min) => `아직 평가가 부족해요 (${count}/${min}명). 평가를 남겨주세요!`,
    referenceNote: '⚠️ 이 수치는 이용자 평가를 모은 참고용입니다. 개인차가 있을 수 있어요.',
  },
  en: {
    back: '← Back to list',
    intro: 'Rate how spicy this ramen felt to you, based on your country. This is a crowd-sourced reference from users, not official data.',
    selectCountry: 'Select your country',
    selectLevel: 'How spicy did it feel?',
    submit: 'Submit Rating',
    submitted: 'Thanks for your rating!',
    alreadyRated: 'You already rated this recently. Please try again in 24 hours.',
    levelNames: ['0 - Not spicy', '1 - Mild', '2 - Medium', '3 - Spicy', '4 - Very spicy'],
    viewAverage: 'View Results',
    averageResult: (avg, count) => `Reference average: Level ${avg} (${count} ratings)`,
    notEnough: (count, min) => `Not enough ratings yet (${count}/${min}). Be the first to rate!`,
    referenceNote: '⚠️ This is a crowd-sourced reference only. Individual experience may vary.',
  },
  zh: {
    back: '← 返回列表',
    intro: '请根据您的国家标准，评价这款拉面有多辣。这是用户评价汇总的参考资料，并非官方信息。',
    selectCountry: '选择您的国家',
    selectLevel: '您感觉的辣度',
    submit: '提交评价',
    submitted: '感谢您的评价！',
    alreadyRated: '您最近已评价过。请24小时后再试。',
    levelNames: ['0 - 不辣', '1 - 微辣', '2 - 中辣', '3 - 辣', '4 - 非常辣'],
    viewAverage: '查看评价结果',
    averageResult: (avg, count) => `参考平均值：${avg}级（${count}人评价）`,
    notEnough: (count, min) => `评价数量不足（${count}/${min}人）。请留下您的评价！`,
    referenceNote: '⚠️ 此数值仅为用户评价汇总的参考值，个人感受可能不同。',
  },
  ja: {
    back: '← 一覧に戻る',
    intro: 'このラーメンがどれくらい辛かったか、あなたの国基準で評価してください。ユーザーの評価を集めた参考資料であり、公式情報ではありません。',
    selectCountry: '国を選択',
    selectLevel: '感じた辛さ',
    submit: '評価を送信',
    submitted: '評価ありがとうございます！',
    alreadyRated: '最近すでに評価済みです。24時間後にもう一度お試しください。',
    levelNames: ['0 - 辛くない', '1 - やや辛い', '2 - 普通', '3 - 辛い', '4 - とても辛い'],
    viewAverage: '評価結果を見る',
    averageResult: (avg, count) => `参考平均：${avg}段階（${count}人評価）`,
    notEnough: (count, min) => `まだ評価が足りません（${count}/${min}人）。評価をお願いします！`,
    referenceNote: '⚠️ この数値はユーザー評価を集めた参考値です。個人差があります。',
  },
}

const MIN_RATINGS = 5

export default function SpicyRatingView({ item }: { item: LinkRamenItem }) {
  const { lang } = useLang()
  const L = LABEL[lang]

  const [country, setCountry] = useState('')
  const [level, setLevel] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [viewCountry, setViewCountry] = useState('')
  const [result, setResult] = useState<{ count: number; average: number | null } | null>(null)

  useEffect(() => {
    const key = `spicy-rated-${item.id}`
    if (localStorage.getItem(key)) setSubmitted(true)
  }, [item.id])

  useEffect(() => {
    if (!viewCountry) {
      setResult(null)
      return
    }
    fetch(`/api/link-ramen-spicy?ramen_id=${item.id}&country=${encodeURIComponent(viewCountry)}`)
      .then(res => res.json())
      .then(setResult)
  }, [viewCountry, item.id])

  const handleSubmit = async () => {
    if (!country || level == null) return
    setSubmitting(true)
    setSubmitError(null)
    const res = await fetch('/api/link-ramen-spicy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ramen_id: item.id, country, spicy_level: level }),
    })
    setSubmitting(false)
    if (res.status === 429) {
      setSubmitError(L.alreadyRated)
      return
    }
    if (!res.ok) {
      setSubmitError('Error')
      return
    }
    localStorage.setItem(`spicy-rated-${item.id}`, '1')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-5">
        <Link href="/guide/link-ramen" className="text-sm text-gray-500 hover:text-gray-700">{L.back}</Link>

        <h1 className="text-lg font-bold text-gray-900">{getLinkRamenField(item, 'name', lang)}</h1>
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {/* 평가 결과 조회 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
          <h2 className="text-sm font-bold text-gray-800">{L.viewAverage}</h2>
          <select
            value={viewCountry}
            onChange={e => setViewCountry(e.target.value)}
            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5"
          >
            <option value="">{L.selectCountry}</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{getCountryName(c, lang)}</option>
            ))}
          </select>

          {result && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800">
              {result.average != null
                ? L.averageResult(result.average, result.count)
                : L.notEnough(result.count, MIN_RATINGS)}
            </div>
          )}
          <p className="text-[11px] text-gray-400 leading-relaxed">{L.referenceNote}</p>
        </div>

        {/* 평가 제출 */}
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-800 text-center">
            {L.submitted}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5"
            >
              <option value="">{L.selectCountry}</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{getCountryName(c, lang)}</option>
              ))}
            </select>

            <p className="text-xs font-bold text-gray-600">{L.selectLevel}</p>
            <div className="grid grid-cols-1 gap-2">
              {L.levelNames.map((name, i) => (
                <button
                  key={i}
                  onClick={() => setLevel(i)}
                  className={`text-sm text-left px-3 py-2 rounded-xl border transition-colors ${
                    level === i ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {submitError && <p className="text-xs text-red-600">{submitError}</p>}

            <button
              onClick={handleSubmit}
              disabled={!country || level == null || submitting}
              className="w-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 rounded-xl px-4 py-2.5 transition-colors"
            >
              {L.submit}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
