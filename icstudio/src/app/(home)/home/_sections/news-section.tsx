"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// 模拟新闻数据类型
interface NewsItem {
  id: string
  title: string
  date: string
  month: string
  day: string
  slug: string
  excerpt?: string
}

// 模拟数据
const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "HV MTL Forge Renderer",
    date: "MAR 28",
    month: "MAR",
    day: "28",
    slug: "hv-mtl-forge-renderer",
    excerpt: "使用Metal API开发的高性能渲染引擎，为创意项目提供卓越的视觉效果",
  },
  {
    id: "2",
    title: "The making of InsideKristallnacht",
    date: "NOV 16",
    month: "NOV",
    day: "16",
    slug: "the-making-of-insidekristallnacht",
    excerpt: "深入探讨我们最新沉浸式历史体验项目的开发过程和技术挑战",
  },
  {
    id: "3",
    title: "The making of Allô Papa Noël",
    date: "DEC 10",
    month: "DEC",
    day: "10",
    slug: "the-making-of-allo-papa-noel",
    excerpt: "圣诞节互动体验项目背后的创意与技术实现",
  },
  {
    id: "4",
    title: "WebGPU: 下一代网页图形技术",
    date: "JAN 15",
    month: "JAN",
    day: "15",
    slug: "webgpu-next-gen-web-graphics",
    excerpt: "探索WebGPU如何改变网页3D图形和计算的未来",
  },
]

// 预留的fetch函数，用于从API获取真实数据
async function fetchNewsData(): Promise<NewsItem[]> {
  // 在这里实现实际的API调用
  // const response = await fetch('/api/news');
  // const data = await response.json();
  // return data;

  // 现在返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_NEWS), 500)
  })
}

// Update the component styling and layout for a more high-end look
export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const newsItemsRef = useRef<HTMLDivElement>(null)
  const titleUnderlineRefs = useRef<(HTMLSpanElement | null)[]>([])
  
  // 存储动画实例以便清理
  const animations = useRef<gsap.core.Tween[]>([])
  const scrollTriggers = useRef<ScrollTrigger[]>([])
  
  // 组件是否已卸载的标记
  const isMounted = useRef(true)

  // 设置refs数组以匹配新闻项目数量
  useEffect(() => {
    if (news.length > 0) {
      titleUnderlineRefs.current = Array(news.length).fill(null)
    }
  }, [news.length])

  // Keep the data fetching logic
  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true)
        const data = await fetchNewsData()
        if (isMounted.current) {
          setNews(data)
        }
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    getNews()
  }, [])

  // 设置标题下划线hover效果 - 优化事件监听逻辑
  useEffect(() => {
    if (news.length === 0) return
    
    const hoverAnimations: gsap.core.Tween[] = []
    const newsItems: (Element | null)[] = []
    
    // 为每个新闻项目设置hover效果
    news.forEach((_, index) => {
      const newsItem = document.querySelector(`.news-item-${index}`)
      const titleUnderline = titleUnderlineRefs.current[index]
      
      if (newsItem && titleUnderline) {
        newsItems.push(newsItem)
        
        // 创建hover动画但不立即播放
        const hoverAnimation = gsap.to(titleUnderline, {
          width: "100%",
          duration: 0.3,
          ease: "power1.out",
          paused: true
        })
        
        hoverAnimations.push(hoverAnimation)
        
        // 使用函数引用以便于移除
        const handleMouseEnter = () => hoverAnimation.play()
        const handleMouseLeave = () => hoverAnimation.reverse()
        
        // 鼠标进入时播放动画
        newsItem.addEventListener("mouseenter", handleMouseEnter)
        
        // 鼠标离开时反向播放
        newsItem.addEventListener("mouseleave", handleMouseLeave)
        
        // 存储清理函数
        return () => {
          newsItem.removeEventListener("mouseenter", handleMouseEnter)
          newsItem.removeEventListener("mouseleave", handleMouseLeave)
          hoverAnimation.kill()
        }
      }
    })
    
    // 保存动画实例以便清理
    animations.current = [...animations.current, ...hoverAnimations]
    
    return () => {
      // 清理所有动画实例
      hoverAnimations.forEach(animation => animation.kill())
    }
  }, [news])

  // Enhanced animations - 优化性能和清理逻辑
  useEffect(() => {
    if (!news.length || !titleRef.current || !newsItemsRef.current) return
    
    // Title animation with more subtle effect
    const titleAnim = gsap.fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none none", // 只执行一次
        },
      }
    )
    
    // 保存ScrollTrigger实例
    if (titleAnim.scrollTrigger) {
      scrollTriggers.current.push(titleAnim.scrollTrigger)
    }

    // News items with staggered reveal (替代CSS的fadeUp动画)
    if (newsItemsRef.current) {
      const newsItems = newsItemsRef.current.querySelectorAll(".news-item")
      const newsItemsAnim = gsap.fromTo(
        newsItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: newsItemsRef.current,
            start: "top 80%",
            toggleActions: "play none none none", // 只执行一次
          },
        }
      )
      
      // 保存ScrollTrigger实例
      if (newsItemsAnim.scrollTrigger) {
        scrollTriggers.current.push(newsItemsAnim.scrollTrigger)
      }
    }

    return () => {
      // 清理ScrollTrigger实例
      scrollTriggers.current.forEach(trigger => {
        trigger.kill()
      })
      scrollTriggers.current = []
      
      // 清理其他动画
      animations.current.forEach(animation => {
        animation.kill()
      })
      animations.current = []
    }
  }, [news])
  
  // 组件卸载时清理所有资源
  useEffect(() => {
    return () => {
      isMounted.current = false
      
      // 清理所有ScrollTrigger实例
      scrollTriggers.current.forEach(trigger => {
        trigger.kill()
      })
      
      // 清理所有动画
      animations.current.forEach(animation => {
        animation.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative py-32 md:py-40 w-full bg-[#0a0a0a] text-white news-section"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="container mx-auto max-w-6xl px-6">
        {/* Section header with more sophisticated styling */}
        <div className="flex items-center mb-24">
          <div className="h-px flex-grow bg-white/10"></div>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-light px-6 tracking-wider text-white uppercase">
            Latest News
          </h2>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        {/* Enhanced loader */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div ref={newsItemsRef} className="grid gap-20 md:gap-32">
            {news.map((item, index) => (
              <div key={item.id} className={`news-item news-item-${index} group`}>
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  {/* Date display with more elegant styling */}
                  <div className="md:w-24 text-center md:text-left">
                    <div className="inline-flex flex-col items-center md:items-start">
                      <span className="text-xs font-light tracking-widest text-white/60">{item.month}</span>
                      <span className="text-2xl font-medium">{item.day}</span>
                    </div>
                  </div>

                  {/* Content with hover effects */}
                  <div className="flex-1">
                    <Link href={`/news/${item.slug}`} className="block group-hover:opacity-100">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-3 transition-all duration-300 group-hover:text-white text-white/90 relative">
                        {item.title}
                        <span 
                          ref={(el) => {
                            titleUnderlineRefs.current[index] = el
                          }}
                          className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-white"
                        ></span>
                      </h3>
                      {item.excerpt && (
                        <p className="text-white/60 text-lg md:text-xl font-light mt-3 max-w-3xl">{item.excerpt}</p>
                      )}
                    </Link>
                  </div>

                  {/* Arrow indicator */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Separator line */}
                <div className="h-px w-full bg-white/10 mt-12"></div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced footer with more elegant styling */}
        <div className="mt-32 text-center">
          <Link
            href="/news"
            className="inline-flex items-center text-lg tracking-wider uppercase font-light hover:text-white text-white/80 transition-all duration-300 group border-b border-white/20 pb-2"
          >
            <span>View All Articles</span>
            <ArrowRight className="ml-3 h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}
