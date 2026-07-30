'use client'
// 이 말이 필요할 때 — 말을 몰라도 화면을 보여주기만 하면 되는 문구 모음

import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'
import NavBar from '@/components/NavBar'
import PhraseButton from '@/components/PhraseButton'

const LABEL: Record<Lang, {
  title: string
  intro: string
  expand: string
  groups: { emoji: string; situation: string; phrase: string }[]
}> = {
  ko: {
    title: '🗣️ 이 말이 필요할 때',
    intro: '말하지 않아도 됩니다. 화면을 점원에게 보여주세요.',
    expand: '보여주기',
    groups: [
      { emoji: '🔥', situation: '전자레인지에 데워야 할 때', phrase: '데워주세요' },
      { emoji: '🚻', situation: '화장실이 있는지 물어볼 때', phrase: '화장실 있어요?' },
      { emoji: '🚇', situation: '교통카드를 사고 싶을 때', phrase: '교통카드 구입하려고 합니다' },
      { emoji: '💳', situation: '교통카드로 결제하고 싶을 때', phrase: '티머니로 결제할게요' },
      { emoji: '💰', situation: '교통카드 잔액이 궁금할 때', phrase: '교통카드 잔액 확인해주세요' },
    ],
  },
  en: {
    title: '🗣️ Show This to Staff',
    intro: 'No need to speak. Just show this screen to the staff.',
    expand: 'Show',
    groups: [
      { emoji: '🔥', situation: 'When you need something microwaved', phrase: '데워주세요 (Please heat this up)' },
      { emoji: '🚻', situation: 'When asking if there\'s a restroom', phrase: '화장실 있어요? (Is there a restroom?)' },
      { emoji: '🚇', situation: 'When you want to buy a transit card', phrase: '교통카드 구입하려고 합니다 (I\'d like to buy a transit card)' },
      { emoji: '💳', situation: 'When paying with a transit card', phrase: '티머니로 결제할게요 (I\'ll pay with T-money)' },
      { emoji: '💰', situation: 'When you want to check your card balance', phrase: '교통카드 잔액 확인해주세요 (Please check my transit card balance)' },
    ],
  },
  zh: {
    title: '🗣️ 这句话需要时',
    intro: '不用开口说话，把屏幕给店员看就可以了。',
    expand: '显示',
    groups: [
      { emoji: '🔥', situation: '需要用微波炉加热时', phrase: '데워주세요（请帮我加热）' },
      { emoji: '🚻', situation: '想询问是否有洗手间时', phrase: '화장실 있어요?（有洗手间吗？）' },
      { emoji: '🚇', situation: '想购买交通卡时', phrase: '교통카드 구입하려고 합니다（我想买一张交通卡）' },
      { emoji: '💳', situation: '想用交通卡支付时', phrase: '티머니로 결제할게요（我要用T-money支付）' },
      { emoji: '💰', situation: '想查询交通卡余额时', phrase: '교통카드 잔액 확인해주세요（请帮我查询交通卡余额）' },
    ],
  },
  ja: {
    title: '🗣️ この言葉が必要なとき',
    intro: '話さなくても大丈夫です。この画面を店員さんに見せてください。',
    expand: '拡大',
    groups: [
      { emoji: '🔥', situation: '電子レンジで温めてほしいとき', phrase: '데워주세요（温めてください）' },
      { emoji: '🚻', situation: 'トイレがあるか聞きたいとき', phrase: '화장실 있어요?（トイレありますか？）' },
      { emoji: '🚇', situation: '交通カードを買いたいとき', phrase: '교통카드 구입하려고 합니다（交通カードを購入したいです）' },
      { emoji: '💳', situation: '交通カードで支払いたいとき', phrase: '티머니로 결제할게요（T-moneyで払います）' },
      { emoji: '💰', situation: '交通カードの残高が知りたいとき', phrase: '교통카드 잔액 확인해주세요（交通カードの残高を確認してください）' },
    ],
  },
}

export default function PhrasesView() {
  const { lang } = useLang()
  const L = LABEL[lang]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{L.intro}</p>

        {L.groups.map((group, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
            <p className="text-sm font-bold text-gray-800">{group.emoji} {group.situation}</p>
            <PhraseButton phrase={group.phrase} expandLabel={L.expand} />
          </div>
        ))}
      </main>
    </div>
  )
}
