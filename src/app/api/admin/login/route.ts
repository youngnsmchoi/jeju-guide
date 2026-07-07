// 관리자 로그인 인증 API — HttpOnly 쿠키 발급
import { NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_session'
const MAX_AGE = 60 * 60 * 8 // 8시간

export async function POST(request: Request) {
  const { password } = await request.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
