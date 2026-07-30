'use client'
// 문구를 버튼으로 보여주고, 누르면 화면 전체에 크게 확대해서 점원에게 보여줄 수 있게 하는 컴포넌트

import { useState } from 'react'

export default function PhraseButton({ phrase, expandLabel }: { phrase: string; expandLabel: string }) {
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
