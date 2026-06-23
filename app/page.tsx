"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getItems } from "./lib/storage"
import { ShochuItem } from "./lib/types"

const TOTAL_SLOTS = 50

export default function HomePage() {
  const [items, setItems] = useState<ShochuItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getItems())
    setMounted(true)
  }, [])

  const count = items.length
  const rate = Math.round((count / TOTAL_SLOTS) * 100)
  const recent = items.slice(0, 3)

  if (!mounted) return null

  return (
    <div className="px-4 pt-10 pb-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-1">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
          Takara Shochu
        </p>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          宝焼酎図鑑
        </h1>
        <p className="text-sm text-gray-400">飲んだ記録を集めよう</p>
      </div>

      {/* 達成率カード */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 font-medium">図鑑の達成率</p>
            <p className="text-4xl font-bold text-gray-900 mt-0.5">
              {rate}
              <span className="text-lg font-semibold text-gray-400 ml-1">%</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">登録済み</p>
            <p className="text-3xl font-bold text-gray-900 mt-0.5">
              {count}
              <span className="text-lg font-semibold text-gray-400 ml-1">/ {TOTAL_SLOTS}</span>
            </p>
          </div>
        </div>
        {/* プログレスバー */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/record"
          className="bg-gray-900 text-white rounded-2xl py-4 text-center font-semibold text-sm active:opacity-70 transition-opacity"
        >
          ＋ 記録する
        </Link>
        <Link
          href="/zukan"
          className="bg-white text-gray-900 rounded-2xl py-4 text-center font-semibold text-sm border border-gray-200 active:opacity-70 transition-opacity"
        >
          📖 図鑑を見る
        </Link>
      </div>

      {/* 最近の記録 */}
      {recent.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 tracking-wide">
            最近の記録
          </h2>
          <div className="space-y-2">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/zukan/${item.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm active:opacity-70 transition-opacity"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🥃</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.drinkDate ?? item.createdAt.slice(0, 10)}
                  </p>
                </div>
                {item.rating && (
                  <div className="text-xs text-amber-400 font-bold flex-shrink-0">
                    {"★".repeat(item.rating)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {count === 0 && (
        <div className="text-center py-10 text-gray-400 space-y-2">
          <p className="text-4xl">🥃</p>
          <p className="text-sm">まだ記録がありません</p>
          <p className="text-xs">最初の一本を記録してみよう！</p>
        </div>
      )}
    </div>
  )
}
