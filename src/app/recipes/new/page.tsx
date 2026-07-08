// 레시피 제출 페이지
import RecipeNewView from './RecipeNewView'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

export default async function RecipeNewPage() {
  const { data } = await supabase
    .from('ramen_items')
    .select('id, name_ko, name_en, name_zh, name_ja')
    .order('order_num')
  return <RecipeNewView ramenList={data ?? []} />
}
