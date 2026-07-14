// 피드백 관리 API — 전체 조회, 숨김·반영 토글
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id, hidden, status, answer } = await req.json()
  if (id === undefined) return NextResponse.json({ error: 'id 필요' }, { status: 400 })
  const update: Record<string, boolean | string | null> = {}
  if (hidden !== undefined) update.hidden = hidden
  if (status !== undefined) update.status = status
  if (answer !== undefined) update.answer = answer?.trim() || null
  const { error } = await supabase.from('feedback').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
