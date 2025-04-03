"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "./user-nav"
import { NotificationDropdown } from "./notification-dropdown"

interface HeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

export default function Header({ onMenuClick, isMobile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotificationDropdown />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 