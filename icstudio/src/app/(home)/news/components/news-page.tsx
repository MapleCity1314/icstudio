"use client"

import { useEffect, useState } from "react"
import { NewsHero } from "./news-hero"
import { NewsGrid } from "./news-grid"
import { NewsFilter } from "./news-filter"
import { NewsPagination } from "./news-pagination"
import type { NewsItem } from "@/types/news"
import { fetchNewsList } from "./news-actions"

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const itemsPerPage = 6

  // 获取新闻数据
  const fetchNews = async () => {
    try {
      setLoading(true)
      const data = await fetchNewsList({
        page: 1,
        limit: 100, // 获取足够多的数据用于前端过滤
        category: "all"
      })
      setNews(data)
      setFilteredNews(data)
    } catch (error) {
      console.error("获取新闻失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载数据
  useEffect(() => {
    fetchNews()
  }, [])

  // 过滤处理
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredNews(news)
    } else {
      setFilteredNews(news.filter((item) => item.category === activeFilter))
    }
    setCurrentPage(1)
  }, [activeFilter, news])

  // 计算当前页面显示的新闻
  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // 计算总页数
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <NewsHero />
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <NewsFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <NewsGrid news={currentNews} loading={loading} />
        {!loading && filteredNews.length > itemsPerPage && (
          <NewsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  )
}
