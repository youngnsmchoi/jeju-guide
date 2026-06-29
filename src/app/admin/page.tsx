// 관리자 페이지 (서버에서 카테고리 조회 후 렌더링)

import { supabase } from '@/lib/supabase'
import type { Category } from '@/lib/types'
import AdminView from './AdminView'

export default async function AdminPage() {
  const { data: categories } = await supabase.from('jeju_categories').select('*').order('order_num')

  return <AdminView categories={(categories ?? []) as Category[]} />
}
