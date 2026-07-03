// 라면 끓이는 법 페이지 — 컵/봉지/비벼먹기 탭
import { supabase } from '@/lib/supabase'
import type { Item } from '@/lib/types'
import CookingView from './CookingView'

export default async function CookingPage() {
  const { data: cupItem } = await supabase
    .from('jeju_items')
    .select('*')
    .eq('slug', 'convenience-store-cup-noodle')
    .single()

  return <CookingView cupItem={cupItem as Item | null} />
}
