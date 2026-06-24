// slug로 항목 상세 및 카테고리 정보를 반환하는 서버 API
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/\s/g, '')
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const { data: item, error } = await supabase
    .from('jeju_items')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !item) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: category } = await supabase
    .from('jeju_categories')
    .select('*')
    .eq('id', item.category_id)
    .single()

  return NextResponse.json({ item, category })
}
