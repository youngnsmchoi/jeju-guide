// Vibe 큐레이션 페이지 — 3문항으로 라면 추천
import { supabase } from '@/lib/supabase'
import type { RamenItem } from '@/lib/types'
import VibeView from './VibeView'

export const revalidate = 30

export default async function VibePage() {
  const { data: ramenItems } = await supabase
    .from('ramen_items')
    .select('id, name_ko, name_en, name_zh, name_ja, vibe_tag, spice_level_std, ingredient_match, price_krw')
    .order('order_num')
  return <VibeView items={(ramenItems ?? []) as RamenItem[]} />
}
