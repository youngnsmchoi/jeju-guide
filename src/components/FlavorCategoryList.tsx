'use client'
// 삼각김밥·김밥·도시락 공통 — 맛 강도 3단계(부드러움/익숙한 고기/매콤함) 카테고리 카드

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

export type FlavorCategory = {
  dotClass: string
  name: Record<Lang, string>
  conceptName: string
  menu: Record<Lang, string>
  desc: Record<Lang, string>
}

export function buildFlavorCategories(menus: {
  mild: Record<Lang, string>
  meat: Record<Lang, string>
  spicy: Record<Lang, string>
}): FlavorCategory[] {
  return [
    {
      dotClass: 'bg-emerald-500',
      name: { ko: '부드럽고 안 매운 맛', en: 'Mild & Creamy', zh: '温和不辣', ja: 'マイルドでクリーミーな味' },
      conceptName: 'Mild & Creamy',
      menu: menus.mild,
      desc: {
        ko: '실패 확률 0%, 누구나 좋아하는 고소하고 부드러운 맛.',
        en: 'A safe first pick — creamy, mild flavor almost everyone likes.',
        zh: '几乎不会踩雷，口感温和，大众都喜欢。',
        ja: '失敗ゼロ、誰でも好きなまろやかな味。',
      },
    },
    {
      dotClass: 'bg-amber-400',
      name: { ko: '익숙한 고기·불고기 맛', en: 'Savory Meat', zh: '熟悉的肉类/烤肉味', ja: '馴染みのある肉・プルコギ味' },
      conceptName: 'Savory Meat',
      menu: menus.meat,
      desc: {
        ko: '외국인에게도 익숙한 달콤짭짤한 간장 소스 베이스.',
        en: 'A sweet-and-savory soy sauce base that feels familiar to most foreign visitors.',
        zh: '甜咸交织的酱油风味，外国游客也容易接受。',
        ja: '外国人にも馴染みやすい甘辛い醤油ベース。',
      },
    },
    {
      dotClass: 'bg-red-500',
      name: { ko: '한국의 매콤한 맛 (도전용)', en: 'Korean Spicy', zh: '韩式辣味（挑战款）', ja: '韓国の辛い味（挑戦用）' },
      conceptName: 'Korean Spicy',
      menu: menus.spicy,
      desc: {
        ko: '한국의 매운맛에 도전해보고 싶은 분께 추천 🌶️',
        en: 'For adventurous eaters who want to try real Korean spice 🌶️',
        zh: '推荐给想挑战韩式辣味的冒险者 🌶️',
        ja: '韓国の辛さに挑戦したい方におすすめ 🌶️',
      },
    },
  ]
}

const SECTION_LABEL: Record<Lang, { title: string; note: string }> = {
  ko: { title: '🍙 맛 카테고리로 골라보기', note: '맛 이름은 나라마다 낯설어도, "안 매운 맛 / 익숙한 고기맛 / 매운맛" 이 3가지 기준은 어디서나 통합니다.' },
  en: { title: '🍙 Pick by Flavor Category', note: 'Flavor names vary by country, but "mild / familiar meat / spicy" works as a universal guide anywhere.' },
  zh: { title: '🍙 按口味分类挑选', note: '口味名称各国不同，但"不辣/熟悉的肉味/辣味"这3个标准放之四海皆准。' },
  ja: { title: '🍙 味のカテゴリーから選ぶ', note: '味の名前は国によって馴染みがなくても、「辛くない味 / 馴染みのある肉の味 / 辛い味」という3つの基準はどこでも通じます。' },
}

export default function FlavorCategoryList({ categories }: { categories: FlavorCategory[] }) {
  const { lang } = useLang()
  const SL = SECTION_LABEL[lang]

  return (
    <div>
      <p className="text-base font-bold text-gray-900 mb-1">{SL.title}</p>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">{SL.note}</p>
      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dotClass}`} />
              <p className="text-sm font-bold text-gray-900">{cat.name[lang]}</p>
              {lang !== 'en' && <span className="text-xs text-gray-300">({cat.conceptName})</span>}
            </div>
            <p className="text-xs font-medium text-gray-700">{cat.menu[lang]}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{cat.desc[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
