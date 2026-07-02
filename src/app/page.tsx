// 홈 화면 — 편의점 카테고리 항목 목록을 바로 표시

import { supabase } from '@/lib/supabase'
import type { Category, Item } from '@/lib/types'
import CategoryView from './category/[slug]/CategoryView'

export default async function HomePage() {
  const [{ data: category }, { data: items }] = await Promise.all([
    supabase.from('jeju_categories').select('*').eq('slug', 'living').single(),
    supabase
      .from('jeju_items')
      .select('*, jeju_categories!inner(slug)')
      .eq('jeju_categories.slug', 'living')
      .order('order_num'),
  ])

  if (!category) {
    return <div className="text-center text-gray-400 py-20">카테고리를 찾을 수 없습니다.</div>
  }

  return <CategoryView category={category as Category} items={(items ?? []) as Item[]} isHome />
}
