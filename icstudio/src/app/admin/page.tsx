"use client"

import FeedbackList from "@/components/feedback/feedbackList"


export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">管理仪表盘</h1>
      {/* 这里放置仪表盘内容 */}
      <FeedbackList />
    </div>
  )
}
