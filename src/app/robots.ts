// 검색엔진 크롤러에게 접근 허용 범위를 알려주는 robots.txt 생성
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/feedback', '/ramen-log', '/recipes/new', '/vibe'],
    },
    sitemap: 'https://www.koreacvsguide.com/sitemap.xml',
  }
}
