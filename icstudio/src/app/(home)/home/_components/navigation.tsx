"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Home, Lightbulb, Flag, Info, Mail } from "lucide-react"

// 调试模式开关
const DEBUG_MODE = false

// 定义页面各部分及其图标
const sections = [
  { id: "hero", name: "首页", icon: Home },
  { id: "creative", name: "创意", icon: Lightbulb },
  { id: "projects", name: "项目", icon: Flag },
  { id: "news", name: "关于", icon: Info },
  { id: "contact", name: "联系", icon: Mail },
]

export function CurvedNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isNearFooter, setIsNearFooter] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout>(null)

  // 解决水合问题
  useEffect(() => {
    setMounted(true)
  }, [])

  // 检测是否为移动设备
  useEffect(() => {
    if (!mounted) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [mounted])

  // 设置滚动监听
  useEffect(() => {
    if (!mounted) return;

    // 处理滚动事件
    const handleScroll = () => {
      // 清除之前的定时器
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // 设置新的定时器
      scrollTimeout.current = setTimeout(() => {
        const currentScrollY = window.scrollY
        const windowHeight = window.innerHeight
        lastScrollY.current = currentScrollY

        // 检查是否在首页
        const heroSection = document.getElementById("hero")
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect()
          const isInHero = heroRect.bottom > windowHeight * 0.7
          setIsVisible(!isInHero)
        }
        
        // 检查是否靠近页脚
        const footer = document.querySelector('footer')
        if (footer) {
          const footerRect = footer.getBoundingClientRect()
          const isNearingFooter = footerRect.top < windowHeight + 100
          setIsNearFooter(isNearingFooter)
        }

        // 计算当前活动部分
        let currentActiveIndex = 0
        let minDistance = Infinity

        sections.forEach((section, index) => {
          const element = document.getElementById(section.id)
          if (element) {
            const rect = element.getBoundingClientRect()
            const sectionMiddle = rect.top + rect.height / 2
            const viewportMiddle = windowHeight / 2
            const distance = Math.abs(sectionMiddle - viewportMiddle)

            if (distance < minDistance) {
              minDistance = distance
              currentActiveIndex = index
            }
          }
        })

        setActiveIndex(currentActiveIndex)
      }, 100) // 100ms 的防抖
    }

    // 注册GSAP插件
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
      
      // 添加滚动监听
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // 初始化滚动位置
      handleScroll()

      // 导航入场动画
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.5,
          }
        )
      }

      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current)
        }
      }
    }
  }, [mounted])

  // 滚动到指定部分
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      if (DEBUG_MODE) console.log(`滚动到${id}部分`)
      
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // 如果组件未挂载，返回null
  if (!mounted) return null
  
  // 如果是移动设备或在首页，不显示导航
  if (isMobile || !isVisible) return null

  return (
    <div
      ref={navRef}
      className={`fixed right-8 z-40 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
      } ${
        isNearFooter 
          ? "bottom-[200px]" 
          : "top-1/2 -translate-y-1/2"
      }`}
      style={{
        transform: isNearFooter ? "translateX(0)" : "",
        transition: "all 0.5s ease",
      }}
    >
      <div className="relative">
        {/* 导航项容器 */}
        <div ref={itemsRef} className="relative">
          {sections.map((section, index) => {
            const isActive = index === activeIndex
            const Icon = section.icon

            // 计算曲线位置
            const distanceFromActive = index - activeIndex
            const curveX = Math.pow(distanceFromActive, 2) * 8

            return (
              <div
                key={index}
                className={`flex items-center mb-12 transition-all duration-300 ${
                  isActive ? "opacity-100 scale-110" : "opacity-50 hover:opacity-80"
                }`}
                style={{
                  transform: `translateX(${curveX}px)`,
                  transition: "all 0.5s ease-out",
                }}
              >
                {isActive ? (
                  <div className="flex items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        theme === "dark" ? "bg-white/10" : "bg-black/10"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      theme === "dark" ? "border border-white/30 hover:bg-white/5" : "border border-black/30 hover:bg-black/5"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* 指示器线 */}
        <div
          className={`absolute right-6 top-0 h-full w-px ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`}
          style={{ height: sections.length * 48 + 20 }}
        ></div>
      </div>
    </div>
  )
}
