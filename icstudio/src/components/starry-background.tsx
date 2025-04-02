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
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 生成随机星星
    const stars: Star[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.1,
    }))

    // 动画循环
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 根据主题设置星星颜色
      ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000"
      ctx.globalAlpha = theme === "dark" ? 0.8 : 0.5

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
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: "none" }}
    />
  )
}