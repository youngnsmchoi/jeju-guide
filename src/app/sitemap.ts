// 정적 가이드 페이지 + Supabase의 동적 slug 페이지를 합쳐 sitemap.xml 생성
import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://www.koreacvsguide.com'

const STATIC_ROUTES = [
  '',
  '/ko',
  '/en',
  '/zh',
  '/ja',
  '/guide/dosirak',
  '/guide/gimbap',
  '/guide/hotbar',
  '/guide/jul-gimbap',
  '/guide/link-best5',
  '/guide/link-cooking',
  '/guide/link-country-picks',
  '/guide/link-cvs-tips',
  '/guide/link-ingredients',
  '/guide/link-phrases',
  '/guide/link-money',
  '/guide/link-payment',
  '/guide/link-ramen',
  '/guide/link-store-food',
  '/guide/link-tmoney',
  '/guide/link-toppings',
  '/guide/snacks',
  '/recipes',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: items } = await supabase.from('jeju_items').select('slug')

  const LANG_ROUTES = ['/ko', '/en', '/zh', '/ja']
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : LANG_ROUTES.includes(route) ? 0.9 : 0.8,
  }))

  const dynamicEntries = (items ?? []).map(({ slug }) => ({
    url: `${BASE_URL}/guide/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...dynamicEntries]
}
