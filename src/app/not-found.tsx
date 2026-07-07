// 존재하지 않는 URL 접근 시 표시되는 404 안내 페이지
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">🍜</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-1">찾을 수 없는 페이지입니다.</p>
      <p className="text-sm text-gray-400 mb-8">페이지를 찾을 수 없습니다 / ページが見つかりません / 页面未找到</p>
      <Link
        href="/"
        className="bg-emerald-600 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:bg-emerald-700 transition-colors"
      >
        홈으로 / Home
      </Link>
    </div>
  )
}
