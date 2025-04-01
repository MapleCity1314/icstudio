"use client"

import { NavLink } from "./nav-link"
import { useSidebarMenu } from "@/hooks/use-sidebar-menu"
import { Logo } from "@/components/ui/logo"

export default function DesktopSidebar() {
  const { menuItems } = useSidebarMenu()

  return (
    <div className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-card border-r lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center px-6 border-b">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
} 