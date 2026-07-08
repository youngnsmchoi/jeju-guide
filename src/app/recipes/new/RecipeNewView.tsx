'use client'
// 레시피 제출 폼

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'

type RamenOption = { id: number; name_ko: string; name_en: string | null; name_zh: string | null; name_ja: string | null }

const LABEL: Record<Lang, {
  title: string
  ramen: string
  ramenPlaceholder: string
  ingredients: string
  ingredientsPlaceholder: string
  description: string
  descPlaceholder: string
  nickname: string
  nicknamePlaceholder: string
  country: string
  countryPlaceholder: string
  gender: string
  genderM: string
  genderF: string
  genderO: string
  age: string
  submit: string
  submitting: string
  done: string
  doneMsg: string
  viewAll: string
}> = {
  ko: {
    title: '레시피 올리기', ramen: '라면 (선택)', ramenPlaceholder: '라면을 골라주세요',
    ingredients: '재료·조합 *', ingredientsPlaceholder: '예) 계란 + 치즈 + 참기름 한 방울',
    description: '한 줄 설명 *', descPlaceholder: '예) 치즈가 녹으면서 국물이 부드러워져요',
    nickname: '닉네임 (선택)', nicknamePlaceholder: '미입력 시 익명',
    country: '국가 (선택)', countryPlaceholder: '예) Japan, USA, Thailand...',
    gender: '성별 (선택)', genderM: '남', genderF: '여', genderO: '기타',
    age: '나이대 (선택)',
    submit: '레시피 올리기', submitting: '올리는 중...', done: '올렸어요!', doneMsg: '레시피가 공유됐습니다. 고마워요!', viewAll: '전체 레시피 보기',
  },
  en: {
    title: 'Share a Recipe', ramen: 'Ramen (optional)', ramenPlaceholder: 'Choose a ramen',
    ingredients: 'Ingredients & combo *', ingredientsPlaceholder: 'e.g. egg + cheese + sesame oil',
    description: 'One-line description *', descPlaceholder: 'e.g. The cheese melts and makes the broth so smooth',
    nickname: 'Nickname (optional)', nicknamePlaceholder: 'Anonymous if blank',
    country: 'Country (optional)', countryPlaceholder: 'e.g. Japan, USA, Thailand...',
    gender: 'Gender (optional)', genderM: 'Male', genderF: 'Female', genderO: 'Other',
    age: 'Age group (optional)',
    submit: 'Share recipe', submitting: 'Sharing...', done: 'Shared!', doneMsg: 'Your recipe is live. Thank you!', viewAll: 'View all recipes',
  },
  zh: {
    title: '分享食谱', ramen: '拉面（可选）', ramenPlaceholder: '选择一款拉面',
    ingredients: '食材与搭配 *', ingredientsPlaceholder: '例如：鸡蛋 + 芝士 + 几滴香油',
    description: '一句话描述 *', descPlaceholder: '例如：芝士融化后，汤底变得更顺滑',
    nickname: '昵称（可选）', nicknamePlaceholder: '不填则显示匿名',
    country: '国家（可选）', countryPlaceholder: '例如：Japan, USA...',
    gender: '性别（可选）', genderM: '男', genderF: '女', genderO: '其他',
    age: '年龄段（可选）',
    submit: '分享食谱', submitting: '提交中...', done: '已分享！', doneMsg: '您的食谱已公开，谢谢！', viewAll: '查看所有食谱',
  },
  ja: {
    title: 'レシピを投稿', ramen: 'ラーメン（任意）', ramenPlaceholder: 'ラーメンを選んでください',
    ingredients: '具材・組み合わせ *', ingredientsPlaceholder: '例）卵 + チーズ + ごま油少々',
    description: 'ひと言説明 *', descPlaceholder: '例）チーズが溶けてスープがまろやかになる',
    nickname: 'ニックネーム（任意）', nicknamePlaceholder: '未入力は匿名',
    country: '国（任意）', countryPlaceholder: '例）Japan, USA...',
    gender: '性別（任意）', genderM: '男性', genderF: '女性', genderO: 'その他',
    age: '年代（任意）',
    submit: 'レシピを投稿', submitting: '投稿中...', done: '投稿しました！', doneMsg: 'レシピが公開されました。ありがとう！', viewAll: '全レシピを見る',
  },
}

const AGE_GROUPS = ['10s', '20s', '30s', '40s', '50s+']

export default function RecipeNewView({ ramenList }: { ramenList: RamenOption[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  const [ramenId, setRamenId] = useState<number | ''>('')
  const [ingredients, setIngredients] = useState('')
  const [description, setDescription] = useState('')
  const [nickname, setNickname] = useState('')
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!ingredients.trim() || !description.trim()) return
    setSubmitting(true)
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ramen_id: ramenId || null,
        ingredients: ingredients.trim(),
        description: description.trim(),
        nickname: nickname.trim() || null,
        country: country.trim() || null,
        gender: gender || null,
        age_group: ageGroup || null,
      }),
    })
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-4">
          <p className="text-4xl">🎉</p>
          <p className="text-lg font-bold text-gray-900">{L.done}</p>
          <p className="text-sm text-gray-500 text-center">{L.doneMsg}</p>
          <button
            onClick={() => router.push('/recipes')}
            className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors">
            {L.viewAll}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">

        {/* 라면 선택 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.ramen}</label>
          <select
            value={ramenId}
            onChange={e => setRamenId(e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800">
            <option value="">{L.ramenPlaceholder}</option>
            {ramenList.map(r => (
              <option key={r.id} value={r.id}>
                {r[`name_${lang}` as keyof RamenOption] as string || r.name_ko}
              </option>
            ))}
          </select>
        </div>

        {/* 재료 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.ingredients}</label>
          <input
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder={L.ingredientsPlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.description}</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={L.descPlaceholder}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 resize-none"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.nickname}</label>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder={L.nicknamePlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300"
          />
        </div>

        {/* 국가 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.country}</label>
          <input
            value={country}
            onChange={e => setCountry(e.target.value)}
            placeholder={L.countryPlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300"
          />
        </div>

        {/* 성별 + 나이대 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-700 mb-1 block">{L.gender}</label>
            <div className="flex gap-2">
              {[['M', L.genderM], ['F', L.genderF], ['O', L.genderO]].map(([val, lbl]) => (
                <button key={val} onClick={() => setGender(gender === val ? '' : val)}
                  className={`flex-1 text-xs py-2 rounded-xl border font-medium transition-colors
                    ${gender === val ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-700 mb-1 block">{L.age}</label>
            <select
              value={ageGroup}
              onChange={e => setAgeGroup(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-sm text-gray-800">
              <option value="">-</option>
              {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!ingredients.trim() || !description.trim() || submitting}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {submitting ? L.submitting : L.submit}
        </button>

      </main>
    </div>
  )
}
