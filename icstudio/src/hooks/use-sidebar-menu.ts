"use client"

import { adminMenuItems } from "@/config/admin-menu"
import { useSession } from "next-auth/react"

export function useSidebarMenu() {
  const { data: session } = useSession()
  
  const filteredMenuItems = adminMenuItems.filter(item => {
    if (item.role) {
      return session?.user?.role === item.role
    }
    return true
  })

  return {
    menuItems: filteredMenuItems
  }
} 