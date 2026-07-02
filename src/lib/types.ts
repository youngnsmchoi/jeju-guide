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
export type ImageSize = 'small' | 'medium' | 'full'

export type ImageAlign = 'left' | 'center' | 'right'
export type ImagePosition = 'left' | 'right'
export type TextValign = 'top' | 'middle' | 'bottom'

export type TipVariant = 'tip' | 'warning' | 'info'
export type HeadingLevel = 'h2' | 'h3'

export type Block =
  | { type: 'text'; text_ko: string; text_en: string; text_zh: string; text_ja: string }
  | { type: 'image'; url: string; size: ImageSize; align: ImageAlign; caption_ko: string; caption_en: string; caption_zh: string; caption_ja: string }
  | { type: 'image_text'; url: string; size: ImageSize; position: ImagePosition; valign: TextValign; text_ko: string; text_en: string; text_zh: string; text_ja: string }
  | { type: 'youtube'; url: string }
  | { type: 'tip'; variant: TipVariant; text_ko: string; text_en: string; text_zh: string; text_ja: string }
  | { type: 'heading'; level: HeadingLevel; text_ko: string; text_en: string; text_zh: string; text_ja: string }
  | { type: 'divider' }

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

export interface RamenItem {
  id: number
  order_num: number
  name_ko: string
  name_en: string | null
  name_zh: string | null
  name_ja: string | null
  image_url: string | null
  flavor_desc_ko: string | null
  flavor_desc_en: string | null
  flavor_desc_zh: string | null
  flavor_desc_ja: string | null
  comparison_ko: string | null
  comparison_en: string | null
  comparison_zh: string | null
  comparison_ja: string | null
  popularity_ko: string | null
  popularity_en: string | null
  popularity_zh: string | null
  popularity_ja: string | null
  texture_ko: string | null
  texture_en: string | null
  texture_zh: string | null
  texture_ja: string | null
  prep_time: number | null
  spicy_level: number | null
  noodle_type: 'cup' | 'bag' | null
  soup_type: 'soup' | 'dry' | null
  heat_source: 'hot_water' | 'microwave' | 'stovetop' | null
  manufacturer_url: string | null
  price_krw: number | null
  vibe_tag: 'hangover' | 'comfort' | 'challenge' | 'mild' | null
  spice_level_std: number | null
  ingredient_match: string | null
}

export function getRamenField(item: RamenItem, field: 'name' | 'flavor_desc' | 'comparison' | 'popularity' | 'texture', lang: Lang): string {
  return item[`${field}_${lang}`] || item[`${field}_ko`] || ''
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
