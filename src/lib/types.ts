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

export interface SnackItem {
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
  why_popular_ko: string | null
  why_popular_en: string | null
  why_popular_zh: string | null
  why_popular_ja: string | null
  allergen_note_ko: string | null
  allergen_note_en: string | null
  allergen_note_zh: string | null
  allergen_note_ja: string | null
  category: 'drink' | 'ice_cream' | 'snack' | 'bread' | null
  price_krw: number | null
  manufacturer_url: string | null
}

export interface LinkRamenItem {
  id: number
  order_num: number
  name_ko: string
  name_en: string | null
  name_zh: string | null
  name_ja: string | null
  package_type: 'cup' | 'bag' | null
  foodqr_barcode: string | null
  manufacturer_url: string
  ingredients_ko: string | null
  ingredients_en: string | null
  ingredients_zh: string | null
  ingredients_ja: string | null
  allergens_ko: string | null
  allergens_en: string | null
  allergens_zh: string | null
  allergens_ja: string | null
  cross_contamination_ko: string | null
  cross_contamination_en: string | null
  cross_contamination_zh: string | null
  cross_contamination_ja: string | null
  serving_size_g: number | null
  nutrition_kcal: number | null
  nutrition_sodium_mg: number | null
  nutrition_carbs_g: number | null
  nutrition_sugar_g: number | null
  nutrition_fat_g: number | null
  nutrition_trans_fat_g: number | null
  nutrition_sat_fat_g: number | null
  nutrition_cholesterol_mg: number | null
  nutrition_protein_g: number | null
  nutrition_calcium_mg: number | null
  storage_note_ko: string | null
  storage_note_en: string | null
  storage_note_zh: string | null
  storage_note_ja: string | null
}

export interface HotbarItem {
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
  allergen_note_ko: string | null
  allergen_note_en: string | null
  allergen_note_zh: string | null
  allergen_note_ja: string | null
  price_krw: number | null
  manufacturer_url: string | null
}

export interface JulGimbapItem {
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
  composition_ko: string | null
  composition_en: string | null
  composition_zh: string | null
  composition_ja: string | null
  allergen_note_ko: string | null
  allergen_note_en: string | null
  allergen_note_zh: string | null
  allergen_note_ja: string | null
  price_krw: number | null
  manufacturer_url: string | null
}

export interface DosirakItem {
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
  composition_ko: string | null
  composition_en: string | null
  composition_zh: string | null
  composition_ja: string | null
  allergen_note_ko: string | null
  allergen_note_en: string | null
  allergen_note_zh: string | null
  allergen_note_ja: string | null
  price_krw: number | null
  manufacturer_url: string | null
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

export interface Recipe {
  id: number
  ramen_id: number | null
  title: string | null
  ingredients: string
  description: string | null
  steps: string | null
  tip: string | null
  source_url: string | null
  nickname: string | null
  country: string | null
  gender: string | null
  age_group: string | null
  likes: number
  hidden: boolean
  created_at: string
  ramen_items?: { name_ko: string; name_en: string | null; name_zh: string | null; name_ja: string | null } | null
}

export function getRamenField(item: RamenItem, field: 'name' | 'flavor_desc' | 'comparison' | 'popularity' | 'texture', lang: Lang): string {
  return item[`${field}_${lang}`] || item[`${field}_ko`] || ''
}

export function getDosirakField(item: DosirakItem, field: 'name' | 'flavor_desc' | 'composition' | 'allergen_note', lang: Lang): string {
  return item[`${field}_${lang}`] || item[`${field}_ko`] || ''
}

export function getJulGimbapField(item: JulGimbapItem, field: 'name' | 'flavor_desc' | 'composition' | 'allergen_note', lang: Lang): string {
  return item[`${field}_${lang}`] || item[`${field}_ko`] || ''
}

export function getHotbarField(item: HotbarItem, field: 'name' | 'flavor_desc' | 'allergen_note', lang: Lang): string {
  return item[`${field}_${lang}`] || item[`${field}_ko`] || ''
}

export function getLinkRamenField(item: LinkRamenItem, field: 'name' | 'ingredients' | 'allergens' | 'cross_contamination' | 'storage_note', lang: Lang): string {
  return item[`${field}_${lang}`] || item[`${field}_ko`] || ''
}

export function getSnackField(item: SnackItem, field: 'name' | 'flavor_desc' | 'why_popular' | 'allergen_note', lang: Lang): string {
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
