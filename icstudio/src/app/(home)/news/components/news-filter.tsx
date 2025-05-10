"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { fetchCategories } from "./news-actions"

interface NewsFilterProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

/**
 * @description 新闻页面选择器
 */

// 分类目录主要组件
function Categories({ activeFilter, setActiveFilter }: NewsFilterProps) {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true)
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error('获取分类失败:', error)
      } finally {
        setLoading(false)
      }
    }

    getCategories()
  }, [])

  if (loading) {
    return <div className="flex gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-9 w-16 bg-gray-800 rounded-md animate-pulse"></div>
      ))}
    </div>
  }

  return (
    <>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          size="sm"
          onClick={() => setActiveFilter(category.id)}
          className={cn(
            "border-gray-800 bg-gray-900 text-white/70 hover:text-white hover:bg-gray-800",
            activeFilter === category.id && "bg-white hover:bg-white/90 hover:text-black",
          )}
        >
          {category.name}
        </Button>
      ))}
    </>
  )
}

export function NewsFilter({ activeFilter, setActiveFilter }: NewsFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Categories activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  )
}
