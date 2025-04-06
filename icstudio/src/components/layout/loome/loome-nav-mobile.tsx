"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/config/data/navigation";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface LoomeNavMobileProps {
  scrolled: boolean;
}

const LoomeNavMobile = ({ scrolled }: LoomeNavMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  return (
    <div className="md:hidden">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-md ${scrolled ? "bg-blue-50 dark:bg-gray-800" : "bg-blue-100 dark:bg-gray-700"}`}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Bars3Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
        </Button>
      </motion.div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">菜单</h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-gray-800"
                >
                  <XMarkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </Button>
              </div>

              <nav className="p-4">
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item.title}>
                      {item.children ? (
                        <div>
                          <Button
                            onClick={() => toggleSubmenu(item.title)}
                            className="flex items-center justify-between w-full py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {item.title}
                            <ChevronDownIcon
                              className={`w-5 h-5 transition-transform ${openSubmenu === item.title ? "rotate-180" : ""}`}
                            />
                          </Button>
                          <AnimatePresence>
                            {openSubmenu === item.title && (
                              <motion.ul 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="pl-4 mt-2 space-y-2 border-l-2 border-blue-500 dark:border-blue-400"
                              >
                                {item.children.map((child) => (
                                  <motion.li 
                                    key={child.title}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <Link
                                      href={child.href}
                                      className="block py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
                          className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 relative group"
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{item.title}</span>
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoomeNavMobile;