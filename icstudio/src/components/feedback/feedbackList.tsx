"use client";

import React, { useState, useEffect } from "react";
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list"; // 确保路径正确

// 定义反馈项的类型接口
interface FeedbackItem {
  _id: string;
  content: string;
  // 可以根据你的 Schema 添加其他字段，例如 createdAt
}

// 定义 API 响应的类型接口
interface ApiResponse {
  message: string;
  feedbacks: FeedbackItem[];
  error?: string; // 添加可选的 error 字段
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/about"); // 调用 GET API
        if (!response.ok) {
          // 尝试解析错误信息
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (parseError) {
            // 如果解析失败，使用通用错误
            console.error("Failed to parse error response:", parseError);
          }
          throw new Error(errorMsg);
        }
        const data: ApiResponse = await response.json();
        if (data.error) {
           throw new Error(data.error);
        }
        setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error("获取反馈列表失败:", err);
        setError(err instanceof Error ? err.message : "获取反馈列表时发生未知错误");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []); // 空依赖数组表示仅在组件挂载时运行

  if (isLoading) {
    return <div className="text-center p-4">正在加载反馈...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">加载反馈失败: {error}</div>;
  }

  if (feedbacks.length === 0) {
    return <div className="text-center p-4">暂无反馈信息。</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
       <h2 className="text-xl font-semibold mb-4 text-center">用户反馈列表</h2>
      <AnimatedList className="space-y-2">
        {feedbacks.map((feedback) => (
          <AnimatedListItem key={feedback._id}>
            <div className="p-3 border rounded-md shadow-sm bg-white dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-300">{feedback.content}</p>
              {/* 如果需要显示时间戳等其他信息，可以在这里添加 */}
              {/* <p className="text-xs text-gray-400 mt-1">{new Date(feedback.createdAt).toLocaleString()}</p> */}
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  );
};

export default FeedbackList;
