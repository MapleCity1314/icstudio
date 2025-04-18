"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { ThemeStoreInitializer, getInitialTheme } from "@/store/theme-store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // 在客户端和服务器端使用相同的初始主题获取逻辑
  const defaultTheme = getInitialTheme();
  
  return (
    <NextThemesProvider defaultTheme={defaultTheme} enableSystem={true} {...props}>
      <ThemeStoreInitializer />
      {children}
    </NextThemesProvider>
  )
}
