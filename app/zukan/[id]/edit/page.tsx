"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { getItem, updateItem } from "../../../lib/storage"

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const fileRef = useRef<HTMLInputElement>(null)

  const [mounted, setMounted] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState("")
  const [flavor, setFlavor] = useState("")
  const [alcohol, setAlcohol] = useState("")
  const [drinkDate, setDrinkDate] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [favorite, setFavorite] = useState(false)
  const [createdAt, setCreatedAt] = useState("")

  useEffect(() => {
    const item = getItem(id)
    if (!item) {
      setNotFound(true)
      setMounted(true)
      return
    }
    setName(item.name)
    setFlavor(item.flavor ?? "")
    setAlcohol(item.alcohol ?? "")
    setDrinkDate(item.drinkDate ?? "")
    setRating(item.rating ?? 0)
    setComment(item.comment ?? "")
    setImageUrl(item.imageUrl ?? "")
    setFavorite(item.favorite ?? false)
    setCreatedAt(item.createdAt)
    setMounted(true)
  }, [id])

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    updateItem({
      id,
      name: name.trim(),
      flavor: flavor.trim() || undefined,
      alcohol: alcohol.trim() || undefined,
      drinkDate: drinkDate || undefined,
      rating: rating > 0 ? rating : undefined,
      comment: comment.trim() || undefined,
      imageUrl: imageUrl || undefined,
      favorite,
      createdAt,
    })
    router.push(`/zukan/${id}`)
  }

  if (!mounted) return null

  if (notFound) {
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
    <div className="px-4 pt-8 pb-6 space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/zukan/${id}`)}
          className="text-gray-400 text-2xl leading-none"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold text-gray-900">編集</h1>
      </div>

      {/* 写真 */}
      <div
        onClick={() => fileRef.current?.click()}
        className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:opacity-70 transition-opacity"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="缶の写真"
            className="w-full h-52 object-cover"
          />
        ) : (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-4xl">📷</span>
            <p className="text-sm">写真を追加</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImage}
        />
      </div>

      {/* フォーム */}
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        <FormRow label="商品名 *">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：宝焼酎 レモン"
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none text-right"
          />
        </FormRow>
        <FormRow label="味・フレーバー">
          <input
            type="text"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            placeholder="例：レモン"
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none text-right"
          />
        </FormRow>
        <FormRow label="アルコール度数">
          <input
            type="text"
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            placeholder="例：7%"
            className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none text-right"
          />
        </FormRow>
        <FormRow label="飲んだ日">
          <input
            type="date"
            value={drinkDate}
            onChange={(e) => setDrinkDate(e.target.value)}
            className="text-sm text-gray-900 outline-none"
          />
        </FormRow>
      </div>

      {/* 評価 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">評価</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star === rating ? 0 : star)}
              className="text-3xl leading-none transition-transform active:scale-110"
            >
              {star <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      {/* コメント */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-2">コメント</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="味わいや感想を書こう..."
          rows={3}
          className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none resize-none"
        />
      </div>

      {/* お気に入り */}
      <div className="bg-white rounded-2xl shadow-sm">
        <button
          onClick={() => setFavorite(!favorite)}
          className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
        >
          <span className="text-sm font-medium text-gray-700">お気に入り</span>
          <span className="text-2xl">{favorite ? "❤️" : "🤍"}</span>
        </button>
      </div>

      {/* ボタン群 */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/zukan/${id}`)}
          className="flex-1 border border-gray-200 text-gray-700 rounded-2xl py-4 text-sm font-medium active:opacity-70 transition-opacity"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="flex-1 bg-gray-900 text-white rounded-2xl py-4 text-sm font-semibold disabled:opacity-30 active:opacity-70 transition-opacity"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  )
}

function FormRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center px-4 py-3.5 gap-3">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0 w-32">
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  )
}
