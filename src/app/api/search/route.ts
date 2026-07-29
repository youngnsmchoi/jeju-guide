// 사이트 통합 검색 API — 정적 가이드 페이지 + DB 상품명(라면/도시락 등)을 대상으로 텍스트 매칭
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { Lang } from '@/lib/types'

type SearchResult = {
  name: string
  href: string
  group: string
}

const STATIC_PAGES: Record<Lang, { name: string; desc: string; href: string; group: string }[]> = {
  ko: [
    { name: '계산 먼저!', desc: '편의점 라면 먹는 순서 · 봉투 질문 대비', href: '/guide/link-payment', group: '편의점 가이드' },
    { name: '한국 돈 안내', desc: '지폐 구분 · 환율 변환기 · 편의점 가격 감각', href: '/guide/link-money', group: '편의점 가이드' },
    { name: '할인 득템법', desc: '1+1 · 2+1 · 멤버십 할인', href: '/guide/convenience-store-1plus1', group: '편의점 가이드' },
    { name: '편의점 꿀팁', desc: '전자레인지 · 화장실 · 쓰레기 · 와이파이', href: '/guide/link-cvs-tips', group: '편의점 가이드' },
    { name: '교통카드 안내', desc: 'T-money 구입 · 충전 · 사용 · 편의점 결제', href: '/guide/link-tmoney', group: '편의점 가이드' },
    { name: '편의점 먹거리', desc: '삼각김밥 · 도시락 · 디저트', href: '/guide/link-store-food', group: '편의점 가이드' },
    { name: '삼각김밥', desc: '포장 뜯는 법 · 실물로 확인하는 법', href: '/guide/gimbap', group: '편의점 먹거리' },
    { name: '줄김밥', desc: '삼각김밥보다 든든한 한 끼 · 종류별 구성', href: '/guide/jul-gimbap', group: '편의점 먹거리' },
    { name: '도시락', desc: '데우는 법 · 종류별 구성', href: '/guide/dosirak', group: '편의점 먹거리' },
    { name: '핫바', desc: '사는 법 · 종류별 정보', href: '/guide/hotbar', group: '편의점 먹거리' },
    { name: '디저트·간식', desc: '한국인 추천 인기템', href: '/guide/snacks', group: '편의점 먹거리' },
    { name: '라면 전체 보기', desc: '29종 라면 정보 · 공식 자료 링크', href: '/guide/link-ramen', group: '라면' },
    { name: '나라별 인기 라면', desc: '일본·중국·미국… 내 나라 사람들의 픽', href: '/guide/link-country-picks', group: '라면' },
    { name: 'Best 5 추천', desc: '예사·예랑 픽 · 외국인 추천 순위', href: '/guide/link-best5', group: '라면' },
    { name: '라면 끓이는 법', desc: '컵 · 봉지 · 비벼먹기', href: '/guide/link-cooking', group: '라면' },
    { name: '나도 먹을 수 있나요?', desc: '성분표 직접 확인하는 법 (파파고 활용)', href: '/guide/link-ingredients', group: '라면' },
    { name: '꿀조합 커스터마이징', desc: '계란 · 치즈 · 삼각김밥 조합', href: '/guide/link-toppings', group: '라면' },
  ],
  en: [
    { name: 'How to Pay', desc: 'Step-by-step guide · bag question ready', href: '/guide/link-payment', group: 'CVS Guide' },
    { name: 'Korean Money Guide', desc: 'Banknotes · currency converter · CVS price guide', href: '/guide/link-money', group: 'CVS Guide' },
    { name: 'How to Save', desc: 'Buy-one-get-one · membership deals', href: '/guide/convenience-store-1plus1', group: 'CVS Guide' },
    { name: 'CVS Tips', desc: 'Microwave · Toilet · Trash · Wi-Fi', href: '/guide/link-cvs-tips', group: 'CVS Guide' },
    { name: 'Transit Card Guide', desc: 'Buy · top up · use · pay at store', href: '/guide/link-tmoney', group: 'CVS Guide' },
    { name: 'Convenience Store Food', desc: 'Gimbap · Bento · Snacks', href: '/guide/link-store-food', group: 'CVS Guide' },
    { name: 'Triangle Gimbap', desc: 'How to unwrap · how to check in-store', href: '/guide/gimbap', group: 'CVS Food' },
    { name: 'Gimbap Roll', desc: 'A heartier meal than triangle gimbap', href: '/guide/jul-gimbap', group: 'CVS Food' },
    { name: 'Bento', desc: 'How to heat · what\'s inside', href: '/guide/dosirak', group: 'CVS Food' },
    { name: 'Hotbar', desc: 'How to buy · types', href: '/guide/hotbar', group: 'CVS Food' },
    { name: 'Snacks & Desserts', desc: 'Popular picks recommended by locals', href: '/guide/snacks', group: 'CVS Food' },
    { name: 'All Ramen', desc: '29 ramen items · official source links', href: '/guide/link-ramen', group: 'Ramen' },
    { name: 'Popular by Country', desc: 'Japan, China, USA… what your country loves', href: '/guide/link-country-picks', group: 'Ramen' },
    { name: 'Best 5 Picks', desc: "Yesa & Yerang's top picks", href: '/guide/link-best5', group: 'Ramen' },
    { name: 'How to Cook', desc: 'Cup · bag · dry style', href: '/guide/link-cooking', group: 'Ramen' },
    { name: 'Can I Eat This?', desc: 'How to check ingredients yourself (with Papago)', href: '/guide/link-ingredients', group: 'Ramen' },
    { name: 'Topping Combos', desc: 'Egg · cheese · rice ball combos', href: '/guide/link-toppings', group: 'Ramen' },
  ],
  zh: [
    { name: '如何付款', desc: '购买流程 · 准备袋子问题', href: '/guide/link-payment', group: '便利店指南' },
    { name: '韩元指南', desc: '纸币介绍 · 汇率换算 · 便利店价格', href: '/guide/link-money', group: '便利店指南' },
    { name: '优惠攻略', desc: '买一送一 · 会员优惠', href: '/guide/convenience-store-1plus1', group: '便利店指南' },
    { name: '便利店小贴士', desc: '微波炉 · 洗手间 · 垃圾分类 · Wi-Fi', href: '/guide/link-cvs-tips', group: '便利店指南' },
    { name: '交通卡指南', desc: '购买 · 充值 · 使用 · 便利店结账', href: '/guide/link-tmoney', group: '便利店指南' },
    { name: '便利店美食', desc: '饭团 · 便当 · 零食', href: '/guide/link-store-food', group: '便利店指南' },
    { name: '饭团', desc: '拆包装方法 · 现场确认方法', href: '/guide/gimbap', group: '便利店美食' },
    { name: '紫菜卷', desc: '比饭团更饱腹的一餐', href: '/guide/jul-gimbap', group: '便利店美食' },
    { name: '便当', desc: '加热方法 · 各类构成', href: '/guide/dosirak', group: '便利店美食' },
    { name: '关东煮/串', desc: '购买方法 · 种类信息', href: '/guide/hotbar', group: '便利店美食' },
    { name: '零食甜点', desc: '韩国人推荐人气商品', href: '/guide/snacks', group: '便利店美食' },
    { name: '全部拉面', desc: '29种拉面 · 官方资料链接', href: '/guide/link-ramen', group: '拉面' },
    { name: '各国人气拉面', desc: '日本·中国·美国…你的国家的选择', href: '/guide/link-country-picks', group: '拉面' },
    { name: 'Best 5 推荐', desc: '外国人推荐排名', href: '/guide/link-best5', group: '拉面' },
    { name: '如何烹饪', desc: '杯面 · 袋面 · 干拌', href: '/guide/link-cooking', group: '拉面' },
    { name: '我能吃吗？', desc: '如何自行确认成分表（使用Papago）', href: '/guide/link-ingredients', group: '拉面' },
    { name: '黄金搭配', desc: '鸡蛋 · 芝士 · 饭团组合', href: '/guide/link-toppings', group: '拉面' },
  ],
  ja: [
    { name: 'お会計の方法', desc: '購入手順 · 袋の質問に備える', href: '/guide/link-payment', group: 'コンビニガイド' },
    { name: '韓国のお金', desc: '紙幣の種類 · 換算機 · コンビニ価格', href: '/guide/link-money', group: 'コンビニガイド' },
    { name: 'お得な買い方', desc: '1+1 · 2+1 · 会員割引', href: '/guide/convenience-store-1plus1', group: 'コンビニガイド' },
    { name: 'コンビニお役立ち', desc: '電子レンジ · トイレ · ゴミ · Wi-Fi', href: '/guide/link-cvs-tips', group: 'コンビニガイド' },
    { name: '交通カード案内', desc: '購入 · チャージ · 使用 · コンビニ決済', href: '/guide/link-tmoney', group: 'コンビニガイド' },
    { name: 'コンビニグルメ', desc: 'おにぎり · 弁当 · お菓子', href: '/guide/link-store-food', group: 'コンビニガイド' },
    { name: 'おにぎり', desc: '包装の開け方 · 店頭での確認方法', href: '/guide/gimbap', group: 'コンビニグルメ' },
    { name: '海苔巻き', desc: 'おにぎりより食べ応えのある一食', href: '/guide/jul-gimbap', group: 'コンビニグルメ' },
    { name: '弁当', desc: '温め方 · 種類別の内容', href: '/guide/dosirak', group: 'コンビニグルメ' },
    { name: 'ホットバー', desc: '買い方 · 種類別情報', href: '/guide/hotbar', group: 'コンビニグルメ' },
    { name: 'お菓子・スイーツ', desc: '韓国人おすすめの人気商品', href: '/guide/snacks', group: 'コンビニグルメ' },
    { name: 'ラーメン一覧', desc: '29種ラーメン · 公式資料リンク', href: '/guide/link-ramen', group: 'ラーメン' },
    { name: '国別人気ラーメン', desc: '日本·中国·アメリカ…自国の人気ランキング', href: '/guide/link-country-picks', group: 'ラーメン' },
    { name: 'Best 5 おすすめ', desc: '外国人おすすめランキング', href: '/guide/link-best5', group: 'ラーメン' },
    { name: '作り方', desc: 'カップ · 袋 · まぜそば', href: '/guide/link-cooking', group: 'ラーメン' },
    { name: '食べられますか？', desc: '成分表を自分で確認する方法（Papago活用）', href: '/guide/link-ingredients', group: 'ラーメン' },
    { name: 'トッピング組み合わせ', desc: '卵 · チーズ · おにぎり', href: '/guide/link-toppings', group: 'ラーメン' },
  ],
}

const DB_TABLES: { table: string; href: string; group: Record<Lang, string> }[] = [
  { table: 'ramen_items', href: '/guide/ramen', group: { ko: '라면', en: 'Ramen', zh: '拉面', ja: 'ラーメン' } },
  { table: 'link_ramen_items', href: '/guide/link-ramen', group: { ko: '라면', en: 'Ramen', zh: '拉面', ja: 'ラーメン' } },
  { table: 'dosirak_items', href: '/guide/dosirak', group: { ko: '편의점 먹거리', en: 'CVS Food', zh: '便利店美食', ja: 'コンビニグルメ' } },
  { table: 'jul_gimbap_items', href: '/guide/jul-gimbap', group: { ko: '편의점 먹거리', en: 'CVS Food', zh: '便利店美食', ja: 'コンビニグルメ' } },
  { table: 'hotbar_items', href: '/guide/hotbar', group: { ko: '편의점 먹거리', en: 'CVS Food', zh: '便利店美食', ja: 'コンビニグルメ' } },
  { table: 'snack_items', href: '/guide/snacks', group: { ko: '편의점 먹거리', en: 'CVS Food', zh: '便利店美食', ja: 'コンビニグルメ' } },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim().toLowerCase()
  const lang = (searchParams.get('lang') ?? 'en') as Lang

  if (!q) return NextResponse.json([])

  const results: SearchResult[] = []

  for (const page of STATIC_PAGES[lang] ?? STATIC_PAGES.en) {
    if (page.name.toLowerCase().includes(q) || page.desc.toLowerCase().includes(q)) {
      results.push({ name: page.name, href: page.href, group: page.group })
    }
  }

  const nameCol = `name_${lang}`
  await Promise.all(
    DB_TABLES.map(async ({ table, href, group }) => {
      const { data } = await supabase.from(table).select('name_ko, name_en, name_zh, name_ja')
      for (const row of (data ?? []) as unknown as Record<string, string | null>[]) {
        const name = row[nameCol] || row.name_ko
        if (name && name.toLowerCase().includes(q)) {
          // ramen_items는 목록 페이지가 ?q= 파라미터로 자동 필터링을 지원 (필터링 언어와 동일한 이름 사용)
          const itemHref = table === 'ramen_items' ? `${href}?q=${encodeURIComponent(name)}` : href
          results.push({ name, href: itemHref, group: group[lang] ?? group.en })
        }
      }
    })
  )

  return NextResponse.json(results.slice(0, 30))
}
