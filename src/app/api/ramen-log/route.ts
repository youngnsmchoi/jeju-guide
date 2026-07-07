// My Ramen Log 저장/조회 API
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  // 라면별 나라별 등록 수 집계 (중복 제거: ramen_id 기준 최신 1건만)
  const { data, error } = await supabase
    .from('ramen_log')
    .select('ramen_id, country, ramen_items(name_ko, name_en)')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // ramen_id별로 나라 카운트 집계
  const map: Record<number, { name_ko: string; name_en: string; countries: Record<string, number> }> = {}
  for (const row of (data ?? [])) {
    const id = row.ramen_id
    const item = (Array.isArray(row.ramen_items) ? row.ramen_items[0] : row.ramen_items) as { name_ko: string; name_en: string } | null
    if (!map[id]) map[id] = { name_ko: item?.name_ko ?? '', name_en: item?.name_en ?? '', countries: {} }
    const c = row.country as string
    map[id].countries[c] = (map[id].countries[c] ?? 0) + 1
  }

  const result = Object.entries(map).map(([id, v]) => ({
    ramen_id: Number(id),
    name_ko: v.name_ko,
    name_en: v.name_en,
    total: Object.values(v.countries).reduce((a, b) => a + b, 0),
    countries: v.countries,
  })).sort((a, b) => b.total - a.total)

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const { ramen_id, country, rating } = await req.json()
  if (!ramen_id || !country || !rating) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }
  const { error } = await supabase.from('ramen_log').insert({ ramen_id, country, rating })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
