// My Ramen Log 저장 API
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { ramen_id, country, rating } = await req.json()
  if (!ramen_id || !country || !rating) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }
  const { error } = await supabase.from('ramen_log').insert({ ramen_id, country, rating })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
