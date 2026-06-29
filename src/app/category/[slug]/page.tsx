// 카테고리 하위 항목 리스트 페이지 (서버에서 데이터 조회 후 렌더링)

import { supabase } from '@/lib/supabase'
import type { Category, Item } from '@/lib/types'
import CategoryView from './CategoryView'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [{ data: category }, { data: items }] = await Promise.all([
    supabase.from('jeju_categories').select('*').eq('slug', slug).single(),
    supabase
      .from('jeju_items')
      .select('*, jeju_categories!inner(slug)')
      .eq('jeju_categories.slug', slug)
      .order('order_num'),
  ])

  if (!category) {
    return <div className="text-center text-gray-400 py-20">카테고리를 찾을 수 없습니다.</div>
  }

  return <CategoryView category={category as Category} items={(items ?? []) as Item[]} />
}
