"use client"

import { useState } from "react"
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
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      ) : (
        <DesktopSidebar />
      )}
      
      <div className="flex flex-col lg:ml-64">
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
