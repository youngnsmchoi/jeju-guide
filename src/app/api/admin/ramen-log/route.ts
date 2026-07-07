// Ramen Log 관리 API — 조회 및 삭제
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  const { data, error } = await supabase
    .from('ramen_log')
    .select('*, ramen_items(name_ko)')
    .order('created_at', { ascending: false })
    .select('id, ramen_id, country, rating, memo_tags, note, created_at, ramen_items(name_ko)')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 })
  const { error } = await supabase.from('ramen_log').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
