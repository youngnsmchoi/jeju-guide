// 피드백 목록 조회 및 제출 API
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('hidden', false)
    .order('likes', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { category, title, body, nickname, country } = await req.json()
  if (!category || !title || !body) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }
  const { error } = await supabase.from('feedback').insert({
    category,
    title: title.trim(),
    body: body.trim(),
    nickname: nickname?.trim() || null,
    country: country?.trim() || null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
