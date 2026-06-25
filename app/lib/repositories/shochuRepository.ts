import { supabase } from "../supabase"
import type { ShochuItem } from "../types"
import type { ShochuItemRow, ShochuItemInsert, ShochuItemUpdate } from "../database.types"

type Result<T> = { data: T; error: null } | { data: null; error: string }

// ------------------------------------------------------------
// 型変換: ShochuItem (frontend) <-> ShochuItemRow (DB)
// ------------------------------------------------------------

function toRow(item: ShochuItem, userId: string): ShochuItemInsert {
  return {
    id: item.id,
    user_id: userId,
    name: item.name,
    image_url: item.imageUrl ?? null,
    drink_date: item.drinkDate ?? null,
    rating: item.rating ?? null,
    comment: item.comment ?? null,
    favorite: item.favorite ?? false,
    taste: item.flavor ?? null,
    // frontend は string ("7%") で保持。数値部分だけ抽出して保存
    alcohol: item.alcohol ? parseFloat(item.alcohol) || null : null,
    created_at: item.createdAt,
  }
}

function toItem(row: ShochuItemRow): ShochuItem {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url ?? undefined,
    drinkDate: row.drink_date ?? undefined,
    rating: row.rating ?? undefined,
    comment: row.comment ?? undefined,
    favorite: row.favorite,
    flavor: row.taste ?? undefined,
    // DB は number。frontend は string で保持するため文字列化
    alcohol: row.alcohol != null ? String(row.alcohol) : undefined,
    createdAt: row.created_at,
  }
}

// ------------------------------------------------------------
// Repository functions
// ------------------------------------------------------------

export async function createItem(item: ShochuItem, userId: string): Promise<Result<ShochuItem>> {
  if (!supabase) return { data: null, error: "Supabase is not configured" }

  const row = toRow(item, userId)
  const { data, error } = await supabase
    .from("shochu_items")
    .insert(row)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: toItem(data), error: null }
}

export async function updateItem(item: ShochuItem, userId: string): Promise<Result<ShochuItem>> {
  if (!supabase) return { data: null, error: "Supabase is not configured" }

  const update: ShochuItemUpdate = {
    name: item.name,
    image_url: item.imageUrl ?? null,
    drink_date: item.drinkDate ?? null,
    rating: item.rating ?? null,
    comment: item.comment ?? null,
    favorite: item.favorite ?? false,
    taste: item.flavor ?? null,
    alcohol: item.alcohol ? parseFloat(item.alcohol) || null : null,
  }

  const { data, error } = await supabase
    .from("shochu_items")
    .update(update)
    .eq("id", item.id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: toItem(data), error: null }
}

export async function deleteItem(id: string, userId: string): Promise<Result<true>> {
  if (!supabase) return { data: null, error: "Supabase is not configured" }

  const { error } = await supabase
    .from("shochu_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) return { data: null, error: error.message }
  return { data: true, error: null }
}

export async function getItems(userId: string): Promise<Result<ShochuItem[]>> {
  if (!supabase) return { data: null, error: "Supabase is not configured" }

  const { data, error } = await supabase
    .from("shochu_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data.map(toItem), error: null }
}
