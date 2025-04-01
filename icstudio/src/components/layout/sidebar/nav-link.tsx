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
}

export function NavLink({ item, onClick }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <item.icon className={cn(
        "h-4 w-4",
        isActive ? "text-foreground" : "text-muted-foreground"
      )} />
      {item.title}
    </Link>
  )
} 