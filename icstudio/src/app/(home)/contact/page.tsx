"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useAnimation } from "framer-motion"
import ModeSelector from "./components/ModeSelector"
import ContactForm from "./components/ContactForm"
import { ensureDbConnection } from "@/lib/db/init-db"

type ContactMode = "collaborate" | "join" | "message"

// 组件定义
const ContactPage: React.FC = () => {
  // 主题和路由
  useTheme()
  const { setTheme } = useTheme()
  const pathname = usePathname()
  
  // 状态管理
  const [mode, setMode] = useState<ContactMode>("collaborate")
  const [animationReady, setAnimationReady] = useState(false)

  // 动画控制器
  const controls = useAnimation()
  
  // 路由变化时触发动画重置
  useEffect(() => {
    // 延迟短暂时间再设置动画就绪状态，确保DOM已更新
    const timer = setTimeout(() => {
      setAnimationReady(true)
      
      // 开始播放动画
      controls.start("visible")
    }, 100)
    
    return () => {
      clearTimeout(timer)
    }
  }, [pathname, controls])
  
  // 设置白色主题
  useEffect(() => {
    setTheme("light")
  }, [setTheme])

  // 初始化数据库连接
  useEffect(() => {
    const initDb = async () => {
      try {
        await ensureDbConnection()
      } catch (error) {
        console.error("初始化数据库连接失败:", error)
        // 不阻止页面渲染，useDB会处理错误状态
      }
    }
    initDb()
  }, [])

  return (
    <>
      {/* 第一页 - 模式选择 */}
      <div className="min-h-screen bg-white flex items-center text-black">
        <ModeSelector 
          mode={mode} 
          setMode={setMode} 
          controls={controls} 
        />
      </div>

      {/* 第二页 - 表单 */}
      {animationReady && <ContactForm mode={mode} />}
    </>
  )
}

export default ContactPage
