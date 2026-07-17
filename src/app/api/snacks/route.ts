// 디저트/간식 목록 조회 API (공개)
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('snack_items').select('*').order('order_num')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
