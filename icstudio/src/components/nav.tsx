"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import gsap from "gsap"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo/nav-logo"
import { cn } from "@/lib/utils"

// 调试模式开关
const DEBUG_MODE = false

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

const HomeNav = () => {
  const { theme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLDivElement>(null)
  const desktopMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Navigation items
  const navItems: NavItem[] = [
    { label: "首页", href: "/" },
    { label: "资源", href: "/resource" },
    { label: "我们做什么", href: "/what-we-do" },
    { label: "关于我们", href: "/who-we-are" },
    { label: "新闻", href: "/news" },
    { label: "联系我们", href: "/contact" },
  ]

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if mobile - 检测是否为移动设备并立即应用样式
  useEffect(() => {
    if (!mounted) return
    
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 1024
      setIsMobile(isMobileDevice)
      
      if (DEBUG_MODE) console.log("设备检测:", isMobileDevice ? "移动设备" : "桌面设备")
      
      // 立即应用样式而不是等待状态更新
      if (hamburgerRef.current && desktopMenuRef.current) {
        if (isMobileDevice) {
          // 移动设备：显示汉堡按钮，隐藏桌面菜单
          hamburgerRef.current.style.display = "block"
          desktopMenuRef.current.style.display = "none"
        } else if (!isScrolled) {
          // 桌面设备且未滚动：隐藏汉堡按钮，显示桌面菜单
          hamburgerRef.current.style.display = "none"
          desktopMenuRef.current.style.display = "flex"
        } else {
          // 桌面设备但已滚动：显示汉堡按钮，隐藏桌面菜单
          hamburgerRef.current.style.display = "block"
          desktopMenuRef.current.style.display = "none"
        }
      }
    }

    // 初始检测
    checkMobile()
    
    // 添加调整大小事件监听器
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [mounted, isScrolled])

  // Handle scroll
  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [mounted])

  // Animate nav on scroll and update mobile status
  useEffect(() => {
    if (!navRef.current) return

    if (isScrolled) {
      gsap.to(navRef.current, {
        height: "64px",
        padding: "0.5rem 1rem",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0)", // 完全透明
        borderRadius: "1rem",
        margin: "0.5rem",
        width: "calc(100% - 1rem)",
        duration: 0.3,
        ease: "power2.out",
      })

      // Hide desktop menu items and show hamburger when scrolled
      if (desktopMenuRef.current && hamburgerRef.current) {
        gsap.to(desktopMenuRef.current, {
          opacity: 0,
          display: "none",
          duration: 0.2,
        })
        gsap.to(hamburgerRef.current, {
          opacity: 1,
          display: "block",
          duration: 0.2,
          delay: 0.1,
        })
      }
    } else {
      gsap.to(navRef.current, {
        height: "80px",
        padding: "1rem 2rem",
        backdropFilter: "blur(0px)",
        backgroundColor: "transparent",
        borderRadius: "0",
        margin: "0",
        width: "100%",
        duration: 0.3,
        ease: "power2.out",
      })

      // Show desktop menu items and hide hamburger when at top (only on desktop)
      if (desktopMenuRef.current && hamburgerRef.current && !isMobile) {
        gsap.to(desktopMenuRef.current, {
          opacity: 1,
          display: "flex",
          duration: 0.2,
          delay: 0.1,
        })
        gsap.to(hamburgerRef.current, {
          opacity: 0,
          display: "none",
          duration: 0.2,
        })
      }
    }
  }, [isScrolled, theme, isMobile])

  // Handle menu animations - 菜单打开/关闭动画
  useEffect(() => {
    if (!menuItemsRef.current) return

    if (DEBUG_MODE) console.log("菜单状态:", isMenuOpen ? "打开" : "关闭")

    if (isMenuOpen) {
      // Animate menu opening
      gsap.fromTo(
        menuItemsRef.current,
        { opacity: 0, y: -20, display: "none" },
        { opacity: 1, y: 0, display: "block", duration: 0.3, ease: "power2.out" },
      )
    } else {
      // Animate menu closing
      gsap.to(menuItemsRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (menuItemsRef.current) {
            menuItemsRef.current.style.display = "none"
          }
        },
      })
    }
  }, [isMenuOpen])

  // Close menu when clicking outside
  useEffect(() => {
    if (!mounted || !isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen, mounted])

  // If not mounted yet, return null to prevent hydration mismatch
  if (!mounted) return null

  return (
    <div
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300 flex items-center justify-between",
        isScrolled ? "h-16 px-4 lg:px-6" : "h-20 px-6 lg:px-8",
      )}
      style={{
        backgroundColor: "transparent", // 始终保持透明
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        borderRadius: isScrolled ? "1rem" : "0",
        margin: isScrolled ? "0.5rem" : "0",
        width: isScrolled ? "calc(100% - 1rem)" : "100%",
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Logo size={isScrolled ? "sm" : "md"} />
      </div>

      {/* 右侧区域 - 确保菜单靠右 */}
      <div className="flex items-center justify-end ml-auto">
        {/* Desktop Navigation - 只在非移动设备且未滚动时显示 */}
        <div
          ref={desktopMenuRef}
          className="items-center space-x-1 justify-end"
          style={{ display: "none" }} // 初始隐藏，由JS控制显示
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                theme === "dark"
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-700 hover:text-black hover:bg-black/5",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 汉堡菜单按钮和下拉菜单内容 */}
        <div className="relative">
          {/* 汉堡菜单按钮 */}
          <button
            ref={hamburgerRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "p-2 rounded-md transition-colors z-50",
              theme === "dark"
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-gray-700 hover:text-black hover:bg-black/5"
            )}
            style={{ display: "none" }} // 初始隐藏，由JS控制显示
            aria-label="切换菜单"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* 下拉菜单内容 */}
          <div
            ref={menuRef}
            className="relative"
          >
            <div
              ref={menuItemsRef}
              className={cn(
                "absolute top-12 right-0 mt-2 p-2 rounded-lg shadow-lg min-w-[200px] w-48",
                theme === "dark" ? "bg-gray-900/95" : "bg-white/95", // 几乎不透明
              )}
              style={{
                backdropFilter: "blur(10px)",
                display: "none", // 初始隐藏
                zIndex: 40,
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "block px-4 py-2 rounded-md text-sm font-medium transition-colors w-full text-left",
                    theme === "dark"
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-black hover:bg-black/5",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeNav