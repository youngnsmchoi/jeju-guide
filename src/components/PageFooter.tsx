'use client'
// 모든 페이지 하단에 공통으로 표시되는 홈 이동 푸터

import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

const LABEL: Record<Lang, string> = {
  ko: '홈으로',
  en: 'Home',
  zh: '返回首页',
  ja: 'ホームへ',
}

export default function PageFooter() {
  const router = useRouter()
  const { lang } = useLang()

  return (
    <footer className="max-w-lg mx-auto w-full px-4 py-6 mt-2">
      <button
        onClick={() => router.push('/')}
        className="w-full py-3 rounded-2xl bg-gray-100 text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors">
        ← {LABEL[lang]}
      </button>
    </footer>
  )
}
