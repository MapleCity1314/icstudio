"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Suspense, use, useState } from "react"
import { fetchCategories } from "./news-actions"

interface NewsFilterProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

/**
 * @description 新闻页面选择器
 */


//分类目录主要组件
function Categories({ activeFilter, setActiveFilter }: NewsFilterProps){
  const CATEGORIES = use(fetchCategories())

  return (
    <Suspense fallback={<div>loading...</div>}>
      {CATEGORIES.map((category) => (
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
    </Suspense>
  )
}

export function NewsFilter() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Categories activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  )
}
