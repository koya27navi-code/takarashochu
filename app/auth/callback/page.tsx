"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      router.replace("/settings")
      return
    }

    const handleCallback = async () => {
      // hash形式のMagic Linkはクライアント初期化時に自動処理されるため、まず既存セッションを確認
      const { data: existingSession } = await supabase!.auth.getSession()
      if (existingSession.session) {
        router.replace("/settings")
        return
      }

      // セッションがない場合は PKCE(code形式)を想定して交換を試みる
      const { error: exchangeError } = await supabase!.auth.exchangeCodeForSession(
        window.location.href
      )

      if (exchangeError) {
        const { data: sessionAfterError } = await supabase!.auth.getSession()
        if (sessionAfterError.session) {
          router.replace("/settings")
          return
        }

        if (exchangeError.code === "otp_expired") {
          setError(
            "ログインリンクの有効期限が切れています。\nもう一度設定画面からログインリンクを送信してください。"
          )
        } else {
          setError("ログインに失敗しました。リンクの有効期限が切れている可能性があります。")
        }
      } else {
        router.replace("/settings")
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="px-4 pt-16 text-center space-y-4">
        <p className="text-sm text-red-400 whitespace-pre-line leading-relaxed">{error}</p>
        <button
          onClick={() => router.replace("/settings")}
          className="text-sm text-gray-900 underline"
        >
          設定画面に戻る
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-16 text-center">
      <p className="text-sm text-gray-400">ログイン処理中...</p>
    </div>
  )
}
