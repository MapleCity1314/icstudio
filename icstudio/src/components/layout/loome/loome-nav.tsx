"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/config/data/navigation";
import {
      MoonIcon,
      SunIcon,
      ChevronDownIcon,
      ChevronUpIcon,
} from "@heroicons/react/24/outline";
import LoomeNavMobile from "./loome-nav-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

const LoomeNav = () => {
      const { theme, setTheme } = useTheme();
      const [mounted, setMounted] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const [showBackToTop, setShowBackToTop] = useState(false);
      const [openDropdown, setOpenDropdown] = useState<string | null>(null);
      const { data: session, status } = useSession();
      const router = useRouter();

      useEffect(() => {
            setMounted(true);

            const checkScroll = () => {
                  const isScrolled = window.scrollY > 10;
                  const shouldShowBackToTop = window.scrollY > 500;
                  setScrolled(isScrolled);
                  setShowBackToTop(shouldShowBackToTop);
            };

            checkScroll();
            window.addEventListener("scroll", checkScroll);
            return () => window.removeEventListener("scroll", checkScroll);
      }, []);

      const handleBackToTop = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
      };

      const toggleDropdown = (title: string) => {
            if (openDropdown === title) {
                  setOpenDropdown(null);
            } else {
                  setOpenDropdown(title);
            }
      };

      const handleLogout = async () => {
            await signOut({ redirect: false });
            router.push("/login");
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
                              <div
                                    className={`transition-all duration-700 ease-in-out px-6 ${scrolled ? "py-3 max-w-5xl mx-auto" : "container mx-auto px-4 py-3"}`}
                              >
                                    <div className="flex items-center justify-between">
                                          {/* Logo */}
                                          <Link
                                                href="/"
                                                className="flex items-center"
                                          >
                                                <Image
                                                      src={theme === "dark" ? "/logo/loome-w-logo.svg" : "/logo/loome-b-logo.svg"}
                                                      alt="Loome Logo"
                                                      width={
                                                            scrolled ? 130 : 160
                                                      }
                                                      height={
                                                            scrolled ? 32.5 : 40
                                                      }
                                                      className="transition-all duration-700 ease-in-out"
                                                />
                                          </Link>

                                          {/* Desktop Navigation */}
                                          <nav
                                                className={`hidden md:flex items-center space-x-8 transition-all duration-700 ease-in-out ${
                                                      scrolled
                                                            ? "scale-95"
                                                            : "scale-100"
                                                }`}
                                          >
                                                {navItems.map((item) => (
                                                      <div
                                                            key={item.title}
                                                            className="relative group"
                                                      >
                                                            {item.children ? (
                                                                  <button
                                                                        onClick={() => toggleDropdown(item.title)}
                                                                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                                                                  >
                                                                        <span
                                                                              className={`${scrolled ? "text-sm" : "text-base"} transition-all duration-300 font-medium`}
                                                                        >
                                                                              {item.title}
                                                                        </span>
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
                                                                        <span
                                                                              className={`${scrolled ? "text-sm" : "text-base"} transition-all duration-300 font-medium`}
                                                                        >
                                                                              {item.title}
                                                                        </span>
                                                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                                                                  </Link>
                                                            )}

                                                            {item.children && (
                                                                  <div
                                                                        className={`absolute left-0 mt-2 w-48 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-lg py-1 transition-all duration-200 border border-white/30 dark:border-gray-700/30 ${
                                                                              openDropdown ===
                                                                              item.title
                                                                                    ? "opacity-100 visible"
                                                                                    : "opacity-0 invisible"
                                                                        }`}
                                                                  >
                                                                        {item.children.map(
                                                                              (child) => (
                                                                                    <Link
                                                                                          key={child.title}
                                                                                          href={child.href}
                                                                                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                                                                                    >
                                                                                          {child.title}
                                                                                    </Link>
                                                                              ),
                                                                        )}
                                                                  </div>
                                                            )}
                                                      </div>
                                                ))}
                                          </nav>

                                          {/* Right side buttons */}
                                          <div
                                                className={`flex items-center space-x-4 transition-all duration-700 ease-in-out ${
                                                      scrolled
                                                            ? "scale-95"
                                                            : "scale-100"
                                                }`}
                                          >
                                                {/* Theme toggle */}
                                                <motion.button
                                                      whileHover={{
                                                            scale: 1.05,
                                                      }}
                                                      whileTap={{ scale: 0.95 }}
                                                      onClick={() =>
                                                            setTheme(
                                                                  theme ===
                                                                        "dark"
                                                                        ? "light"
                                                                        : "dark",
                                                            )
                                                      }
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
                                                      whileHover={{
                                                            scale: 1.05,
                                                      }}
                                                      whileTap={{ scale: 0.95 }}
                                                >
                                                      {status === "authenticated" && session?.user ? (
                                                            <DropdownMenu>
                                                                  <DropdownMenuTrigger className="flex items-center space-x-2">
                                                                        <Avatar className="h-8 w-8">
                                                                              <AvatarImage
                                                                                    src={
                                                                                          session.user.image || undefined
                                                                                    }
                                                                              />
                                                                              <AvatarFallback>
                                                                                    {
                                                                                          session.user.name?.[0]
                                                                                    }
                                                                              </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="text-sm font-medium">
                                                                              {
                                                                                    session.user.name
                                                                              }
                                                                        </span>
                                                                  </DropdownMenuTrigger>
                                                                  <DropdownMenuContent
                                                                        align="end"
                                                                        className="w-48"
                                                                  >
                                                                        {(session.user.role === "admin" ||
                                                                              session.user.role === "team") && (
                                                                              <>
                                                                                    <DropdownMenuItem>
                                                                                          <Link
                                                                                                href="/admin"
                                                                                                className="w-full"
                                                                                          >
                                                                                                管理页面
                                                                                          </Link>
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                              </>
                                                                        )}
                                                                        <DropdownMenuItem>
                                                                              <Link
                                                                                    href="/home/profile"
                                                                                    className="w-full"
                                                                              >
                                                                                    个人信息
                                                                              </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                              onClick={
                                                                                    handleLogout
                                                                              }
                                                                        >
                                                                              退出登录
                                                                        </DropdownMenuItem>
                                                                  </DropdownMenuContent>
                                                            </DropdownMenu>
                                                      ) : (
                                                            <Link
                                                                  href="/login"
                                                                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500 transition-colors"
                                                            >
                                                                  登录
                                                            </Link>
                                                      )}
                                                </motion.div>
                                          </div>
                                    </div>
                              </div>
                        </motion.div>
                  </motion.header>

                  {/* Mobile Navigation */}
                  <LoomeNavMobile scrolled={scrolled} />

                  {/* Back to top button */}
                  <AnimatePresence>
                        {showBackToTop && (
                              <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    onClick={handleBackToTop}
                                    className="fixed bottom-4 right-4 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50"
                              >
                                    <ChevronUpIcon className="w-6 h-6" />
                              </motion.button>
                        )}
                  </AnimatePresence>
            </>
      );
};

export default LoomeNav;