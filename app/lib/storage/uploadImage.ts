import { supabase } from "../supabase"

const BUCKET = "shochu-images"

/** shochu-images bucket 内のパスを生成する */
function buildPath(file: File): string {
  const ext = file.name.split(".").pop() ?? "jpg"
  const uid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  return `${uid}.${ext}`
}

/**
 * 画像を Supabase Storage にアップロードし、Public URL を返す。
 * - supabase が未設定または失敗時は例外を throw する
 */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not configured")
  }

  const path = buildPath(file)
  const contentType = file.type || "image/jpeg"

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: false })

  if (uploadError) {
    throw new Error(`uploadImage failed: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

  if (!data.publicUrl) {
    throw new Error("uploadImage: could not get public URL")
  }

  return data.publicUrl
}

/**
 * Supabase Storage から画像を削除する。
 * - URL から bucket パスを抽出して削除する
 * - supabase が未設定の場合はスキップする（例外を throw しない）
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!supabase) return

  const path = extractPathFromUrl(imageUrl)
  if (!path) return

  const { error } = await supabase.storage.from(BUCKET).remove([path])

  if (error) {
    throw new Error(`deleteImage failed: ${error.message}`)
  }
}

/**
 * Supabase Storage の Public URL からバケット内パスを抽出する。
 * URL 形式: .../storage/v1/object/public/shochu-images/{path}
 */
function extractPathFromUrl(url: string): string | null {
  try {
    const marker = `/object/public/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return null
    return decodeURIComponent(url.slice(idx + marker.length))
  } catch {
    return null
  }
}
