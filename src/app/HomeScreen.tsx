'use client'
// 홈 화면 — 내 메뉴(즐겨찾기) + 그룹별 섹션 카드 (2열 그리드) (배포 트리거용 재커밋)

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import LangSelector from '@/components/LangSelector'
import SearchBox from '@/components/SearchBox'

const FAVORITES_KEY = 'home_favorites'
const DEFAULT_FAVORITES = [
  '/guide/link-payment',
  '/guide/link-money',
  '/guide/link-cvs-tips',
  '/guide/link-cooking',
  '/guide/link-country-picks',
]

const MY_MENU_LABEL: Record<Lang, string> = {
  ko: '⭐ 즐겨찾기',
  en: '⭐ Favorites',
  zh: '⭐ 收藏',
  ja: '⭐ お気に入り',
}

const MAX_FAVORITES = 5
const FAVORITES_LIMIT_MESSAGE: Record<Lang, string> = {
  ko: `즐겨찾기는 최대 ${MAX_FAVORITES}개까지 담을 수 있어요. 다른 항목을 빼고 다시 시도해주세요.`,
  en: `You can save up to ${MAX_FAVORITES} favorites. Remove one before adding another.`,
  zh: `收藏最多可保存${MAX_FAVORITES}个。请先移除一个再添加。`,
  ja: `お気に入りは最大${MAX_FAVORITES}件まで保存できます。他の項目を外してから追加してください。`,
}

const START_HERE_LABEL: Record<Lang, string> = {
  ko: '처음이라면 이 순서로',
  en: 'New here? Start with these',
  zh: '第一次来？先看这些',
  ja: '初めての方はこの順番で',
}

const PHRASES_CARD_LABEL: Record<Lang, { title: string; desc: string }> = {
  ko: { title: '🗣️ 이 말이 필요할 때', desc: '말하지 않아도 됩니다. 화면을 점원에게 보여주세요.' },
  en: { title: '🗣️ Show This to Staff', desc: "No need to speak — just show the screen." },
  zh: { title: '🗣️ 这句话需要时', desc: '不用开口说话，把屏幕给店员看就可以了。' },
  ja: { title: '🗣️ この言葉が必要なとき', desc: '話さなくても大丈夫。画面を見せるだけでOKです。' },
}

const OFFLINE_SAVE_LABEL: Record<Lang, {
  title: string
  shortReason: string
  fullReason: string
  favoriteRule: string
  idle: string
  saving: string
  savedAt: (date: string) => string
  note: string
  deleteBtn: string
  deleting: string
  deleted: string
}> = {
  ko: {
    title: '📥 인터넷 안 될 때도 보기',
    shortReason: '여행 중 와이파이가 안 터질 수도 있어요',
    fullReason: '외국에서 오신 분들은 한국 유심이 없거나 와이파이가 안 되면 인터넷을 아예 못 쓸 수 있어요. 그럴 때도 아래 즐겨찾기 페이지는 미리 저장해두면 인터넷 없이 볼 수 있어요.',
    favoriteRule: `⭐ 즐겨찾기(최대 ${MAX_FAVORITES}개)에 담긴 페이지만 저장돼요. 즐겨찾기는 별표 아이콘으로 추가·삭제할 수 있어요.`,
    idle: '지금 저장하기',
    saving: '저장 중...',
    savedAt: (date) => `${date}에 저장됨`,
    note: '저장한 내용은 삭제하기 전까지 계속 남아있어요. 다시 누르면 최신 내용으로 새로 저장돼요.',
    deleteBtn: '🗑️ 저장 내용 삭제',
    deleting: '삭제 중...',
    deleted: '저장된 내용을 삭제했어요',
  },
  en: {
    title: '📥 View Even Without Internet',
    shortReason: 'Wi-Fi may not work everywhere while traveling',
    fullReason: "Travelers without a Korean SIM or Wi-Fi access may have no internet at all. Save your favorite pages in advance so you can still view them without internet.",
    favoriteRule: `⭐ Only pages in your Favorites (up to ${MAX_FAVORITES}) are saved. Use the star icon to add or remove favorites.`,
    idle: 'Save Now',
    saving: 'Saving...',
    savedAt: (date) => `Saved on ${date}`,
    note: 'Saved data stays until you delete it. Tap again anytime to refresh it with the latest content.',
    deleteBtn: '🗑️ Delete Saved Data',
    deleting: 'Deleting...',
    deleted: 'Saved data deleted',
  },
  zh: {
    title: '📥 没有网络也能看',
    shortReason: '旅行途中Wi-Fi可能连不上',
    fullReason: '没有韩国电话卡或Wi-Fi的游客可能完全无法上网。请提前保存收藏页面，这样即使没有网络也能查看。',
    favoriteRule: `⭐ 只会保存收藏（最多${MAX_FAVORITES}个）中的页面。可以用星标图标添加或删除收藏。`,
    idle: '立即保存',
    saving: '保存中...',
    savedAt: (date) => `保存于 ${date}`,
    note: '保存的内容会一直保留，直到您删除为止。再次点击可更新为最新内容。',
    deleteBtn: '🗑️ 删除保存内容',
    deleting: '删除中...',
    deleted: '已删除保存的内容',
  },
  ja: {
    title: '📥 ネットがなくても見られる',
    shortReason: '旅行中Wi-Fiが使えないこともあります',
    fullReason: '韓国のSIMやWi-Fiがない旅行者は、ネットが全く使えないことがあります。お気に入りページを事前に保存しておけば、ネットなしでも見ることができます。',
    favoriteRule: `⭐ お気に入り（最大${MAX_FAVORITES}件）に入っているページだけ保存されます。お気に入りは星アイコンで追加・削除できます。`,
    idle: '今すぐ保存',
    saving: '保存中...',
    savedAt: (date) => `${date}に保存済み`,
    note: '保存した内容は削除するまでそのまま残ります。再度タップすると最新の内容に更新されます。',
    deleteBtn: '🗑️ 保存内容を削除',
    deleting: '削除中...',
    deleted: '保存内容を削除しました',
  },
}

const START_HERE_HREFS = ['/guide/link-payment', '/guide/link-money', '/guide/link-cvs-tips']

const ASK_BANNER_LABEL: Record<Lang, { text: string; arrow: string }> = {
  ko: { text: '정보가 없거나 실제와 달랐나요? 알려주세요', arrow: '→' },
  en: { text: "Missing info, or something different in real life? Let us know", arrow: '→' },
  zh: { text: '信息缺失或与实际不符？告诉我们', arrow: '→' },
  ja: { text: '情報がない、または実際と違った？教えてください', arrow: '→' },
}

const HERO: Record<Lang, { title: string; sub: string; summary: string }> = {
  ko: {
    title: 'Korea Convenience Store Guide',
    sub: '한국 편의점 이용, 막힐 때 바로 찾아보는 실전 가이드',
    summary: '결제 방법 · 한국 화폐 · 라면 조리법 · 교통카드(T-money) · 삼각김밥·김밥·도시락 · 할인 정보까지, 외국인을 위한 한국 편의점 이용법을 안내합니다.',
  },
  en: {
    title: 'Korea Convenience Store Guide',
    sub: "Real answers for when you're stuck at a Korean convenience store",
    summary: 'Payment methods, Korean currency, ramen cooking, T-money transit cards, triangle kimbap & bento, and discount tips — everything foreign travelers need at a Korean convenience store.',
  },
  zh: {
    title: 'Korea Convenience Store Guide',
    sub: '在韩国便利店遇到问题时，随时查看的实用指南',
    summary: '支付方式、韩元货币、拉面煮法、T-money交通卡、饭团紫菜卷便当、优惠信息，为外国游客介绍韩国便利店使用方法。',
  },
  ja: {
    title: 'Korea Convenience Store Guide',
    sub: '韓国のコンビニで困ったとき、すぐに使える実践ガイド',
    summary: '支払い方法、韓国のお金、ラーメンの作り方、T-money交通カード、おにぎり・海苔巻き・弁当、割引情報まで、外国人観光客のための韓国コンビニ利用ガイドです。',
  },
}

const COMING_SOON: Record<Lang, string> = {
  ko: '준비 중',
  en: 'Coming soon',
  zh: '即将推出',
  ja: '準備中',
}

const CONTACT_EMAIL = 'yehyang1004@gmail.com'
const CONTACT_LABEL: Record<Lang, string> = {
  ko: '문의',
  en: 'Contact',
  zh: '联系我们',
  ja: 'お問い合わせ',
}


type Section = {
  emoji: string
  title: Record<Lang, string>
  desc: Record<Lang, string>
  href: string | null
  badge?: 'official' | 'editorial'
}

const BADGE_LABEL: Record<Lang, { official: string; editorial: string }> = {
  ko: { official: '공식 자료', editorial: '편집자 참고' },
  en: { official: 'Official', editorial: 'Editor\'s Pick' },
  zh: { official: '官方资料', editorial: '编辑参考' },
  ja: { official: '公式資料', editorial: '編集者参考' },
}

type Group = {
  label: Record<Lang, string>
  color: string
  cardClass: string
  sections: Section[]
}

const GROUPS: Group[] = [
  {
    label: { ko: '편의점 가이드', en: 'Convenience Store Guide', zh: '便利店指南', ja: 'コンビニガイド' },
    color: 'text-emerald-600',
    cardClass: 'bg-emerald-50 border-emerald-100',
    sections: [
      {
        emoji: '💳',
        title: { ko: '계산 먼저!', en: 'How to Pay', zh: '如何付款', ja: 'お会計の方法' },
        desc: {
          ko: '편의점 라면 먹는 순서 · 봉투 질문 대비',
          en: 'Step-by-step guide · bag question ready',
          zh: '购买流程 · 准备袋子问题',
          ja: '購入手順 · 袋の質問に備える',
        },
        href: '/guide/link-payment',
      },
      {
        emoji: '💵',
        title: { ko: '한국 돈 안내', en: 'Korean Money Guide', zh: '韩元指南', ja: '韓国のお金' },
        desc: {
          ko: '지폐 구분 · 환율 변환기 · 편의점 가격 감각',
          en: 'Banknotes · currency converter · CVS price guide',
          zh: '纸币介绍 · 汇率换算 · 便利店价格',
          ja: '紙幣の種類 · 換算機 · コンビニ価格',
        },
        href: '/guide/link-money',
      },
      {
        emoji: '🏷️',
        title: { ko: '할인 득템법', en: 'How to Save', zh: '优惠攻略', ja: 'お得な買い方' },
        desc: {
          ko: '1+1 · 2+1 · 멤버십 할인',
          en: 'Buy-one-get-one · membership deals',
          zh: '买一送一 · 会员优惠',
          ja: '1+1 · 2+1 · 会員割引',
        },
        href: '/guide/convenience-store-1plus1',
      },
      {
        emoji: '💡',
        title: { ko: '편의점 꿀팁', en: 'CVS Tips', zh: '便利店小贴士', ja: 'コンビニお役立ち' },
        desc: {
          ko: '전자레인지 · 화장실 · 쓰레기 · 와이파이',
          en: 'Microwave · Toilet · Trash · Wi-Fi',
          zh: '微波炉 · 洗手间 · 垃圾分类 · Wi-Fi',
          ja: '電子レンジ · トイレ · ゴミ · Wi-Fi',
        },
        href: '/guide/link-cvs-tips',
      },
      {
        emoji: '🚇',
        title: { ko: '교통카드 안내', en: 'Transit Card Guide', zh: '交通卡指南', ja: '交通カード案内' },
        desc: {
          ko: 'T-money 구입 · 충전 · 사용 · 편의점 결제',
          en: 'Buy · top up · use · pay at store',
          zh: '购买 · 充值 · 使用 · 便利店结账',
          ja: '購入 · チャージ · 使用 · コンビニ決済',
        },
        href: '/guide/link-tmoney',
      },
      {
        emoji: '🍙',
        title: { ko: '편의점 먹거리', en: 'Convenience Store Food', zh: '便利店美食', ja: 'コンビニグルメ' },
        desc: {
          ko: '삼각김밥 · 도시락 · 디저트',
          en: 'Gimbap · Bento · Snacks',
          zh: '饭团 · 便当 · 零食',
          ja: 'おにぎり · 弁当 · お菓子',
        },
        href: '/guide/link-store-food',
      },
    ],
  },
  {
    label: { ko: '라면 탐색', en: 'Explore Ramen', zh: '探索拉面', ja: 'ラーメンを探す' },
    color: 'text-orange-500',
    cardClass: 'bg-orange-50 border-orange-100',
    sections: [
      {
        emoji: '🍜',
        title: { ko: '라면 전체 보기', en: 'All Ramen', zh: '全部拉面', ja: 'ラーメン一覧' },
        desc: {
          ko: '29종 라면 정보 · 공식 자료 링크',
          en: '29 ramen items · official source links',
          zh: '29种拉面 · 官方资料链接',
          ja: '29種ラーメン · 公式資料リンク',
        },
        href: '/guide/link-ramen',
        badge: 'official',
      },
      {
        emoji: '🌏',
        title: { ko: '나라별 인기 라면', en: 'Popular by Country', zh: '各国人气拉面', ja: '国別人気ラーメン' },
        desc: {
          ko: '일본·중국·미국… 내 나라 사람들의 픽',
          en: 'Japan, China, USA… what your country loves',
          zh: '日本·中国·美国…你的国家的选择',
          ja: '日本·中国·アメリカ…自国の人気ランキング',
        },
        href: '/guide/link-country-picks',
        badge: 'editorial',
      },
      {
        emoji: '🎯',
        title: { ko: '라면 찾기', en: 'Find Your Ramen', zh: '寻找拉面', ja: 'ラーメン探し' },
        desc: {
          ko: '해장 · 매운맛 도전 · 편안한 식사 → 라면 추천 + 룰렛',
          en: 'Hangover · spicy challenge · cozy meal → picks + roulette',
          zh: '解酒 · 辣度挑战 · 舒适一餐 → 推荐+轮盘',
          ja: '二日酔い · 辛さ挑戦 · 落ち着く食事 → おすすめ+ルーレット',
        },
        href: '/vibe',
        badge: 'editorial',
      },
      {
        emoji: '⭐',
        title: { ko: 'Best 5 추천', en: 'Best 5 Picks', zh: 'Best 5 推荐', ja: 'Best 5 おすすめ' },
        desc: {
          ko: '예사·예랑 픽 · 외국인 추천 순위',
          en: "Yesa & Yerang's top picks",
          zh: '外国人推荐排名',
          ja: '外国人おすすめランキング',
        },
        href: '/guide/link-best5',
        badge: 'editorial',
      },
    ],
  },
  {
    label: { ko: '라면 정보', en: 'Ramen Info', zh: '拉面信息', ja: 'ラーメン情報' },
    color: 'text-blue-500',
    cardClass: 'bg-blue-50 border-blue-100',
    sections: [
      {
        emoji: '🔥',
        title: { ko: '라면 끓이는 법', en: 'How to Cook', zh: '如何烹饪', ja: '作り方' },
        desc: {
          ko: '컵 · 봉지 · 비벼먹기',
          en: 'Cup · bag · dry style',
          zh: '杯面 · 袋面 · 干拌',
          ja: 'カップ · 袋 · まぜそば',
        },
        href: '/guide/link-cooking',
      },
      {
        emoji: '🥗',
        title: { ko: '나도 먹을 수 있나요?', en: 'Can I Eat This?', zh: '我能吃吗？', ja: '食べられますか？' },
        desc: {
          ko: '성분표 직접 확인하는 법 (파파고 활용)',
          en: 'How to check ingredients yourself (with Papago)',
          zh: '如何自行确认成分表（使用Papago）',
          ja: '成分表を自分で確認する方法（Papago活用）',
        },
        href: '/guide/link-ingredients',
      },
      {
        emoji: '🥚',
        title: { ko: '꿀조합 커스터마이징', en: 'Topping Combos', zh: '黄金搭配', ja: 'トッピング組み合わせ' },
        desc: {
          ko: '계란 · 치즈 · 삼각김밥 조합',
          en: 'Egg · cheese · rice ball combos',
          zh: '鸡蛋 · 芝士 · 饭团组合',
          ja: '卵 · チーズ · おにぎり',
        },
        href: '/guide/link-toppings',
      },
      {
        emoji: '📝',
        title: { ko: 'My Ramen Log', en: 'My Ramen Log', zh: 'My Ramen Log', ja: 'My Ramen Log' },
        desc: {
          ko: '먹어본 라면 · 한 줄 남기기',
          en: 'Rate the ramen you tried',
          zh: '记录你吃过的拉面',
          ja: '食べたラーメンを記録',
        },
        href: '/ramen-log',
      },
    ],
  },
  {
    label: { ko: '커뮤니티', en: 'Community', zh: '社区', ja: 'コミュニティ' },
    color: 'text-violet-600',
    cardClass: 'bg-violet-50 border-violet-100',
    sections: [
      {
        emoji: '✏️',
        title: { ko: '꿀조합 레시피', en: 'Recipes', zh: '食谱', ja: 'レシピ' },
        desc: {
          ko: 'SNS 인기 조합 + 내 레시피 올리기',
          en: 'Popular combos + share your own',
          zh: '热门组合 + 分享你的食谱',
          ja: '人気の組み合わせ + レシピ投稿',
        },
        href: '/recipes',
      },
      {
        emoji: '🌶️',
        title: { ko: '나라별 맵기 평가', en: 'Spiciness by Country', zh: '各国辣度评价', ja: '国別辛さ評価' },
        desc: {
          ko: '내 나라 기준으로 평가하고 참고치 보기',
          en: 'Rate & compare by your country',
          zh: '按你的国家评价并查看参考值',
          ja: '自分の国基準で評価・参考値を見る',
        },
        href: '/guide/link-ramen',
      },
    ],
  },
]

const OFFLINE_SAVED_AT_KEY = 'offline_saved_at'

export default function HomeScreen() {
  const { lang } = useLang()
  const router = useRouter()
  const [favorites, setFavorites] = useState<string[] | null>(null)
  const [offlineStatus, setOfflineStatus] = useState<'idle' | 'saving' | 'done' | 'deleting'>('idle')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [offlineOpen, setOfflineOpen] = useState(false)

  // 가이드 페이지로 이동할 때 현재 언어를 전달해서, 이동한 페이지도 같은 언어로 열리게 한다
  const navigate = (href: string) => router.push(href.includes('?') ? `${href}&lang=${lang}` : `${href}?lang=${lang}`)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY)
      setFavorites(raw ? JSON.parse(raw) : DEFAULT_FAVORITES)
    } catch {
      setFavorites(DEFAULT_FAVORITES)
    }
    const savedRaw = localStorage.getItem(OFFLINE_SAVED_AT_KEY)
    if (savedRaw) { setSavedAt(savedRaw); setOfflineStatus('done') }
  }, [])

  const saveForOffline = async () => {
    if (!('serviceWorker' in navigator)) return
    setOfflineStatus('saving')
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      // 다시 저장할 때는 예전 캐시를 지우고 새로 채운다 (계속 쌓이는 것 방지)
      await Promise.all(['offline-favorites-v1', 'offline-favorites-meta'].map(name => caches.delete(name)))

      // 이 시점부터 발생하는 요청만 캐시에 담기도록 서비스워커에 신호를 보낸다
      // (평소에는 방문하는 페이지가 자동으로 캐시되지 않도록 하기 위함)
      registration.active?.postMessage({ type: 'START_CAPTURE' })

      const targets = favorites ?? DEFAULT_FAVORITES
      // 숨은 iframe으로 각 즐겨찾기 페이지를 실제로 열어서, 서비스워커가 그 과정의
      // 모든 요청(HTML, 이미지 등)을 자동으로 캐시에 담도록 한다
      await Promise.all(targets.map(href => new Promise<void>((resolve) => {
        const iframe = document.createElement('iframe')
        // 화면 밖으로 배치 (display:none이면 이미지 lazy-loading이 트리거되지 않아 캐싱이 누락됨)
        // 페이지 전체 길이만큼 iframe을 키워서, 아래쪽에 있는 이미지도 "뷰포트 안"으로 인식되게 함
        iframe.style.position = 'fixed'
        iframe.style.left = '-9999px'
        iframe.style.width = '390px'
        iframe.style.height = '12000px'
        iframe.src = href.includes('?') ? `${href}&lang=${lang}` : `${href}?lang=${lang}`
        iframe.onload = () => { setTimeout(() => { iframe.remove(); resolve() }, 2000) }
        document.body.appendChild(iframe)
      })))

      registration.active?.postMessage({ type: 'STOP_CAPTURE' })
      registration.active?.postMessage({ type: 'MARK_SAVED' })
      const now = new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en-US')
      localStorage.setItem(OFFLINE_SAVED_AT_KEY, now)
      setSavedAt(now)
      setOfflineStatus('done')
    } catch {
      setOfflineStatus('idle')
    }
  }

  const deleteOfflineData = async () => {
    if (!('serviceWorker' in navigator)) return
    setOfflineStatus('deleting')
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.active) {
        await new Promise<void>((resolve) => {
          const handler = (event: MessageEvent) => {
            if (event.data?.type === 'CLEAR_DONE') {
              navigator.serviceWorker.removeEventListener('message', handler)
              resolve()
            }
          }
          navigator.serviceWorker.addEventListener('message', handler)
          registration.active!.postMessage({ type: 'CLEAR_CACHE' })
        })
      }
      localStorage.removeItem(OFFLINE_SAVED_AT_KEY)
      setSavedAt(null)
      setOfflineStatus('idle')
      alert(OFFLINE_SAVE_LABEL[lang].deleted)
    } catch {
      setOfflineStatus('done')
    }
  }

  const toggleFavorite = (href: string) => {
    const current = favorites ?? DEFAULT_FAVORITES
    if (!current.includes(href) && current.length >= MAX_FAVORITES) {
      alert(FAVORITES_LIMIT_MESSAGE[lang])
      return
    }
    const next = current.includes(href)
      ? current.filter(h => h !== href)
      : [...current, href]
    setFavorites(next)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  }

  const allSections = GROUPS.flatMap(g => g.sections).filter(s => s.href !== null)
  const myMenuSections = (favorites ?? [])
    .map(href => allSections.find(s => s.href === href))
    .filter((s): s is Section => s !== undefined)
  const startHereSections = START_HERE_HREFS
    .map(href => allSections.find(s => s.href === href))
    .filter((s): s is Section => s !== undefined)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-bold text-gray-800 hover:text-emerald-700 transition-colors">
            {HERO[lang].title}
          </button>
          <LangSelector />
        </div>
      </header>

      {/* 히어로 */}
      <div className="bg-emerald-700 text-white text-center py-6 px-4 space-y-2">
        <h2 className="text-lg font-bold leading-snug">{HERO[lang].title}</h2>
        <p className="text-xs text-emerald-200">{HERO[lang].sub}</p>
        <p className="text-xs text-emerald-100 leading-relaxed max-w-md mx-auto">{HERO[lang].summary}</p>
      </div>

      {/* 그룹별 섹션 카드 */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <SearchBox lang={lang} />

        <div
          onClick={() => navigate('/guide/link-phrases')}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate('/guide/link-phrases') }}
          className="rounded-2xl border border-emerald-300 bg-emerald-50 active:opacity-70 px-4 py-3 cursor-pointer transition-all">
          <p className="text-sm font-bold text-emerald-800">{PHRASES_CARD_LABEL[lang].title}</p>
          <p className="text-xs text-emerald-700 mt-0.5">{PHRASES_CARD_LABEL[lang].desc}</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 overflow-hidden">
          <button
            onClick={() => setOfflineOpen(o => !o)}
            className="w-full text-left px-4 py-3">
            <p className="text-sm font-bold text-blue-800">{OFFLINE_SAVE_LABEL[lang].title} <span className="text-blue-400">{offlineOpen ? '▲' : '▼'}</span></p>
            <p className="text-xs text-blue-600 mt-0.5">{OFFLINE_SAVE_LABEL[lang].shortReason}</p>
          </button>

          {offlineOpen && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs text-blue-700 leading-relaxed">{OFFLINE_SAVE_LABEL[lang].fullReason}</p>
              <p className="text-xs text-blue-600 leading-relaxed">{OFFLINE_SAVE_LABEL[lang].favoriteRule}</p>

              {savedAt && offlineStatus !== 'saving' && (
                <p className="text-xs font-semibold text-blue-800">{OFFLINE_SAVE_LABEL[lang].savedAt(savedAt)}</p>
              )}

              <button
                onClick={saveForOffline}
                disabled={offlineStatus === 'saving' || offlineStatus === 'deleting'}
                className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70">
                {offlineStatus === 'saving' ? OFFLINE_SAVE_LABEL[lang].saving : OFFLINE_SAVE_LABEL[lang].idle}
              </button>

              {savedAt && (
                <button
                  onClick={deleteOfflineData}
                  disabled={offlineStatus === 'saving' || offlineStatus === 'deleting'}
                  className="w-full bg-white text-red-600 border border-red-200 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-70">
                  {offlineStatus === 'deleting' ? OFFLINE_SAVE_LABEL[lang].deleting : OFFLINE_SAVE_LABEL[lang].deleteBtn}
                </button>
              )}

              <p className="text-[11px] text-blue-500 leading-relaxed">{OFFLINE_SAVE_LABEL[lang].note}</p>
            </div>
          )}
        </div>

        {myMenuSections.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm p-4">
            <p className="text-xs font-bold mb-3 text-emerald-700">{MY_MENU_LABEL[lang]}</p>
            <div className="flex flex-col gap-2">
              {myMenuSections.map(section => (
                <SectionCard
                  key={section.href}
                  section={section}
                  lang={lang}
                  isFavorite
                  variant="list"
                  onNavigate={() => navigate(section.href!)}
                  onToggleFavorite={() => toggleFavorite(section.href!)}
                  comingSoonLabel={COMING_SOON[lang]}
                />
              ))}
            </div>
          </div>
        )}

        {startHereSections.length > 0 && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold mb-3 text-slate-600">{START_HERE_LABEL[lang]}</p>
            <div className="flex flex-col gap-2">
              {startHereSections.map((section, i) => (
                <div
                  key={section.href}
                  onClick={() => navigate(section.href!)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(section.href!) }}
                  className="rounded-xl border border-slate-200 bg-white active:opacity-70 px-3 py-2.5 flex items-center gap-2 text-left transition-all cursor-pointer">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-slate-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="flex-1 text-xs text-gray-900 leading-snug min-w-0 truncate">
                    <span className="font-bold">{section.title[lang]}</span>
                    <span className="text-gray-400"> · {section.desc[lang]}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          onClick={() => navigate('/feedback')}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate('/feedback') }}
          className="rounded-2xl border border-amber-300 bg-amber-50 active:opacity-70 px-4 py-3 flex items-center justify-between gap-2 text-left transition-all cursor-pointer">
          <p className="text-sm font-bold text-amber-800">{ASK_BANNER_LABEL[lang].text}</p>
          <span className="shrink-0 text-amber-700 text-lg">{ASK_BANNER_LABEL[lang].arrow}</span>
        </div>

        {GROUPS.map((group, gi) => {
          const visibleSections = group.sections.filter(
            section => section.href === null || !(favorites ?? []).includes(section.href)
          )
          if (visibleSections.length === 0) return null
          return (
            <div key={gi} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className={`text-xs font-bold mb-3 ${group.color}`}>{group.label[lang]}</p>
              <div className="grid grid-cols-2 gap-2">
                {visibleSections.map((section, si) => (
                  <SectionCard
                    key={si}
                    section={section}
                    lang={lang}
                    isFavorite={false}
                    onNavigate={() => section.href && navigate(section.href)}
                    onToggleFavorite={() => section.href && toggleFavorite(section.href)}
                    comingSoonLabel={COMING_SOON[lang]}
                    cardClass={group.cardClass}
                  />
                ))}
              </div>
            </div>
          )
        })}

        <p className="text-center text-xs text-gray-300 pt-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gray-400 transition-colors">
            {CONTACT_LABEL[lang]}: {CONTACT_EMAIL}
          </a>
        </p>
      </main>
    </div>
  )
}

function SectionCard({ section, lang, isFavorite, onNavigate, onToggleFavorite, comingSoonLabel, variant = 'grid', cardClass = 'bg-emerald-50 border-emerald-100' }: {
  section: Section
  lang: Lang
  isFavorite: boolean
  onNavigate: () => void
  onToggleFavorite: () => void
  comingSoonLabel: string
  variant?: 'grid' | 'list'
  cardClass?: string
}) {
  const ready = section.href !== null
  const isList = variant === 'list'

  if (isList) {
    return (
      <div
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onNavigate() }}
        className="rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 pl-3 py-2.5 flex items-center gap-2 text-left transition-all cursor-pointer">
        <p className="flex-1 text-xs text-gray-900 leading-snug min-w-0 truncate">
          <span className="font-bold">{section.title[lang]}</span>
          <span className="text-gray-400"> · {section.desc[lang]}</span>
        </p>
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite() }}
          className="shrink-0 flex items-center justify-center self-stretch px-3 text-xs text-gray-300 hover:text-amber-400 transition-colors">
          ⭐
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={ready ? onNavigate : undefined}
      role={ready ? 'button' : undefined}
      tabIndex={ready ? 0 : undefined}
      onKeyDown={ready ? (e => { if (e.key === 'Enter') onNavigate() }) : undefined}
      className={`relative rounded-2xl border px-3 py-3 flex flex-col items-start gap-0.5 text-left transition-all active:opacity-70
        ${ready
          ? `${cardClass} cursor-pointer`
          : 'bg-gray-50 border-gray-100 cursor-default opacity-50'}`}
    >
      {ready && (
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite() }}
          className="absolute top-2 right-2 text-sm leading-none p-0.5">
          {isFavorite ? '⭐' : '☆'}
        </button>
      )}
      {section.badge && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          section.badge === 'official' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {BADGE_LABEL[lang][section.badge]}
        </span>
      )}
      <p className="text-xs font-bold text-gray-900 leading-snug pr-4">{section.title[lang]}</p>
      <p className="text-xs text-gray-400 leading-relaxed pr-4">{section.desc[lang]}</p>
      {!ready && (
        <span className="text-xs text-gray-300">{comingSoonLabel}</span>
      )}
    </div>
  )
}
