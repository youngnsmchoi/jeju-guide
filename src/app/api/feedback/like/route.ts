// 피드백 좋아요 API — increment_feedback_likes RPC 호출
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 })
  const { error } = await supabase.rpc('increment_feedback_likes', { feedback_id: id })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
