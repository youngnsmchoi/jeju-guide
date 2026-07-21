// 라면별 나라별 맵기 평가 페이지 — 이용자가 직접 남기고 참고치를 함께 봄
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { LinkRamenItem } from '@/lib/types'
import SpicyRatingView from './SpicyRatingView'

export const revalidate = 0

export default async function SpicyRatingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase.from('link_ramen_items').select('*').eq('id', id).single()
  if (!data) notFound()
  return <SpicyRatingView item={data as LinkRamenItem} />
}
