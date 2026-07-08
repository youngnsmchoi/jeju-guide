// 레시피 관리 API — 목록 조회 및 숨김 토글
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  const { data, error } = await supabase
    .from('recipes')
    .select('*, ramen_items(name_ko, name_en, name_zh, name_ja)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id, hidden } = await req.json()
  if (id === undefined || hidden === undefined) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }
  const { error } = await supabase.from('recipes').update({ hidden }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
