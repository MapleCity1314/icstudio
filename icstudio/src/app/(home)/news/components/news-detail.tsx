"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Share2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { NewsItem } from "@/types/news"
import { fetchRelatedNews } from "@/lib/news/news-service"
import gsap from "gsap"
import Image from "next/image"

interface NewsDetailProps {
  news: NewsItem
}

/**
 * 新闻详情页
 * @param news 新闻数据
 * @description 负责展示新闻详情
 * @returns 
 */

export function NewsDetail({ news }: NewsDetailProps) {
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const getRelatedNews = async () => {
      const data = await fetchRelatedNews(news.id, 3)
      setRelatedNews(data)
    }

    getRelatedNews()
  }, [news.id])

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .fromTo(imageRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4",
      )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative w-full bg-[#0a0a0a] py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl px-6 relative z-10">
          <div className="mb-8">
            <Link href="/news">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回新闻列表
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="text-white/70 border-white/20">
                {news.category || "新闻"}
              </Badge>
            </div>
            <h1 ref={titleRef} className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">
              {news.title}
            </h1>
            <div className="flex items-center justify-center text-white/60 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  {news.month} {news.day}
                </span>
              </div>
              <Separator orientation="vertical" className="mx-3 h-4 bg-white/20" />
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{news.readTime || "5分钟阅读"}</span>
              </div>
            </div>
          </div>

          <div className="mb-12 overflow-hidden rounded-lg">
            <Image
              ref={imageRef}
              src={news.image || `/placeholder.svg?height=600&width=1200&query=${news.title}`}
              alt={news.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          <div ref={contentRef} className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-white/80 leading-relaxed">{news.excerpt}</p>
            <p className="text-white/70 leading-relaxed">
              {news.content ||
                `这是关于${news.title}的详细内容。在实际应用中，这里会显示完整的文章内容，包括段落、图片、引用等富文本元素。`}
            </p>
            <p className="text-white/70 leading-relaxed">
              我们的团队一直致力于探索最前沿的技术，并将其应用到实际项目中。通过不断创新和实践，我们希望能够为用户带来更加丰富和沉浸式的体验。未来，我们将继续在这一领域深耕，推动技术与创意的融合发展。
            </p>
          </div>

          <div className="mt-12 flex justify-between items-center">
            <div className="text-white/70">分享这篇文章:</div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 text-white/70 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 相关文章 */}
      <div className="bg-gray-950 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-light text-white mb-12 text-center">相关文章</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedNews.map((item) => (
              <Link href={`/news/${item.slug}`} key={item.id} className="group">
                <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full transition-all duration-300 hover:border-gray-700">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || `/placeholder.svg?height=400&width=600&query=${item.title}`}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-sm text-white/60 mb-3">
                        {item.month} {item.day}
                      </div>
                      <h3 className="text-xl font-medium text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                        {item.title}
                      </h3>
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
        </div>
      </div>
    </div>
  )
}
