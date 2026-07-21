// 관리자용 맵기 평가 조회/숨김/삭제 API
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/\s/g, '')
)

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  const { data, error } = await supabase
    .from('link_ramen_spicy_ratings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const body = await request.json()
  const { id, hidden } = body
  const { data, error } = await supabase
    .from('link_ramen_spicy_ratings')
    .update({ hidden })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await supabase.from('link_ramen_spicy_ratings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
