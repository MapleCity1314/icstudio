"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WavyBackground } from "@/components/ui/wavy-background"
import React from "react"

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const ContactSection = React.memo(() => {
  const [mounted, setMounted] = useState(false)
  
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  
  // 存储ScrollTrigger实例，用于清理
  const scrollTriggers = useRef<ScrollTrigger[]>([])
  // 动画实例引用
  const animations = useRef<gsap.core.Tween[]>([])
  // 组件挂载状态标记
  const isMounted = useRef(true)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
    
    return () => {
      isMounted.current = false
    }
  }, [])

  // Animations
  useEffect(() => {
    if (!mounted || !sectionRef.current) return

    // Title animation
    if (titleRef.current) {
      const titleTrigger = ScrollTrigger.create({
        trigger: titleRef.current,
        start: "top 80%",
        toggleActions: "play none none none" // 只执行一次
      })
      
      const titleAnim = gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: titleTrigger
        }
      )
      
      scrollTriggers.current.push(titleTrigger)
      animations.current.push(titleAnim)
    }

    // Button animation
    if (buttonRef.current) {
      const buttonTrigger = ScrollTrigger.create({
        trigger: buttonRef.current,
        start: "top 90%",
        toggleActions: "play none none none" // 只执行一次
      })
      
      const buttonAnim = gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: buttonTrigger
        }
      )
      
      scrollTriggers.current.push(buttonTrigger)
      animations.current.push(buttonAnim)
    }

    return () => {
      // 清理所有ScrollTrigger实例
      scrollTriggers.current.forEach(trigger => {
        if (trigger) trigger.kill()
      })
      scrollTriggers.current = []
      
      // 清理动画实例
      animations.current.forEach(anim => {
        if (anim) anim.kill()
      })
      animations.current = []
      
      // 刷新其余的ScrollTrigger
      ScrollTrigger.refresh()
    }
  }, [mounted])

  // 定义背景颜色
  const wavyColors = ["#1a1a2e", "#16213e", "#0f3460", "#292c6d", "#2f4858"]

  if(!mounted) return null;

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen w-full overflow-hidden">
      <WavyBackground
        colors={wavyColors}
        waveWidth={100}
        backgroundFill="black"
        blur={10}
        speed="slow"
        waveOpacity={0.3}
        containerClassName="absolute inset-0"
        className="w-full h-full max-w-6xl mx-auto pb-40"
      >
        <div className="container mx-auto px-4 py-36 relative z-10 flex flex-col items-center justify-center h-full">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              ref={titleRef}
              className="text-6xl md:text-8xl font-bold mb-20 tracking-tight text-white"
            >
              联系我们
            </h2>

            <div ref={buttonRef} className="pt-10 inline-block">
              <Button
                className="py-8 px-12 text-lg tracking-wider uppercase transition-all duration-300 group bg-white text-black hover:bg-white/90 border-0"
                asChild
              >
                <Link href="/contact">
                  <span className="flex items-center">
                    进入联系页面 <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  )
})

ContactSection.displayName = "ContactSection"

export default ContactSection;
