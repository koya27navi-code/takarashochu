"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { resetAll, getItems } from "../lib/storage"

export default function SettingsPage() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const count = typeof window !== "undefined" ? getItems().length : 0

  function handleReset() {
    resetAll()
    setDone(true)
    setShowConfirm(false)
    setTimeout(() => router.push("/"), 1000)
  }

  return (
    <div className="px-4 pt-8 pb-6 space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">設定</h1>

      {/* アプリ情報 */}
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-sm text-gray-700">アプリ名</span>
          <span className="text-sm font-medium text-gray-900">宝焼酎図鑑</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-sm text-gray-700">バージョン</span>
          <span className="text-sm font-medium text-gray-400">1.0.0</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-sm text-gray-700">登録件数</span>
          <span className="text-sm font-medium text-gray-900">{count} 件</span>
        </div>
      </div>

      {/* データ保存について */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-700">保存データについて</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          データはこのデバイスのブラウザ（localStorage）に保存されています。
          ブラウザのデータを削除すると記録も消えます。
          別デバイスとの同期には対応していません（将来対応予定）。
        </p>
      </div>

      {/* リセット */}
      <div className="bg-white rounded-2xl shadow-sm">
        {done ? (
          <div className="px-4 py-5 text-center text-sm text-gray-400">
            ✓ データをリセットしました
          </div>
        ) : showConfirm ? (
          <div className="p-4 space-y-3">
            <p className="text-sm text-center text-gray-700 font-medium">
              すべての記録を削除します。元には戻せません。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white rounded-xl py-3 text-sm font-semibold"
              >
                リセットする
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full px-4 py-4 text-sm text-red-400 font-medium text-left"
          >
            データをリセットする
          </button>
        )}
      </div>
    </div>
  )
}
