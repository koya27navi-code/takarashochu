"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getItem, deleteItem } from "../../lib/storage"
import { ShochuItem } from "../../lib/types"

export default function DetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [item, setItem] = useState<ShochuItem | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const found = getItem(id)
    setItem(found ?? null)
    setMounted(true)
  }, [id])

  function handleDelete() {
    deleteItem(id)
    router.push("/zukan")
  }

  if (!mounted) return null

  if (!item) {
    return (
      <div className="px-4 pt-8 text-center space-y-4">
        <p className="text-gray-400">商品が見つかりません</p>
        <button
          onClick={() => router.push("/zukan")}
          className="text-sm text-gray-900 underline"
        >
          図鑑に戻る
        </button>
      </div>
    )
  }

  return (
    <div className="pb-6">
      {/* 写真エリア */}
      <div className="relative">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-72 object-cover"
          />
        ) : (
          <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
            <span className="text-7xl">🥃</span>
          </div>
        )}
        {/* 戻るボタン */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow text-gray-900 text-xl font-medium"
        >
          ‹
        </button>
        {/* お気に入り */}
        {item.favorite && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow text-lg">
            ❤️
          </div>
        )}
      </div>

      {/* 詳細情報 */}
      <div className="px-4 pt-5 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {item.name}
          </h1>
          {item.rating && (
            <p className="text-amber-400 text-lg mt-1">
              {"★".repeat(item.rating)}
              <span className="text-gray-200">{"★".repeat(5 - item.rating)}</span>
            </p>
          )}
        </div>

        {/* 情報カード */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {item.flavor && (
            <InfoRow label="味・フレーバー" value={item.flavor} />
          )}
          {item.alcohol && (
            <InfoRow label="アルコール度数" value={item.alcohol} />
          )}
          {item.drinkDate && (
            <InfoRow label="飲んだ日" value={item.drinkDate} />
          )}
          <InfoRow
            label="登録日"
            value={item.createdAt.slice(0, 10)}
          />
        </div>

        {/* コメント */}
        {item.comment && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              コメント
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.comment}</p>
          </div>
        )}

        {/* 削除ボタン */}
        {showDeleteConfirm ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <p className="text-sm text-center text-gray-700 font-medium">
              本当に削除しますか？
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white rounded-xl py-3 text-sm font-semibold"
              >
                削除する
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-red-400 text-sm py-3 font-medium"
          >
            この記録を削除する
          </button>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
