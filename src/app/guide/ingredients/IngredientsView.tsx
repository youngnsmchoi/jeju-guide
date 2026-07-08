'use client'
// 나도 먹을 수 있나요? — 파파고로 성분 직접 확인하는 방법 안내

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

const LABEL: Record<Lang, {
  title: string
  disclaimer: string
  steps: { emoji: string; title: string; desc: string }[]
  tip: string
  tipDesc: string
  papago: string
}> = {
  en: {
    title: 'Can I Eat This?',
    disclaimer: 'This information is for reference only. Ingredients and certifications may change. Always check the product label or official page before purchasing.',
    steps: [
      {
        emoji: '🛒',
        title: 'Pick a ramen',
        desc: 'Choose from the Vibe recommendations or browse the full ramen list.',
      },
      {
        emoji: '📷',
        title: 'Scan the ingredient label with Papago',
        desc: 'Open Papago → tap the camera icon → point it at the ingredient label on the package.',
      },
      {
        emoji: '✅',
        title: 'Check it yourself',
        desc: 'Read the translated ingredients and decide for yourself. We do not judge what you can or cannot eat.',
      },
    ],
    tip: '💡 Tip for better scanning',
    tipDesc: 'Take the photo in a bright spot and get as close to the label as possible. This improves Papago\'s recognition accuracy.',
    papago: 'Open Papago',
  },
  ko: {
    title: '나도 먹을 수 있나요?',
    disclaimer: '본 정보는 참고용이며, 인증 및 성분은 변경될 수 있습니다. 구매 전 반드시 제품 라벨 또는 공식 페이지에서 최종 확인하세요.',
    steps: [
      {
        emoji: '🛒',
        title: '라면 고르기',
        desc: 'Vibe 추천 결과 또는 전체 목록에서 원하는 라면을 선택하세요.',
      },
      {
        emoji: '📷',
        title: '파파고로 성분표 스캔',
        desc: '파파고 앱 실행 → 카메라 아이콘 탭 → 라면 포장의 성분표에 카메라를 가져다 대세요.',
      },
      {
        emoji: '✅',
        title: '직접 확인',
        desc: '번역된 성분을 읽고 스스로 판단하세요. 먹을 수 있는지 없는지는 사용자 본인이 결정합니다.',
      },
    ],
    tip: '💡 인식률 올리는 팁',
    tipDesc: '성분표 부분을 밝은 곳에서 최대한 가까이 촬영하면 파파고의 인식률이 올라갑니다.',
    papago: '파파고 열기',
  },
  zh: {
    title: '我能吃吗？',
    disclaimer: '本信息仅供参考，认证及成分可能随时变更。购买前请务必确认产品标签或官方页面。',
    steps: [
      {
        emoji: '🛒',
        title: '选择拉面',
        desc: '从Vibe推荐结果或全部列表中选择您想要的拉面。',
      },
      {
        emoji: '📷',
        title: '用Papago扫描成分表',
        desc: '打开Papago → 点击相机图标 → 将相机对准包装上的成分表。',
      },
      {
        emoji: '✅',
        title: '自行确认',
        desc: '阅读翻译后的成分自行判断。是否可以食用由您自己决定。',
      },
    ],
    tip: '💡 提高识别率的小贴士',
    tipDesc: '在明亮的地方尽量靠近成分表拍照，可以提高Papago的识别准确率。',
    papago: '打开Papago',
  },
  ja: {
    title: '食べられますか？',
    disclaimer: '本情報は参考用です。認証・成分は変更される場合があります。購入前に必ず製品ラベルまたは公式ページでご確認ください。',
    steps: [
      {
        emoji: '🛒',
        title: 'ラーメンを選ぶ',
        desc: 'Vibeのおすすめ結果または一覧から選んでください。',
      },
      {
        emoji: '📷',
        title: 'Papagoで成分表をスキャン',
        desc: 'Papagoを開く → カメラアイコンをタップ → パッケージの成分表にカメラを向ける。',
      },
      {
        emoji: '✅',
        title: 'ご自身で確認',
        desc: '翻訳された成分を読んでご自身で判断してください。食べられるかどうかはご自身が決めます。',
      },
    ],
    tip: '💡 認識率を上げるコツ',
    tipDesc: '明るい場所でできるだけ成分表に近づいて撮影すると、Papagoの認識精度が上がります。',
    papago: 'Papagoを開く',
  },
}

export default function IngredientsView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-20 space-y-4">
        {/* 면책 문구 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">{L.disclaimer}</p>
        </div>

        {/* 3단계 */}
        {L.steps.map((step, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{step.emoji} {step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}

        {/* 팁 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-bold text-emerald-800 mb-1">{L.tip}</p>
          <p className="text-xs text-emerald-700 leading-relaxed">{L.tipDesc}</p>
        </div>

        {/* 파파고 버튼 */}
        <a
          href="https://papago.naver.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold text-center hover:bg-emerald-700 transition-colors"
        >
          {L.papago} →
        </a>
      </main>
      <BottomNav />
    </div>
  )
}
