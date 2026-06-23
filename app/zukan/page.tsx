"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getItems } from "../lib/storage"
import { ShochuItem } from "../lib/types"

const TOTAL_SLOTS = 50

export default function ZukanPage() {
  const [items, setItems] = useState<ShochuItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getItems())
    setMounted(true)
  }, [])

  if (!mounted) return null

  const count = items.length
  const rate = Math.round((count / TOTAL_SLOTS) * 100)
  const emptySlots = Math.max(0, TOTAL_SLOTS - count)

  return (
    <div className="px-4 pt-8 pb-6 space-y-5">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">図鑑</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {count} / {TOTAL_SLOTS} 種類を制覇
        </p>
      </div>

      {/* 達成率バー */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium">達成率</span>
          <span className="font-bold text-gray-900">{rate}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {/* グリッド */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={item.id} href={`/zukan/${item.id}`}>
            <ItemCard item={item} />
          </Link>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <EmptyCard key={`empty-${i}`} index={count + i + 1} />
        ))}
      </div>

      {count === 0 && (
        <div className="text-center py-8 text-gray-400 space-y-2">
          <p className="text-4xl">📖</p>
          <p className="text-sm">まだ登録がありません</p>
          <Link
            href="/record"
            className="inline-block mt-2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full font-medium"
          >
            最初の一本を記録する
          </Link>
        </div>
      )}
    </div>
  )
}

function ItemCard({ item }: { item: ShochuItem }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden active:opacity-70 transition-opacity">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 bg-gray-50 flex items-center justify-center">
          <span className="text-4xl">🥃</span>
        </div>
      )}
      <div className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 flex-1">
            {item.name}
          </p>
          {item.favorite && <span className="text-sm flex-shrink-0">❤️</span>}
        </div>
        {item.rating && (
          <p className="text-xs text-amber-400">
            {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
          </p>
        )}
        <p className="text-xs text-gray-400">
          {item.drinkDate ?? item.createdAt.slice(0, 10)}
        </p>
      </div>
    </div>
  )
}

function EmptyCard({ index }: { index: number }) {
  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden opacity-50">
      <div className="w-full h-36 flex items-center justify-center">
        <span className="text-3xl opacity-30">？</span>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 font-medium">No.{index}</p>
        <p className="text-sm text-gray-300 mt-0.5">未登録</p>
      </div>
    </div>
  )
}
