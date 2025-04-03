"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import DesktopSidebar from "./sidebar/desktop-sidebar"
import MobileSidebar from "./sidebar/mobile-sidebar"
import Header from "./header/header"

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebarCollapsed")
    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed))
    }
  }, [])

  const toggleCollapsed = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newCollapsed))
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      ) : (
        <DesktopSidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapsed} />
      )}
      
      <div className={`flex flex-col ${isMobile ? "" : (isCollapsed ? "lg:ml-16" : "lg:ml-64")} transition-[margin] duration-300`}>
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          isMobile={isMobile}
        />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
