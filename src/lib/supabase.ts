// Supabase 클라이언트 싱글턴
import { createClient } from '@supabase/supabase-js'

// 환경변수에 줄바꿈이 포함될 경우 제거
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/\s/g, '')
)
