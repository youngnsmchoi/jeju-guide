// My Ramen Log 저장/조회 API
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  // 라면별 나라별 등록 수 집계 + 최근 발자취 피드 (공개 조회, 인증 불필요)
  const { data, error } = await supabase
    .from('ramen_log')
    .select('id, ramen_id, country, rating, memo_tags, note, created_at, ramen_items(name_ko, name_en)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data ?? []

  // ramen_id별로 나라 카운트 집계
  const map: Record<number, { name_ko: string; name_en: string; countries: Record<string, number> }> = {}
  for (const row of rows) {
    const id = row.ramen_id
    const item = (Array.isArray(row.ramen_items) ? row.ramen_items[0] : row.ramen_items) as { name_ko: string; name_en: string } | null
    if (!map[id]) map[id] = { name_ko: item?.name_ko ?? '', name_en: item?.name_en ?? '', countries: {} }
    const c = row.country as string
    map[id].countries[c] = (map[id].countries[c] ?? 0) + 1
  }

  const stats = Object.entries(map).map(([id, v]) => ({
    ramen_id: Number(id),
    name_ko: v.name_ko,
    name_en: v.name_en,
    total: Object.values(v.countries).reduce((a, b) => a + b, 0),
    countries: v.countries,
  })).sort((a, b) => b.total - a.total)

  const feed = rows.slice(0, 50).map(row => ({
    id: row.id,
    ramen_id: row.ramen_id,
    country: row.country,
    rating: row.rating,
    memo_tags: row.memo_tags,
    note: row.note,
    created_at: row.created_at,
    ramen_items: Array.isArray(row.ramen_items) ? row.ramen_items[0] ?? null : row.ramen_items,
  }))

  return NextResponse.json({ stats, feed })
}

export async function POST(req: Request) {
  const { ramen_id, country, rating, memo_tags, note } = await req.json()
  if (!ramen_id || !country || !rating) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }
  const { error } = await supabase.from('ramen_log').insert({
    ramen_id, country, rating,
    memo_tags: memo_tags ?? [],
    note: note ?? null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
