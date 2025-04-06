"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { navItems } from "@/config/data/navigation"
import { MoonIcon, SunIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import MobileNav from "./mobile-nav"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { useSession } from "@/hooks/use-session"
import { useRouter } from "next/navigation"
import { useThemeStore } from "@/store/theme-store"

const Nav = () => {
  const { theme, setTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Use framer-motion's useScroll hook for smoother animations
  const { scrollY } = useScroll()

  // Transform values based on scroll position
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95])
  const headerPadding = useTransform(scrollY, [0, 100], [16, 12])
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85])
  const navScale = useTransform(scrollY, [0, 100], [1, 0.92])
  const navOpacity = useTransform(scrollY, [0, 30], [1, 0.95])

  useEffect(() => {
    setMounted(true)

    // Initial scroll position check
    const checkScroll = () => {
      if (typeof window !== 'undefined') {
        const isScrolled = window.scrollY > 10
        const shouldShowBackToTop = window.scrollY > 500
        setScrolled(isScrolled)
        setShowBackToTop(shouldShowBackToTop)
      }
    }

    // Check current scroll position immediately
    checkScroll()

    // Add scroll listener
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", checkScroll)
      
      // Cleanup function
      return () => window.removeEventListener("scroll", checkScroll)
    }
  }, [])

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleDropdown = (title: string) => {
    if (openDropdown === title) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(title)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center h-16">
        <div className="w-full backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 border-b border-transparent">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="w-[160px] h-[40px]"></div>
              <div className="hidden md:flex items-center space-x-8"></div>
              <div className="flex items-center space-x-4"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const currentTheme = theme || 'system';
  const isDarkTheme = currentTheme === 'dark';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ scale: headerScale }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out"
      >
        <motion.div
          layout
          style={{
            backgroundColor: scrolled
              ? isDarkTheme
                ? "rgba(17, 24, 39, 0.7)"
                : "rgba(255, 255, 255, 0.7)"
              : isDarkTheme
                ? "rgba(17, 24, 39, 0.3)"
                : "rgba(255, 255, 255, 0.3)",
          }}
          className={`transition-all duration-500 ease-in-out ${
            scrolled
              ? "mt-4 mx-4 rounded-2xl backdrop-blur-xl border border-white/20 dark:border-gray-800/30 shadow-lg w-[90%] max-w-6xl"
              : "w-full backdrop-blur-lg border-b border-transparent"
          }`}
        >
          <motion.div
            style={{ padding: headerPadding }}
            className={`transition-all duration-500 ease-in-out ${scrolled ? "max-w-5xl mx-auto" : "container mx-auto px-4"}`}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <motion.div style={{ scale: logoScale }}>
                  <Image
                    src="/logo/logo-t.svg"
                    alt="Logo"
                    width={160}
                    height={40}
                    className="transition-all duration-500 ease-in-out"
                  />
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <motion.nav
                style={{ scale: navScale, opacity: navOpacity }}
                className="hidden md:flex items-center space-x-8 transition-all duration-500 ease-in-out"
              >
                {navItems.map((item) => (
                  <div key={item.title} className="relative group">
                    {item.children ? (
                      <button
                        onClick={() => toggleDropdown(item.title)}
                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                      >
                        <motion.span className="transition-all duration-300 font-medium">{item.title}</motion.span>
                        <ChevronDownIcon
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ease-in-out ${
                            openDropdown === item.title ? "rotate-180" : ""
                          }`}
                        />
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                      >
                        <motion.span className="transition-all duration-300 font-medium">{item.title}</motion.span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                      </Link>
                    )}

                    {item.children && (
                      <AnimatePresence>
                        {openDropdown === item.title && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-48 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-lg py-1 border border-white/30 dark:border-gray-700/30"
                          >
                            {item.children.map((child) => (
                              <motion.div
                                key={child.title}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <Link
                                  href={child.href}
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  {child.title}
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </motion.nav>

              {/* Right side buttons */}
              <motion.div
                style={{ scale: navScale }}
                className="flex items-center space-x-4 transition-all duration-500 ease-in-out"
              >
                {/* Theme toggle */}
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
                  className={`p-1.5 rounded-full backdrop-blur-md ${
                    scrolled
                      ? "bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30"
                      : "bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/20"
                  } transition-colors shadow-sm`}
                  aria-label="Toggle theme"
                >
                  {isDarkTheme ? (
                    <SunIcon className="w-5 h-5 text-amber-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-indigo-600" />
                  )}
                </motion.button>

                {/* Login/Register button */}
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === "authenticated" && session?.user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.user.image || undefined} />
                          <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{session.user.name}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {(session.user.role === "admin" || session.user.role === "team") && (
                          <>
                            <DropdownMenuItem>
                              <Link href="/admin" className="w-full">
                                管理页面
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem>
                          <Link href="/home/profile" className="w-full">
                            个人信息
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>退出登录</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href="/login"
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      登录/注册
                    </Link>
                  )}
                </motion.div>

                {/* Mobile Navigation */}
                <MobileNav scrolled={scrolled} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleBackToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors duration-300"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUpIcon className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default Nav

