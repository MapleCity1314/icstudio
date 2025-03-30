"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/data/navigation";
import { MoonIcon, SunIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import MobileNav from "./mobile-nav";
import { motion, AnimatePresence } from "framer-motion";

const Nav = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // 初始检查滚动位置
    const checkScroll = () => {
      const isScrolled = window.scrollY > 10;
      const shouldShowBackToTop = window.scrollY > 500;
      setScrolled(isScrolled);
      setShowBackToTop(shouldShowBackToTop);
    };

    // 立即检查一次当前滚动位置
    checkScroll();

    // 添加滚动监听
    window.addEventListener("scroll", checkScroll);
    
    // 清理函数
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (title: string) => {
    if (openDropdown === title) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(title);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-in-out`}
      >
        <motion.div
          layout
          className={`transition-all duration-700 ease-in-out ${
            scrolled
              ? "mt-4 mx-4 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg w-[90%] max-w-6xl"
              : "w-full backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 border-b border-transparent"
          }`}
        >
          <div className={`transition-all duration-700 ease-in-out px-6 ${scrolled ? 'py-3 max-w-5xl mx-auto' : 'container mx-auto px-4 py-3'}`}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo/logo-t.png"
                  alt="Logo"
                  width={scrolled ? 130 : 160}
                  height={scrolled ? 32.5 : 40}
                  className="transition-all duration-700 ease-in-out"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className={`hidden md:flex items-center space-x-8 transition-all duration-700 ease-in-out ${
                scrolled ? 'scale-95' : 'scale-100'
              }`}>
                {navItems.map((item) => (
                  <div key={item.title} className="relative group">
                    <button
                      onClick={() => item.children && toggleDropdown(item.title)}
                      className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                    >
                      <span className={`${scrolled ? "text-sm" : "text-base"} transition-all duration-300 font-medium`}>
                        {item.title}
                      </span>
                      {item.children && (
                        <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-200 ease-in-out ${
                          openDropdown === item.title ? "rotate-180" : ""
                        }`} />
                      )}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                    </button>

                    {item.children && (
                      <div
                        className={`absolute left-0 mt-2 w-48 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-lg py-1 transition-all duration-200 border border-white/30 dark:border-gray-700/30 ${
                          openDropdown === item.title ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Right side buttons */}
              <div className={`flex items-center space-x-4 transition-all duration-700 ease-in-out ${
                scrolled ? 'scale-95' : 'scale-100'
              }`}>
                {/* Theme toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-1.5 rounded-full backdrop-blur-md ${
                    scrolled 
                      ? "bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30" 
                      : "bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/20"
                  } transition-colors shadow-sm`}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <SunIcon className="w-5 h-5 text-amber-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-indigo-600" />
                  )}
                </motion.button>

                {/* Login/Register button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className={`hidden sm:flex items-center ${
                      scrolled
                        ? "text-sm py-1.5 px-3"
                        : "text-base py-1.5 px-4"
                    } bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    登录/注册
                  </Link>
                </motion.div>

                {/* Mobile Navigation */}
                <MobileNav scrolled={scrolled} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* 返回顶部按钮 */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleBackToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUpIcon className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;