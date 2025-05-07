"use client"

import type React from "react"
import { Timeline } from "@/components/ui/timeline"
import { useState, useEffect } from "react"
import { fetchTimelineItems, TimelineItem } from "./action"


const TimelineSection = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 客户端获取时间线数据
    const items = fetchTimelineItems()
    setTimelineItems(items)
    setLoading(false)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div>加载中...</div>
      ) : (
        <Timeline data={timelineItems} />
      )}
    </div>
  )
}

export default TimelineSection
