import { ShochuItem } from "./types"

const STORAGE_KEY = "shochu_items"

export function getItems(): ShochuItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveItems(items: ShochuItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addItem(item: ShochuItem): void {
  const items = getItems()
  saveItems([item, ...items])
}

export function getItem(id: string): ShochuItem | undefined {
  return getItems().find((item) => item.id === id)
}

export function updateItem(updated: ShochuItem): void {
  const items = getItems().map((item) => (item.id === updated.id ? updated : item))
  saveItems(items)
}

export function deleteItem(id: string): void {
  const items = getItems().filter((item) => item.id !== id)
  saveItems(items)
}

export function resetAll(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
