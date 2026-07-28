'use client'
// 삼각김밥·김밥·도시락 공통 — 포장에서 자주 보이는 한글 단어 태그 목록

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

export type GlossaryWord = { word: string; meaning: Record<Lang, string> }

const SECTION_LABEL: Record<Lang, { title: string; note: string }> = {
  ko: { title: '📖 포장에서 자주 보이는 한글 단어', note: '맛 이름 앞에 붙는 이 단어들만 알아도 대략적인 맛을 짐작할 수 있습니다.' },
  en: { title: '📖 Common Korean words on the package', note: 'Knowing these words in front of the flavor name gives you a rough idea of the taste.' },
  zh: { title: '📖 包装上常见的韩文单词', note: '了解这些出现在口味名称前的单词，就能大致推测出味道。' },
  ja: { title: '📖 パッケージでよく見る韓国語単語', note: '味の名前の前につくこれらの単語を知っておくと、おおよその味が想像できます。' },
}

export default function WordGlossary({ words }: { words: GlossaryWord[] }) {
  const { lang } = useLang()
  const SL = SECTION_LABEL[lang]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
      <p className="text-sm font-bold text-gray-800">{SL.title}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{SL.note}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        {words.map((w, i) => (
          <span key={i} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
            <span className="font-bold text-gray-800">{w.word}</span>
            <span className="text-gray-400"> · {w.meaning[lang]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
