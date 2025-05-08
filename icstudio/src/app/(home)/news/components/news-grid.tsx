"use client"

import { Suspense, use, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NewsItem } from "@/types/news"
import gsap from "gsap"
import Image from "next/image"
import NewsCardLoading from "./news-card-loading"

interface NewsGridProps {
  news: NewsItem[]
  loading: boolean
}

export function NewsGrid({ news, loading }: NewsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const titleUnderlineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const LoadingNode = use(NewsCardLoading());

  // 设置refs数组以匹配新闻项目数量
  useEffect(() => {
    if (news.length > 0) {
      titleUnderlineRefs.current = Array(news.length).fill(null)
    }
  }, [news.length])

  // 设置动画
  useEffect(() => {
    if (loading || news.length === 0 || !gridRef.current) return

    const newsItems = gridRef.current.querySelectorAll(".news-card")

    gsap.fromTo(
      newsItems,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      },
    )

    // 设置标题下划线hover效果
    news.forEach((_, index) => {
      const newsCard = document.querySelector(`.news-card-${index}`)
      const titleUnderline = titleUnderlineRefs.current[index]

      if (newsCard && titleUnderline) {
        const hoverAnimation = gsap.to(titleUnderline, {
          width: "100%",
          duration: 0.3,
          ease: "power1.out",
          paused: true,
        })

        newsCard.addEventListener("mouseenter", () => hoverAnimation.play())
        newsCard.addEventListener("mouseleave", () => hoverAnimation.reverse())
      }
    })

    return () => {
      // 清理动画
    }
  }, [loading, news])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <Suspense>
          {LoadingNode}
        </Suspense>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/70 text-xl">暂无相关新闻</p>
      </div>
    )
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {news.map((item, index) => (
        <Link href={`/news/${item.slug}`} key={item.id} className={`group news-card news-card-${index}`}>
          <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full transition-all duration-300 hover:border-gray-700">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image || `/placeholder.svg?height=400&width=600&query=新闻图片`}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-black/50 text-white border-none">
                    {item.category || "新闻"}
                  </Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm text-white/60 mb-3 flex items-center">
                  <span>
                    {item.month} {item.day}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{item.readTime || "5分钟阅读"}</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-3 group-hover:text-white/90 transition-colors duration-300 relative">
                  {item.title}
                  <span
                    ref={(el) => {
                      titleUnderlineRefs.current[index] = el
                    }}
                    className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-white"
                  ></span>
                </h3>
                {item.excerpt && <p className="text-white/60 text-sm mb-4 flex-1">{item.excerpt}</p>}
                <div className="flex items-center text-white/70 text-sm mt-auto group-hover:text-white transition-colors duration-300">
                  <span>阅读更多</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardContent> 
          </Card>
        </Link>
      ))}
    </div>
  )
}
