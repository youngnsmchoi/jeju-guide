// 레시피 목록 조회 및 제출 API
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, ramen_items(name_ko, name_en, name_zh, name_ja)')
    .eq('hidden', false)
    .order('likes', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { ramen_id, title, ingredients, description, steps, tip, nickname, country, gender, age_group } = await req.json()
  if (!ingredients || !steps) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }
  const { error } = await supabase.from('recipes').insert({
    ramen_id: ramen_id ?? null,
    title: title || null,
    ingredients,
    description: description || null,
    steps,
    tip: tip || null,
    nickname: nickname || null,
    country: country || null,
    gender: gender || null,
    age_group: age_group || null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
