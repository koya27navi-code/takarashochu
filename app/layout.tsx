import type { Metadata, Viewport } from "next"
import "./globals.css"
import BottomNav from "./components/BottomNav"

export const metadata: Metadata = {
  title: "宝焼酎図鑑",
  description: "飲んだ宝焼酎を記録して、あなただけの図鑑を作ろう",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f5f7",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full bg-[#f5f5f7]">
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
          <main className="flex-1 pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
