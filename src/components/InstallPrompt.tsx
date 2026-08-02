'use client'
// 홈 화면에 추가(PWA 설치) 안내 — 기기(Android/iOS/PC)를 감지해 맞는 안내만 보여준다

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/types'

type Platform = 'android' | 'ios' | 'desktop'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) return 'android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  return 'desktop'
}

const LABEL: Record<Lang, {
  title: string
  shortReason: string
  installBtn: string
  installedMsg: string
  steps: Record<Platform, string[]>
}> = {
  ko: {
    title: '📱 앱처럼 설치하기',
    shortReason: '홈 화면에 추가하면 앱처럼 바로 열 수 있어요',
    installBtn: '지금 설치하기',
    installedMsg: '✓ 이미 설치되어 있어요',
    steps: {
      android: ['우측 상단 ⋮ 메뉴를 누르세요', '"앱 설치" 또는 "홈 화면에 추가"를 선택하세요'],
      ios: ['하단 공유 버튼(□↑)을 누르세요', '아래로 스크롤해서 "홈 화면에 추가"를 선택하세요'],
      desktop: ['주소창 오른쪽의 설치 아이콘을 누르세요', '아이콘이 안 보이면 ⋮ 메뉴에서 "앱 설치"를 선택하세요'],
    },
  },
  en: {
    title: '📱 Install as an App',
    shortReason: 'Add to your home screen to open it like an app',
    installBtn: 'Install Now',
    installedMsg: '✓ Already installed',
    steps: {
      android: ['Tap the ⋮ menu in the top right', 'Select "Install app" or "Add to Home screen"'],
      ios: ['Tap the Share button (□↑) at the bottom', 'Scroll down and select "Add to Home Screen"'],
      desktop: ['Tap the install icon in the address bar', "If you don't see it, use the ⋮ menu and select \"Install app\""],
    },
  },
  zh: {
    title: '📱 像应用一样安装',
    shortReason: '添加到主屏幕后可以像应用一样直接打开',
    installBtn: '立即安装',
    installedMsg: '✓ 已安装',
    steps: {
      android: ['点击右上角的⋮菜单', '选择"安装应用"或"添加到主屏幕"'],
      ios: ['点击底部的分享按钮（□↑）', '向下滚动并选择"添加到主屏幕"'],
      desktop: ['点击地址栏右侧的安装图标', '如果没有看到，请在⋮菜单中选择"安装应用"'],
    },
  },
  ja: {
    title: '📱 アプリのようにインストール',
    shortReason: 'ホーム画面に追加すると、アプリのようにすぐ開けます',
    installBtn: '今すぐインストール',
    installedMsg: '✓ インストール済みです',
    steps: {
      android: ['右上の⋮メニューをタップ', '「アプリをインストール」または「ホーム画面に追加」を選択'],
      ios: ['下部の共有ボタン（□↑）をタップ', '下にスクロールして「ホーム画面に追加」を選択'],
      desktop: ['アドレスバー右側のインストールアイコンをタップ', '見当たらない場合は⋮メニューから「アプリをインストール」を選択'],
    },
  },
}

export default function InstallPrompt({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState<Platform>('desktop')
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

  useEffect(() => {
    setPlatform(detectPlatform())
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const L = LABEL[lang]

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    // Android Chrome에서는 실제 설치창을 바로 띄울 수 있다
    const promptEvent = deferredPrompt as Event & { prompt: () => void }
    promptEvent.prompt()
    setDeferredPrompt(null)
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 py-3">
        <p className="text-sm font-bold text-emerald-800">{L.title} <span className="text-emerald-400">{open ? '▲' : '▼'}</span></p>
        <p className="text-xs text-emerald-600 mt-0.5">{L.shortReason}</p>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          {isStandalone ? (
            <p className="text-xs font-semibold text-emerald-800">{L.installedMsg}</p>
          ) : (
            <>
              <ol className="space-y-1.5">
                {L.steps[platform].map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-emerald-700">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
                  {L.installBtn}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
