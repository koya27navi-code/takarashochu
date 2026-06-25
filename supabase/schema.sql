-- ============================================================
-- 宝焼酎図鑑 - Database Schema
-- ============================================================

-- ------------------------------------------------------------
-- 1. updated_at 自動更新用 Trigger 関数
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 2. shochu_items テーブル
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shochu_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  name        TEXT NOT NULL,
  image_url   TEXT,
  drink_date  DATE,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  favorite    BOOLEAN DEFAULT false,
  taste       TEXT,
  alcohol     NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. インデックス
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_shochu_items_user_id
  ON public.shochu_items (user_id);

CREATE INDEX IF NOT EXISTS idx_shochu_items_drink_date
  ON public.shochu_items (drink_date);

CREATE INDEX IF NOT EXISTS idx_shochu_items_favorite
  ON public.shochu_items (favorite);

-- ------------------------------------------------------------
-- 4. updated_at 自動更新 Trigger
-- ------------------------------------------------------------
CREATE TRIGGER trg_shochu_items_updated_at
  BEFORE UPDATE ON public.shochu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 5. RLS（Row Level Security）
-- ------------------------------------------------------------
ALTER TABLE public.shochu_items ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分のデータのみ取得可
CREATE POLICY "Users can select own items"
  ON public.shochu_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: 自分のuser_idでのみ挿入可
CREATE POLICY "Users can insert own items"
  ON public.shochu_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分のデータのみ更新可
CREATE POLICY "Users can update own items"
  ON public.shochu_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分のデータのみ削除可
CREATE POLICY "Users can delete own items"
  ON public.shochu_items
  FOR DELETE
  USING (auth.uid() = user_id);
