// 편의점 핫바(어묵바/소시지바) 가이드 페이지
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { HotbarItem } from '@/lib/types'
import HotbarView from './HotbarView'

export const metadata: Metadata = {
  title: 'Korean Convenience Store Hotbar Guide — Fish Cake & Sausage Sticks',
  description: 'How to buy and heat a hotbar (fish cake stick, sausage stick) at a Korean convenience store, with types and prices explained.',
}

export const revalidate = 60

export default async function HotbarPage() {
  const { data } = await supabase.from('hotbar_items').select('*').order('order_num')
  return <HotbarView items={(data ?? []) as HotbarItem[]} />
}
