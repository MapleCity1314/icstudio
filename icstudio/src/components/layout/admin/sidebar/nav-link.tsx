"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface NavLinkProps {
  item: {
    title: string
    href: string
    icon: LucideIcon
  }
  onClick?: () => void
  isCollapsed?: boolean
}

export function NavLink({ item, onClick, isCollapsed }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg py-2 text-sm font-medium transition-all hover:bg-accent",
        isCollapsed ? "justify-center px-2" : "gap-3 px-3",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <item.icon className={cn(
        "h-4 w-4",
        isActive ? "text-foreground" : "text-muted-foreground"
      )} />
      {!isCollapsed && item.title}
    </Link>
  )
}