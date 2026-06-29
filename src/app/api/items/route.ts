// 카테고리별 항목 목록을 반환하는 서버 API
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/\s/g, '')
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category_id')
  const categorySlug = searchParams.get('category_slug')

  if (!categoryId && !categorySlug) {
    return NextResponse.json({ error: 'category_id or category_slug required' }, { status: 400 })
  }

  const query = categorySlug
    ? supabase.from('jeju_items').select('*, jeju_categories!inner(slug)').eq('jeju_categories.slug', categorySlug)
    : supabase.from('jeju_items').select('*').eq('category_id', categoryId!)

  const { data, error } = await query.order('order_num')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
