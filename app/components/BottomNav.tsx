"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/zukan", label: "図鑑", icon: "📖" },
  { href: "/record", label: "記録", icon: "➕" },
  { href: "/settings", label: "設定", icon: "⚙️" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div
          className="bg-white/90 backdrop-blur-md border-t border-gray-200"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
        >
          <div className="flex">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  <span className="text-xl leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
