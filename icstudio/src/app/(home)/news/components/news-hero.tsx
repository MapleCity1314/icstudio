"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// 确保GSAP插件只注册一次
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function NewsHero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }).fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6",
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={heroRef} className="relative w-full bg-[#0a0a0a] py-32 md:py-40 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-900/20 to-blue-900/20 blur-[120px] -top-[250px] -right-[100px]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-red-900/20 to-orange-900/20 blur-[100px] -bottom-[200px] -left-[100px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <div className="text-center">
          <h1 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6">
            新闻与动态
          </h1>
          <p ref={subtitleRef} className="text-xl md:text-2xl font-light text-white/70 max-w-3xl mx-auto">
            了解IC Studio的最新项目、技术突破和行业见解
          </p>
        </div>
      </div>
    </div>
  )
}
