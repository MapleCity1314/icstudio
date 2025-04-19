"use client"

import { useEffect, useState } from "react"
import CreativeSection from "./_sections/creative-section";
import { HeroSection } from "./_sections/hero-section";
import { CurvedNavigation } from "./_components/navigation";
import { ProjectsSection } from "./_sections/projects-section";
import { NewsSection } from "./_sections/news-section";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import ContactSection from "./_sections/contact-section";
import { useTheme } from "next-themes";

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
}

const Page = () => {

      const { setTheme } = useTheme()
      const [mounted, setMounted] = useState(false)
      // 设置滚动平滑并刷新ScrollTrigger
      useEffect(() => {
            // 优化滚动性能
            const scrollSmoother = {
                  current: null as unknown as gsap.core.Tween | null
            }
            
            // 设置ScrollTrigger默认配置
            ScrollTrigger.config({
                  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
                  ignoreMobileResize: true,
            })
            
            // 刷新所有ScrollTrigger实例
            ScrollTrigger.refresh()
            
            return () => {
                  // 清理所有ScrollTrigger实例
                  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
                  
                  // 清理滚动平滑
                  if (scrollSmoother.current) {
                        scrollSmoother.current.kill()
                  }
            }
      }, [])

      useEffect(() => {
            setTheme("dark")
            setMounted(true)
      }, [setTheme,mounted])

      if(!mounted) return null
      
      return (
            <main className="relative">
                  <CurvedNavigation />
                  <HeroSection />
                  <CreativeSection />
                  <ProjectsSection />
                  <NewsSection />
                  {/* 添加其他部分的占位符，以便导航可以正常工作 */}
                  <ContactSection />
            </main>
      );
};

export default Page;
