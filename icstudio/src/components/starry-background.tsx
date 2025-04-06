"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Star {
  x: number
  y: number
  size: number
  speed: number
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置canvas尺寸为全屏
    const resizeCanvas = () => {
      // 使用 window.innerWidth 和 window.innerHeight 确保覆盖整个视口
      canvas.width = window.innerWidth + 20 // 添加额外宽度确保覆盖
      canvas.height = window.innerHeight + 20 // 添加额外高度确保覆盖
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 生成随机星星
    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.1, // 确保星星至少有一些大小
      speed: Math.random() * 0.5 + 0.1,
    }))

    // 动画循环
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 根据主题设置星星颜色
      ctx.fillStyle = "#ffffff" // 总是使用白色星星，更符合夜空效果
      ctx.globalAlpha = 0.8

      // 更新和绘制星星
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // 移动星星
        star.y = (star.y + star.speed) % canvas.height
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{ 
        zIndex: -1,  // 确保在内容之下
        position: "absolute", // 使用absolute定位
        top: "-10px", // 延伸超出容器确保完全覆盖
        left: "-10px", // 延伸超出容器确保完全覆盖
        width: "calc(100% + 20px)", // 宽度多10px确保覆盖
        height: "calc(100% + 20px)", // 高度多10px确保覆盖
        background: "linear-gradient(to bottom, #0f172a, #1e1b4b)" // 深色渐变背景
      }}
    />
  )
}