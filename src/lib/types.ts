// jeju-guide DB 타입 정의

export type Lang = 'ko' | 'en' | 'zh' | 'ja'

export interface Category {
  id: number
  slug: string
  icon: string | null
  order_num: number
  title_ko: string
  title_en: string | null
  title_zh: string | null
  title_ja: string | null
}

// 블록 타입 정의
export type Block =
  | { type: 'text'; text_ko: string; text_en: string; text_zh: string; text_ja: string }
  | { type: 'image'; url: string; caption_ko: string; caption_en: string; caption_zh: string; caption_ja: string }
  | { type: 'image_text'; url: string; text_ko: string; text_en: string; text_zh: string; text_ja: string }
  | { type: 'youtube'; url: string }

export interface Item {
  id: number
  category_id: number
  slug: string
  order_num: number
  title_ko: string
  title_en: string | null
  title_zh: string | null
  title_ja: string | null
  content_ko: string | null
  content_en: string | null
  content_zh: string | null
  content_ja: string | null
  image_url: string | null
  video_url: string | null
  map_keyword: string | null
  blocks: Block[] | null
}

export function getTitle(item: Category | Item, lang: Lang): string {
  return item[`title_${lang}`] || item.title_ko
}

export function getContent(item: Item, lang: Lang): string {
  return item[`content_${lang}`] || item.content_ko || ''
}

export function getBlockText(block: Extract<Block, { text_ko: string }>, lang: Lang): string {
  return block[`text_${lang}`] || block.text_ko || ''
}

export function getBlockCaption(block: Extract<Block, { caption_ko: string }>, lang: Lang): string {
  return block[`caption_${lang}`] || block.caption_ko || ''
}
