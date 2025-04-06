"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { navItems } from "@/config/data/navigation"
import { Bars3Icon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import { useThemeStore } from "@/store/theme-store"

interface MobileNavProps {
  scrolled: boolean
}

const MobileNav = ({ scrolled }: MobileNavProps) => {
  const { theme } = useThemeStore()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen && typeof window !== 'undefined') {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      document.body.style.overflow = "hidden"
    } else if (typeof window !== 'undefined') {
      document.body.style.overflow = ""
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  }

  const submenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  // Prevent hydration mismatch by not rendering theme-dependent elements until client-side
  if (!mounted) {
    return (
      <div className="md:hidden">
        <div className="p-2 rounded-full bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/20">
          <div className="w-5 h-5"></div>
        </div>
      </div>
    )
  }

  const currentTheme = theme || 'system';
  const isDarkTheme = currentTheme === 'dark';

  return (
    <div className="md:hidden">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full ${
          scrolled
            ? "bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30"
            : "bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/20"
        } transition-colors shadow-sm`}
        aria-label="Toggle menu"
      >
        <Bars3Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </motion.button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            style={{ width: "100vw", height: "100vh" }}
          >
            <motion.div
              ref={menuRef}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed inset-y-0 right-0 w-full max-w-sm shadow-xl overflow-hidden ${
                isDarkTheme ? "bg-gray-900" : "bg-white"
              }`}
              style={{ height: "100vh" }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className={`flex justify-between items-center p-4 border-b ${
                  isDarkTheme ? "border-gray-800" : "border-gray-100"
                }`}>
                  <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">导航菜单</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-full ${
                      isDarkTheme ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Menu content */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="p-4">
                    <ul className="space-y-1">
                      {navItems.map((item) => (
                        <motion.li key={item.title} variants={itemVariants} className="overflow-hidden">
                          {item.children ? (
                            <div>
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleSubmenu(item.title)}
                                className={`flex items-center justify-between w-full p-3 rounded-lg ${
                                  isDarkTheme 
                                    ? "text-gray-200 hover:bg-gray-800/60" 
                                    : "text-gray-700 hover:bg-gray-50"
                                } transition-colors`}
                              >
                                <span className="font-medium">{item.title}</span>
                                <motion.div
                                  animate={{ rotate: openSubmenu === item.title ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRightIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                </motion.div>
                              </motion.button>

                              <AnimatePresence initial={false}>
                                {openSubmenu === item.title && (
                                  <motion.ul
                                    variants={submenuVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    className={`pl-4 mt-1 ml-2 border-l-2 ${
                                      isDarkTheme ? "border-indigo-800" : "border-indigo-200"
                                    }`}
                                  >
                                    {item.children.map((child) => (
                                      <motion.li key={child.title} variants={itemVariants}>
                                        <Link
                                          href={child.href}
                                          className={`block p-3 ${
                                            isDarkTheme 
                                              ? "text-gray-400 hover:text-indigo-400" 
                                              : "text-gray-600 hover:text-indigo-600"
                                          } transition-colors`}
                                          onClick={() => setIsOpen(false)}
                                        >
                                          {child.title}
                                        </Link>
                                      </motion.li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link
                              href={item.href}
                              className={`flex items-center w-full p-3 rounded-lg ${
                                isDarkTheme 
                                  ? "text-gray-200 hover:bg-gray-800/60" 
                                  : "text-gray-700 hover:bg-gray-50"
                              } transition-colors`}
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${
                  isDarkTheme ? "border-gray-800" : "border-gray-100"
                }`}>
                  <motion.div variants={itemVariants} className="flex justify-center">
                    <Link
                      href="/login"
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition-colors shadow-md hover:shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      登录 / 注册
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileNav

