'use client'
// My Ramen Log — 한 화면에서 라면/국가/만족도 선택 후 제출

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { RamenItem, Lang } from '@/lib/types'
import { getRamenField } from '@/lib/types'
import PageFooter from '@/components/PageFooter'

const COUNTRIES = [
  { code: 'china',       flag: '🇨🇳', label: 'China' },
  { code: 'japan',       flag: '🇯🇵', label: 'Japan' },
  { code: 'taiwan',      flag: '🇹🇼', label: 'Taiwan' },
  { code: 'usa',         flag: '🇺🇸', label: 'USA' },
  { code: 'vietnam',     flag: '🇻🇳', label: 'Vietnam' },
  { code: 'thailand',    flag: '🇹🇭', label: 'Thailand' },
  { code: 'philippines', flag: '🇵🇭', label: 'Philippines' },
  { code: 'other',       flag: '🌍', label: 'Other' },
]

const RATINGS = [
  { value: 'good',    emoji: '😊' },
  { value: 'neutral', emoji: '😐' },
  { value: 'bad',     emoji: '😞' },
]

const LABEL: Record<Lang, {
  title: string; back: string; q1: string; q2: string; q3: string;
  submit: string; privacy: string; done: string; doneMsg: string; error: string
}> = {
  ko: {
    title: 'My Ramen Log',
    back: '← 뒤로',
    q1: '어떤 라면 드셨어요?',
    q2: '어느 나라에서 오셨어요?',
    q3: '맛이 어땠어요?',
    submit: '완료',
    privacy: '선택하신 정보는 국가별 익명 통계로만 활용됩니다. 개인을 특정할 수 있는 정보는 공개되지 않습니다.',
    done: '감사합니다!',
    doneMsg: '소중한 의견이 K-Ramen 가이드 개선에 활용됩니다.',
    error: '제출에 실패했습니다. 다시 시도해 주세요.',
  },
  en: {
    title: 'My Ramen Log',
    back: '← Back',
    q1: 'Which ramen did you have?',
    q2: 'Where are you from?',
    q3: 'How was it?',
    submit: 'Done',
    privacy: 'Your response is collected as anonymous statistics by country. No personal information will be shared.',
    done: 'Thank you!',
    doneMsg: 'Your feedback helps improve the K-Ramen guide.',
    error: 'Submission failed. Please try again.',
  },
  zh: {
    title: 'My Ramen Log',
    back: '← 返回',
    q1: '您吃了哪种拉面？',
    q2: '您来自哪个国家？',
    q3: '味道怎么样？',
    submit: '完成',
    privacy: '您的选择仅用于按国家匿名统计，不会公开任何可识别个人身份的信息。',
    done: '谢谢！',
    doneMsg: '您的反馈将用于改进K-Ramen指南。',
    error: '提交失败，请重试。',
  },
  ja: {
    title: 'My Ramen Log',
    back: '← 戻る',
    q1: 'どのラーメンを食べましたか？',
    q2: 'どちらの国からお越しですか？',
    q3: '味はいかがでしたか？',
    submit: '完了',
    privacy: 'ご回答は国別の匿名統計としてのみ使用されます。個人を特定できる情報は公開されません。',
    done: 'ありがとうございます！',
    doneMsg: 'ご意見はK-Ramenガイドの改善に活用されます。',
    error: '送信に失敗しました。もう一度お試しください。',
  },
}

export default function RamenLogView({ items }: { items: RamenItem[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const searchParams = useSearchParams()
  const L = LABEL[lang]

  const preselectedId = searchParams.get('ramen_id')
  const [ramenId, setRamenId] = useState<string>(preselectedId ?? '')
  const [country, setCountry] = useState<string>('')
  const [rating, setRating] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)

  const canSubmit = ramenId && country && rating

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(false)
    const res = await fetch('/api/ramen-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ramen_id: Number(ramenId), country, rating }),
    })
    setSubmitting(false)
    if (res.ok) setDone(true)
    else setError(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">🍜</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{L.done}</h2>
        <p className="text-sm text-gray-500 mb-8">{L.doneMsg}</p>
        <button onClick={() => router.push('/')}
          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
          {L.back}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-emerald-600">{L.back}</button>
          <h1 className="text-sm font-bold text-gray-800">{L.title}</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        {/* Q1: 라면 선택 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">{L.q1}</p>
          <select
            value={ramenId}
            onChange={e => setRamenId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="">—</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{getRamenField(item, 'name', lang)}</option>
            ))}
          </select>
        </div>

        {/* Q2: 국가 선택 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">{L.q2}</p>
          <div className="grid grid-cols-4 gap-2">
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setCountry(c.code)}
                className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-medium transition-all
                  ${country === c.code ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'}`}>
                <span className="text-2xl mb-0.5">{c.flag}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: 만족도 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">{L.q3}</p>
          <div className="flex gap-3">
            {RATINGS.map(r => (
              <button key={r.value} onClick={() => setRating(r.value)}
                className={`flex-1 py-3 rounded-xl border text-3xl transition-all
                  ${rating === r.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'}`}>
                {r.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 제출 */}
        <div className="space-y-2 pt-2">
          {error && <p className="text-xs text-red-500 text-center">{L.error}</p>}
          <button onClick={submit} disabled={!canSubmit || submitting}
            className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40">
            {submitting ? '...' : L.submit}
          </button>
          <p className="text-xs text-gray-400 text-center leading-relaxed px-2">{L.privacy}</p>
        </div>
      </main>
      <PageFooter />
    </div>
  )
}
