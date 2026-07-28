// 라면 끓이는 법 페이지 — 컵/봉지/비벼먹기 탭
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Item } from '@/lib/types'
import JsonLd from '@/components/JsonLd'
import CookingView from './CookingView'

export const metadata: Metadata = {
  title: 'How to Cook Korean Ramen — Cup, Bag & Dry Noodle Instructions',
  description: 'How to prepare Korean convenience store ramen: cup noodles, bag (pot) noodles, and dry mix-style noodles, step by step.',
}

const HOW_TO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Cook Korean Bag Ramen',
  step: [
    { '@type': 'HowToStep', text: 'Pour 550ml of water into a pot and bring to a boil.' },
    { '@type': 'HowToStep', text: 'Once boiling, add the noodles and soup base together.' },
    { '@type': 'HowToStep', text: 'Boil for 3-4 minutes over medium heat, stirring occasionally.' },
    { '@type': 'HowToStep', text: 'Turn off heat, pour into a bowl and serve immediately.' },
  ],
}

export const revalidate = 60

export default async function CookingPage() {
  const { data: items } = await supabase
    .from('jeju_items')
    .select('*')
    .in('slug', ['convenience-store-cup-noodle', 'convenience-store-bag-noodle', 'convenience-store-dry-noodle'])

  const find = (slug: string) => (items ?? []).find((i: Item) => i.slug === slug) ?? null

  return (
    <>
      <JsonLd data={HOW_TO_JSON_LD} />
      <CookingView
        cupItem={find('convenience-store-cup-noodle')}
        bagItem={find('convenience-store-bag-noodle')}
        dryItem={find('convenience-store-dry-noodle')}
      />
    </>
  )
}
