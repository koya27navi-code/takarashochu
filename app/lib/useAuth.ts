"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setAuthInitialized(true)
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setAuthInitialized(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, authInitialized }
}
