"use client"

import { NavLink } from "./nav-link"
import { useSidebarMenu } from "@/hooks/use-sidebar-menu"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface DesktopSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function DesktopSidebar({ isCollapsed, onToggleCollapse }: DesktopSidebarProps) {
  const { menuItems } = useSidebarMenu()

  return (
    <div className={`fixed inset-y-0 left-0 z-50 hidden bg-card border-r lg:block transition-[width] duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex h-full flex-col">
        <div className={`flex h-16 items-center border-b ${isCollapsed ? "justify-center" : "px-6 justify-between"}`}>
          {!isCollapsed && <Logo />}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    </div>
  )
}