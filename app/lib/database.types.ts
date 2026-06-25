export type Database = {
  public: {
    Tables: {
      shochu_items: {
        Row: {
          id: string
          user_id: string
          name: string
          image_url: string | null
          drink_date: string | null
          rating: number | null
          comment: string | null
          favorite: boolean
          taste: string | null
          alcohol: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          image_url?: string | null
          drink_date?: string | null
          rating?: number | null
          comment?: string | null
          favorite?: boolean
          taste?: string | null
          alcohol?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          image_url?: string | null
          drink_date?: string | null
          rating?: number | null
          comment?: string | null
          favorite?: boolean
          taste?: string | null
          alcohol?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type ShochuItemRow = Database["public"]["Tables"]["shochu_items"]["Row"]
export type ShochuItemInsert = Database["public"]["Tables"]["shochu_items"]["Insert"]
export type ShochuItemUpdate = Database["public"]["Tables"]["shochu_items"]["Update"]
