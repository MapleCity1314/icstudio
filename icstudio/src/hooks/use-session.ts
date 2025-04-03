"use client"

import { useSession as useNextAuthSession } from "next-auth/react"
import { toast } from "sonner"

export function useSession() {
  const session = useNextAuthSession()
  // 处理session错误
  if (session.status == "error") {
    toast.error("会话状态获取失败")
  }
  
  return session
}