// 홈 화면 — 섹션 순서: 결제 방법 → K-Ramen Picks → Vibe 추천
import { supabase } from '@/lib/supabase'
import type { RamenItem } from '@/lib/types'
import HomeScreen from './HomeScreen'

export default async function HomePage() {
  const { data: ramenItems } = await supabase
    .from('ramen_items')
    .select('*')
    .order('order_num')

  return <HomeScreen items={(ramenItems ?? []) as RamenItem[]} />
}
