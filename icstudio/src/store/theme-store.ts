"use client"

import { create } from "zustand"
import { persist, PersistOptions } from "zustand/middleware"
import { useTheme as useNextTheme } from "next-themes"
import { useEffect } from "react"

// 完整状态接口
interface ThemeState {
  theme: string
  resolvedTheme: string | null
  setTheme: (theme: string) => void
  isInitialized: boolean
  setIsInitialized: (value: boolean) => void
  systemPreference: string | null
  setSystemPreference: (value: string | null) => void
}

// 持久化存储的状态子集
type PersistedThemeState = Pick<ThemeState, 'theme' | 'resolvedTheme' | 'systemPreference'>

// 定义持久化选项
type ThemePersistOptions = PersistOptions<ThemeState, PersistedThemeState>

// 获取初始主题的同步函数
export function getInitialTheme(): string {
  if (typeof window === 'undefined') return 'system' // 服务端默认
  
  try {
    // 优先从localStorage获取
    const savedTheme = localStorage.getItem('theme-storage')
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme)
      if (parsed.state && parsed.state.theme) {
        return parsed.state.theme
      }
    }
    
    // 检查是否有系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  } catch {
    // 忽略错误，返回默认值
    return 'system' 
  }
}

// 初始状态，确保有默认值避免undefined
const initialState = {
  theme: getInitialTheme(),
  resolvedTheme: typeof window !== 'undefined' ? 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : null,
  systemPreference: null,
  isInitialized: false,
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => {
        set({ theme })
        // 尝试在客户端同步更新localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('theme-preference', theme)
            // 触发自定义事件，通知其他组件
            window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))
          } catch (e) {
            console.error('无法保存主题设置到localStorage', e)
          }
        }
      },
      setSystemPreference: (value) => set({ systemPreference: value }),
      setIsInitialized: (value) => set({ isInitialized: value }),
    }),
    {
      name: 'theme-storage',
      skipHydration: true,
      partialize: (state) => ({ 
        theme: state.theme,
        resolvedTheme: state.resolvedTheme,
        systemPreference: state.systemPreference
      }),
    } as ThemePersistOptions
  )
)

// 同步next-themes和我们的store
export function ThemeStoreInitializer() {
  const { theme, resolvedTheme, setTheme } = useNextTheme()
  const { 
    setIsInitialized, 
    isInitialized, 
    setSystemPreference,
    setTheme: storeSetTheme
  } = useThemeStore()
  
  // 监听系统偏好变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light')
    }
    
    // 设置初始值
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light')
    
    // 添加监听器
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange)
    }
    
    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [setSystemPreference])
  
  // 添加主题变更事件监听
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const newTheme = (e as CustomEvent).detail.theme
      if (newTheme && setTheme) {
        setTheme(newTheme)
      }
    }
    
    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [setTheme])
  
  // 初始化状态，一旦next-themes准备好就同步
  useEffect(() => {
    if (!isInitialized && theme) {
      storeSetTheme(theme) // 同步到我们的store
      useThemeStore.setState({
        theme: theme,
        resolvedTheme: resolvedTheme || theme,
        setTheme: setTheme
      })
      setIsInitialized(true)
    }
  }, [theme, resolvedTheme, setTheme, storeSetTheme, setIsInitialized, isInitialized])
  
  // 持续同步next-themes和store状态
  useEffect(() => {
    if (isInitialized && theme) {
      useThemeStore.setState({ 
        theme: theme, 
        resolvedTheme: resolvedTheme || theme
      })
    }
  }, [theme, resolvedTheme, isInitialized])
  
  return null
}