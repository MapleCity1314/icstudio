"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { NavLink } from "./nav-link"
import { useSidebarMenu } from "@/hooks/use-sidebar-menu"
import { Logo } from "@/components/ui/logo"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { menuItems } = useSidebarMenu()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex h-16 items-center px-6 border-b">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => (
            <NavLink key={item.href} item={item} onClick={onClose} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
} 