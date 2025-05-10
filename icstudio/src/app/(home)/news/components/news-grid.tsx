"use client"

import { useEffect, useRef } from "react"
import NewsCard from "./news-card"
import NewsCardLoading from "./news-card-loading"
import type { NewsItem } from "@/types/news"
import gsap from "gsap"

interface NewsGridProps {
  news: NewsItem[]
  loading: boolean
}

export function NewsGrid({ news, loading }: NewsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  // 设置动画
  useEffect(() => {
    if (loading || news.length === 0 || !gridRef.current) return

    const newsItems = gridRef.current.querySelectorAll(".news-card")
    const underlines = gridRef.current.querySelectorAll(".news-card-underline")

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
    newsItems.forEach((card, index) => {
      const underline = underlines[index]
      if (card && underline) {
        const hoverAnimation = gsap.to(underline, {
          width: "100%",
          duration: 0.3,
          ease: "power1.out",
          paused: true,
        })

        card.addEventListener("mouseenter", () => hoverAnimation.play())
        card.addEventListener("mouseleave", () => hoverAnimation.reverse())
      }
    })

    return () => {
      // 清理动画
      gsap.killTweensOf(newsItems)
      gsap.killTweensOf(underlines)
    }
  }, [loading, news])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <NewsCardLoading />
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
        <NewsCard key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}
