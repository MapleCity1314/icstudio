"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { motion, Variants, useAnimationControls } from "framer-motion"
import { beatriceDisplay } from "@/app/fonts"
import HeroBg from "@/components/bg/hero-bg"

// 调试模式开关
const DEBUG_MODE = false

// 动画变体定义
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    transition: { 
      duration: 0.5,
      ease: [0.33, 0, 0.67, 0]
    }
  }
}

// 内容元素动画变体
const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

// 字符动画变体
const charVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1],
      delay: custom * 0.05
    }
  })
}

// 左侧文本浮动动画变体
const leftFloatVariants: Variants = {
  initial: { opacity: 0, x: -10, y: -10 },
  animate: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  },
  float: {
    x: -15,
    y: -15,
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
}

// 右侧文本浮动动画变体
const rightFloatVariants: Variants = {
  initial: { opacity: 0, x: 10, y: 10 },
  animate: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  },
  float: {
    x: 15,
    y: 15,
    transition: {
      duration: 3.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      delay: 0.5
    }
  }
}

// 字符拆分组件
const AnimatedCharacters = ({ 
  text, 
  controls 
}: { 
  text: string, 
  controls: ReturnType<typeof useAnimationControls>
}) => {
  // 创建字符数组
  const chars = text.split("")
  
  return (
    <motion.div className="flex flex-wrap justify-center">
      {chars.map((char, index) => (
        <motion.span
          key={`char-${index}`}
          custom={index}
          variants={charVariants}
          initial="hidden"
          animate={controls}
          className={`inline-block ${char === " " ? "w-2" : ""}`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

export function HeroSection() {
  // 状态管理
  const [isLoaded, setIsLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [animationReady, setAnimationReady] = useState(false)
  const firstLoad = useRef(true)
  
  // 主题和路由
  const { theme } = useTheme()
  const pathname = usePathname()
  
  // 动画控制器
  const titleControls = useAnimationControls()
  const leftTextControls = useAnimationControls()
  const rightTextControls = useAnimationControls()
  const contentControls = useAnimationControls()
  
  // 添加强制重绘函数
  const forceRepaint = () => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight
      return height
    }
    return 0
  }

  // DOM引用
  const containerRef = useRef<HTMLDivElement>(null)

  // 解决水合问题
  useEffect(() => {
    setMounted(true)
    
    // 组件加载后强制重绘一次
    forceRepaint()
    
    // 设置一个短延迟后标记为已加载
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setAnimationReady(true)
      if (DEBUG_MODE) console.log("初始组件挂载设置")
    }, 10)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  // 内容加载动画
  useEffect(() => {
    if (isLoaded && animationReady) {
      // 先开始内容渐显
      contentControls.start("visible")
      
      // 重置并启动标题动画
      titleControls.set("hidden")
      titleControls.start("visible")
        .then(() => {
          // 标题动画完成后，启动左右文本动画
          leftTextControls.set("initial")
          rightTextControls.set("initial")
          
          leftTextControls.start("animate")
            .then(() => leftTextControls.start("float"))
          
          rightTextControls.start("animate")
            .then(() => rightTextControls.start("float"))
        })
    }
  }, [isLoaded, animationReady, titleControls, leftTextControls, rightTextControls, contentControls])

  // 路由变化时重置动画状态
  useEffect(() => {
    if (!firstLoad.current) {
      // 标记为未加载状态，触发CSS过渡动画
      setIsLoaded(false)
      setAnimationReady(false)
      
      // 强制一次重绘
      forceRepaint()
      
      // 重置动画控制器
      contentControls.set("hidden")
      titleControls.set("hidden")
      leftTextControls.set("initial")
      rightTextControls.set("initial")
      
      // 确保DOM有足够时间重置
      const timer = setTimeout(() => {
        setIsLoaded(true)
        setAnimationReady(true)
        
        // 启动动画序列
        contentControls.start("visible")
        titleControls.start("visible")
          .then(() => {
            leftTextControls.start("animate")
              .then(() => leftTextControls.start("float"))
            
            rightTextControls.start("animate")
              .then(() => rightTextControls.start("float"))
          })
          
        if (DEBUG_MODE) console.log("路由变化重设动画 - 路由:", pathname)
      }, 10) // 增加延迟，确保组件完全重置
      
      return () => clearTimeout(timer)
    } else {
      firstLoad.current = false
    }
  }, [pathname, titleControls, leftTextControls, rightTextControls, contentControls])

  // 如果组件未挂载，返回空内容
  if (!mounted) return null

  return (
    <HeroBg
      minRadius={200}
      maxRadius={300}
      speedFactor={1.8} 
      colors={['#836FFF', '#15F5BA', '#69F2FF']}
    >
      <motion.div
        id="hero" // 添加ID用于滚动指示器
        ref={containerRef}
        className="w-full h-full flex items-center justify-center transition-colors duration-300"
        variants={contentVariants}
        initial="hidden"
        animate={contentControls}
      >
        {/* 左侧文本 - 左上方位置 */}
        <motion.div
          className="absolute left-1/4 -translate-x-1/2 top-1/3 -translate-y-1/2"
          variants={leftFloatVariants}
          initial="initial"
          animate={leftTextControls}
        >
          <p
            className={`text-sm md:text-base uppercase tracking-widest border-b pb-1 ${
              theme === "dark" ? "text-white border-white" : "text-black border-black"
            }`}
            style={{ fontFamily: "var(--font-beatrice-display), sans-serif" }}
          >
            what we think
          </p>
        </motion.div>

        {/* 中央标题 */}
        <motion.div
          className="px-4"
          variants={fadeInVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-center ${
              theme === "dark" ? "text-white" : "text-black"
            } ${beatriceDisplay.className}`}
          >
            <AnimatedCharacters 
              text="Infinity Creators" 
              controls={titleControls}
            />
          </motion.h1>
        </motion.div>

        {/* 右侧文本 - 右下方位置 */}
        <motion.div
          className="absolute right-1/4 translate-x-1/2 bottom-1/3 translate-y-1/2"
          variants={rightFloatVariants}
          initial="initial"
          animate={rightTextControls}
        >
          <p
            className={`text-sm md:text-base uppercase tracking-widest border-b pb-1 ${
              theme === "dark" ? "text-white border-white" : "text-black border-black"
            }`}
            style={{ fontFamily: "var(--font-beatrice-display), sans-serif" }}
          >
            what we build
          </p>
        </motion.div>

        {/* 向下滚动指示器 */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === "dark" ? "text-white" : "text-black"}
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </HeroBg>
  )
}
