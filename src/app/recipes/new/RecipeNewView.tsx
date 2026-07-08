'use client'
// 레시피 제출 폼

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'

type RamenOption = { id: number; name_ko: string; name_en: string | null; name_zh: string | null; name_ja: string | null }

const LABEL: Record<Lang, {
  title: string
  ramen: string; ramenPlaceholder: string
  recipeTitle: string; recipeTitlePlaceholder: string
  description: string; descPlaceholder: string
  ingredients: string; ingredientsPlaceholder: string
  steps: string; stepsPlaceholder: string
  tip: string; tipPlaceholder: string
  sourceUrl: string; sourceUrlPlaceholder: string
  nickname: string; nicknamePlaceholder: string
  country: string; countryPlaceholder: string
  gender: string; genderM: string; genderF: string; genderO: string
  age: string
  submit: string; submitting: string
  done: string; doneMsg: string; viewAll: string
}> = {
  ko: {
    title: '레시피 올리기',
    ramen: '라면 (선택)', ramenPlaceholder: '라면을 골라주세요',
    recipeTitle: '레시피 제목 *', recipeTitlePlaceholder: '예) 대파 기름 계란 라면',
    description: '한 줄 소개 (선택)', descPlaceholder: '예) 파 기름의 고소함이 국물을 깊게 만들어줘요',
    ingredients: '재료 *', ingredientsPlaceholder: '예) 라면 1봉지, 대파 반 대, 계란 1개, 식용유 2큰술',
    steps: '조리 순서 *', stepsPlaceholder: '1. 냄비에 식용유를 두르고 대파를 볶습니다.\n2. 물을 붓고 스프를 넣어 끓입니다.\n3. 면을 넣고 계란을 올려 완성합니다.',
    tip: '💡 팁 (선택)', tipPlaceholder: '맛있게 만드는 비법이 있다면 알려주세요',
    sourceUrl: '출처 URL (선택)', sourceUrlPlaceholder: '예) https://youtube.com/shorts/...',
    nickname: '닉네임 (선택)', nicknamePlaceholder: '미입력 시 익명',
    country: '국가 (선택)', countryPlaceholder: '예) Japan, USA...',
    gender: '성별 (선택)', genderM: '남', genderF: '여', genderO: '기타',
    age: '나이대 (선택)',
    submit: '레시피 올리기', submitting: '올리는 중...',
    done: '올렸어요!', doneMsg: '레시피가 공유됐습니다. 고마워요!', viewAll: '전체 레시피 보기',
  },
  en: {
    title: 'Share a Recipe',
    ramen: 'Ramen (optional)', ramenPlaceholder: 'Choose a ramen',
    recipeTitle: 'Recipe title *', recipeTitlePlaceholder: 'e.g. Green onion oil egg ramen',
    description: 'One-line intro (optional)', descPlaceholder: 'e.g. Green onion oil makes the broth rich and savory',
    ingredients: 'Ingredients *', ingredientsPlaceholder: 'e.g. 1 pack ramen, ½ green onion, 1 egg, 2 tbsp oil',
    steps: 'Steps *', stepsPlaceholder: '1. Heat oil and stir-fry green onion.\n2. Add water and seasoning packet.\n3. Add noodles and top with egg.',
    tip: '💡 Tip (optional)', tipPlaceholder: 'Share your secret for making it extra delicious',
    sourceUrl: 'Source URL (optional)', sourceUrlPlaceholder: 'e.g. https://youtube.com/shorts/...',
    nickname: 'Nickname (optional)', nicknamePlaceholder: 'Anonymous if blank',
    country: 'Country (optional)', countryPlaceholder: 'e.g. Japan, USA...',
    gender: 'Gender (optional)', genderM: 'Male', genderF: 'Female', genderO: 'Other',
    age: 'Age group (optional)',
    submit: 'Share recipe', submitting: 'Sharing...',
    done: 'Shared!', doneMsg: 'Your recipe is live. Thank you!', viewAll: 'View all recipes',
  },
  zh: {
    title: '分享食谱',
    ramen: '拉面（可选）', ramenPlaceholder: '选择一款拉面',
    recipeTitle: '食谱名称 *', recipeTitlePlaceholder: '例如：大葱油鸡蛋拉面',
    description: '一句话简介（可选）', descPlaceholder: '例如：葱油让汤底更香浓',
    ingredients: '食材 *', ingredientsPlaceholder: '例如：拉面1包，大葱半根，鸡蛋1个，食用油2大勺',
    steps: '做法 *', stepsPlaceholder: '1. 锅中加油，炒香大葱。\n2. 加水和调料包煮沸。\n3. 放入面条，打上鸡蛋即成。',
    tip: '💡 小贴士（可选）', tipPlaceholder: '分享您的秘诀',
    sourceUrl: '来源链接（可选）', sourceUrlPlaceholder: '例如 https://youtube.com/shorts/...',
    nickname: '昵称（可选）', nicknamePlaceholder: '不填则显示匿名',
    country: '国家（可选）', countryPlaceholder: '例如：Japan, USA...',
    gender: '性别（可选）', genderM: '男', genderF: '女', genderO: '其他',
    age: '年龄段（可选）',
    submit: '分享食谱', submitting: '提交中...',
    done: '已分享！', doneMsg: '您的食谱已公开，谢谢！', viewAll: '查看所有食谱',
  },
  ja: {
    title: 'レシピを投稿',
    ramen: 'ラーメン（任意）', ramenPlaceholder: 'ラーメンを選んでください',
    recipeTitle: 'レシピ名 *', recipeTitlePlaceholder: '例）長ねぎ油卵ラーメン',
    description: 'ひと言紹介（任意）', descPlaceholder: '例）ねぎ油がスープを深くしてくれます',
    ingredients: '材料 *', ingredientsPlaceholder: '例）ラーメン1袋、長ねぎ半本、卵1個、油大さじ2',
    steps: '作り方 *', stepsPlaceholder: '1. 油でねぎを炒めます。\n2. 水とスープを入れて沸かします。\n3. 麺を入れて卵を乗せて完成。',
    tip: '💡 ヒント（任意）', tipPlaceholder: 'おいしく作るコツを教えてください',
    sourceUrl: '出典URL（任意）', sourceUrlPlaceholder: '例）https://youtube.com/shorts/...',
    nickname: 'ニックネーム（任意）', nicknamePlaceholder: '未入力は匿名',
    country: '国（任意）', countryPlaceholder: '例）Japan, USA...',
    gender: '性別（任意）', genderM: '男性', genderF: '女性', genderO: 'その他',
    age: '年代（任意）',
    submit: 'レシピを投稿', submitting: '投稿中...',
    done: '投稿しました！', doneMsg: 'レシピが公開されました。ありがとう！', viewAll: '全レシピを見る',
  },
}

const AGE_GROUPS = ['10s', '20s', '30s', '40s', '50s+']

export default function RecipeNewView({ ramenList }: { ramenList: RamenOption[] }) {
  const { lang } = useLang()
  const router = useRouter()
  const L = LABEL[lang]

  const [ramenId, setRamenId] = useState<number | ''>('')
  const [recipeTitle, setRecipeTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [tip, setTip] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [nickname, setNickname] = useState('')
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!recipeTitle.trim() || !ingredients.trim() || !steps.trim()) return
    setSubmitting(true)
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ramen_id: ramenId || null,
        title: recipeTitle.trim(),
        description: description.trim() || null,
        ingredients: ingredients.trim(),
        steps: steps.trim(),
        tip: tip.trim() || null,
        source_url: sourceUrl.trim() || null,
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
          <button onClick={() => router.push('/recipes')}
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

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-20 space-y-4">

        {/* 라면 선택 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.ramen}</label>
          <select value={ramenId} onChange={e => setRamenId(e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800">
            <option value="">{L.ramenPlaceholder}</option>
            {ramenList.map(r => (
              <option key={r.id} value={r.id}>
                {r[`name_${lang}` as keyof RamenOption] as string || r.name_ko}
              </option>
            ))}
          </select>
        </div>

        {/* 레시피 제목 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.recipeTitle}</label>
          <input value={recipeTitle} onChange={e => setRecipeTitle(e.target.value)}
            placeholder={L.recipeTitlePlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
        </div>

        {/* 한 줄 소개 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.description}</label>
          <input value={description} onChange={e => setDescription(e.target.value)}
            placeholder={L.descPlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
        </div>

        {/* 재료 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.ingredients}</label>
          <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}
            placeholder={L.ingredientsPlaceholder} rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 resize-none" />
        </div>

        {/* 조리 순서 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.steps}</label>
          <textarea value={steps} onChange={e => setSteps(e.target.value)}
            placeholder={L.stepsPlaceholder} rows={5}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 resize-none" />
        </div>

        {/* 팁 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.tip}</label>
          <textarea value={tip} onChange={e => setTip(e.target.value)}
            placeholder={L.tipPlaceholder} rows={2}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 resize-none" />
        </div>

        {/* 출처 URL */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.sourceUrl}</label>
          <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}
            placeholder={L.sourceUrlPlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.nickname}</label>
          <input value={nickname} onChange={e => setNickname(e.target.value)}
            placeholder={L.nicknamePlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
        </div>

        {/* 국가 */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">{L.country}</label>
          <input value={country} onChange={e => setCountry(e.target.value)}
            placeholder={L.countryPlaceholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300" />
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
            <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-sm text-gray-800">
              <option value="">-</option>
              {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSubmit}
          disabled={!recipeTitle.trim() || !ingredients.trim() || !steps.trim() || submitting}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {submitting ? L.submitting : L.submit}
        </button>

      </main>
      <BottomNav />
    </div>
  )
}
