// 상세 페이지 (서버에서 데이터 조회 후 렌더링)

import { supabase } from '@/lib/supabase'
import type { Item, Category } from '@/lib/types'
import GuideView from './GuideView'

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: item } = await supabase.from('jeju_items').select('*').eq('slug', slug).single()

  if (!item) {
    return <div className="text-center text-gray-400 py-20">항목을 찾을 수 없습니다.</div>
  }

  const { data: category } = await supabase
    .from('jeju_categories')
    .select('*')
    .eq('id', item.category_id)
    .single()

  return <GuideView item={item as Item} category={category as Category | null} />
}
