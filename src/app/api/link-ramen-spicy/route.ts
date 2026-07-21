// 라면 맵기 평가(크라우드소싱) 조회/제출 API — 나라별 평균은 5건 이상일 때만 계산
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const MIN_RATINGS = 5

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0].trim() || 'unknown'
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ramenId = searchParams.get('ramen_id')
  const country = searchParams.get('country')
  if (!ramenId || !country) return NextResponse.json({ error: 'ramen_id and country required' }, { status: 400 })

  const { data, error } = await supabase
    .from('link_ramen_spicy_ratings')
    .select('spicy_level')
    .eq('ramen_id', ramenId)
    .eq('country', country)
    .eq('hidden', false)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const count = data.length
  if (count < MIN_RATINGS) {
    return NextResponse.json({ count, average: null })
  }
  const average = data.reduce((sum, r) => sum + r.spicy_level, 0) / count
  return NextResponse.json({ count, average: Math.round(average * 10) / 10 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { ramen_id, country, spicy_level } = body

  if (!ramen_id || !country || spicy_level == null) {
    return NextResponse.json({ error: 'ramen_id, country, spicy_level required' }, { status: 400 })
  }
  if (spicy_level < 0 || spicy_level > 4) {
    return NextResponse.json({ error: 'spicy_level must be 0-4' }, { status: 400 })
  }

  const ip = getClientIp(request)
  const ipHash = hashIp(ip)

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('link_ramen_spicy_ratings')
    .select('id')
    .eq('ramen_id', ramen_id)
    .eq('ip_hash', ipHash)
    .gte('created_at', since)
    .limit(1)

  if (recent && recent.length > 0) {
    return NextResponse.json({ error: 'already rated recently' }, { status: 429 })
  }

  const { error } = await supabase
    .from('link_ramen_spicy_ratings')
    .insert([{ ramen_id, country, spicy_level, ip_hash: ipHash }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
