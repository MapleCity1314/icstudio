"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function NewsPagination({ currentPage, totalPages, onPageChange }: NewsPaginationProps) {
  // 生成页码数组
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // 否则，显示当前页附近的页码
      let startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

      // 调整起始页和结束页
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // 添加省略号
      if (startPage > 1) {
        pageNumbers.unshift("...")
        pageNumbers.unshift(1)
      }

      if (endPage < totalPages) {
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="flex justify-center items-center mt-16">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-gray-800 bg-gray-900 text-white/70 hover:text-white hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page)}
              className={cn(
                "border-gray-800 bg-gray-900 text-white/70 hover:text-white hover:bg-gray-800 min-w-[40px]",
                currentPage === page && "bg-white text-black hover:bg-white/90 hover:text-black",
              )}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="text-white/50">
              {page}
            </span>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-gray-800 bg-gray-900 text-white/70 hover:text-white hover:bg-gray-800"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
