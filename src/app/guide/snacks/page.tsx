// 편의점 디저트/간식 가이드 페이지 — 한국인 추천 인기템 목록
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { SnackItem } from '@/lib/types'
import SnacksView from './SnacksView'

export const metadata: Metadata = {
  title: 'Best Korean Convenience Store Snacks & Desserts, Picked by Locals',
  description: 'Popular Korean convenience store snacks and desserts recommended by locals — what to try and where to find it.',
}

export const revalidate = 60

export default async function SnacksPage() {
  const { data } = await supabase.from('snack_items').select('*').order('order_num')
  return <SnacksView items={(data ?? []) as SnackItem[]} />
}
