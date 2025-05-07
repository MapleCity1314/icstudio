"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NewsFilterProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "technology", name: "技术" },
  { id: "projects", name: "项目" },
  { id: "company", name: "公司" },
  { id: "industry", name: "行业" },
]

export function NewsFilter({ activeFilter, setActiveFilter }: NewsFilterProps) {
  

  return (
    <div className="flex flex-wrap gap-2 mb-8">
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
    </div>
  )
}
