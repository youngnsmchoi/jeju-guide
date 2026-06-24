// 관리자 로그인 인증 API
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
