// 편의점 핫바(어묵바/소시지바) 가이드 페이지
import { supabase } from '@/lib/supabase'
import type { HotbarItem } from '@/lib/types'
import HotbarView from './HotbarView'

export const revalidate = 60

export default async function HotbarPage() {
  const { data } = await supabase.from('hotbar_items').select('*').order('order_num')
  return <HotbarView items={(data ?? []) as HotbarItem[]} />
}
