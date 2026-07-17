// 레시피 제출 페이지
import { Suspense } from 'react'
import RecipeNewView from './RecipeNewView'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

async function RecipeNewContent() {
  const { data } = await supabase
    .from('ramen_items')
    .select('id, name_ko, name_en, name_zh, name_ja')
    .order('order_num')
  return <RecipeNewView ramenList={data ?? []} />
}

export default function RecipeNewPage() {
  return (
    <Suspense>
      <RecipeNewContent />
    </Suspense>
  )
}
