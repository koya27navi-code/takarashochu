import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/**
 * env 未設定時は null を返す。
 * 接続できない場合でも既存の localStorage 保存には影響しない。
 */
export const supabase = url && key ? createClient(url, key) : null
