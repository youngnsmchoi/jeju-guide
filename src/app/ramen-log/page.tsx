// My Ramen Log 페이지 — 라면 경험 남기기
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import type { RamenItem } from '@/lib/types'
import RamenLogView from './RamenLogView'

async function RamenLogContent() {
  const { data: ramenItems } = await supabase.from('ramen_items').select('id, name_ko, name_en, name_zh, name_ja').order('order_num')
  return <RamenLogView items={(ramenItems ?? []) as RamenItem[]} />
}

export default function RamenLogPage() {
  return (
    <Suspense>
      <RamenLogContent />
    </Suspense>
  )
}
