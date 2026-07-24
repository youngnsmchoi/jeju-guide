// 편의점 꿀팁 페이지 — 전자레인지·삼각김밥·T-money 안내
import { Suspense } from 'react'
import CvsTipsView from './CvsTipsView'

export default function CvsTipsPage() {
  return (
    <Suspense>
      <CvsTipsView />
    </Suspense>
  )
}
