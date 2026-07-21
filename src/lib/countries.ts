// 맵기 평가용 전 세계 국가 목록 (ISO 국가 코드 기준, 4개 언어 표기)
import type { Lang } from './types'

export interface Country {
  code: string
  ko: string
  en: string
  zh: string
  ja: string
}

export const COUNTRIES: Country[] = [
  { code: 'KR', ko: '대한민국', en: 'South Korea', zh: '韩国', ja: '韓国' },
  { code: 'US', ko: '미국', en: 'United States', zh: '美国', ja: 'アメリカ' },
  { code: 'JP', ko: '일본', en: 'Japan', zh: '日本', ja: '日本' },
  { code: 'CN', ko: '중국', en: 'China', zh: '中国', ja: '中国' },
  { code: 'TW', ko: '대만', en: 'Taiwan', zh: '台湾', ja: '台湾' },
  { code: 'HK', ko: '홍콩', en: 'Hong Kong', zh: '香港', ja: '香港' },
  { code: 'VN', ko: '베트남', en: 'Vietnam', zh: '越南', ja: 'ベトナム' },
  { code: 'TH', ko: '태국', en: 'Thailand', zh: '泰国', ja: 'タイ' },
  { code: 'PH', ko: '필리핀', en: 'Philippines', zh: '菲律宾', ja: 'フィリピン' },
  { code: 'MY', ko: '말레이시아', en: 'Malaysia', zh: '马来西亚', ja: 'マレーシア' },
  { code: 'SG', ko: '싱가포르', en: 'Singapore', zh: '新加坡', ja: 'シンガポール' },
  { code: 'ID', ko: '인도네시아', en: 'Indonesia', zh: '印度尼西亚', ja: 'インドネシア' },
  { code: 'IN', ko: '인도', en: 'India', zh: '印度', ja: 'インド' },
  { code: 'GB', ko: '영국', en: 'United Kingdom', zh: '英国', ja: 'イギリス' },
  { code: 'FR', ko: '프랑스', en: 'France', zh: '法国', ja: 'フランス' },
  { code: 'DE', ko: '독일', en: 'Germany', zh: '德国', ja: 'ドイツ' },
  { code: 'ES', ko: '스페인', en: 'Spain', zh: '西班牙', ja: 'スペイン' },
  { code: 'IT', ko: '이탈리아', en: 'Italy', zh: '意大利', ja: 'イタリア' },
  { code: 'CA', ko: '캐나다', en: 'Canada', zh: '加拿大', ja: 'カナダ' },
  { code: 'MX', ko: '멕시코', en: 'Mexico', zh: '墨西哥', ja: 'メキシコ' },
  { code: 'BR', ko: '브라질', en: 'Brazil', zh: '巴西', ja: 'ブラジル' },
  { code: 'AU', ko: '호주', en: 'Australia', zh: '澳大利亚', ja: 'オーストラリア' },
  { code: 'NZ', ko: '뉴질랜드', en: 'New Zealand', zh: '新西兰', ja: 'ニュージーランド' },
  { code: 'RU', ko: '러시아', en: 'Russia', zh: '俄罗斯', ja: 'ロシア' },
  { code: 'SA', ko: '사우디아라비아', en: 'Saudi Arabia', zh: '沙特阿拉伯', ja: 'サウジアラビア' },
  { code: 'AE', ko: '아랍에미리트', en: 'United Arab Emirates', zh: '阿联酋', ja: 'アラブ首長国連邦' },
  { code: 'TR', ko: '튀르키예', en: 'Turkey', zh: '土耳其', ja: 'トルコ' },
  { code: 'EG', ko: '이집트', en: 'Egypt', zh: '埃及', ja: 'エジプト' },
  { code: 'ZA', ko: '남아프리카공화국', en: 'South Africa', zh: '南非', ja: '南アフリカ' },
  { code: 'OTHER', ko: '기타', en: 'Other', zh: '其他', ja: 'その他' },
]

export function getCountryName(country: Country, lang: Lang): string {
  return country[lang]
}
