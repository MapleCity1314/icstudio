'use server'

import { revalidatePath } from 'next/cache'

// 反馈数据接口
export interface FeedbackData {
  name: string
  email: string
  message: string
  mode: "collaborate" | "join" | "message"
  address?: string
  company?: string
  phone?: string
  portfolio?: string
}

// 获取API基础URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return ''
  }
  // 服务器环境
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return `http://localhost:${process.env.PORT || 3000}`
}

// 提交反馈
export async function submitFeedback(data: FeedbackData) {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '提交失败')
    }

    // 重新验证页面
    revalidatePath('/contact')
    
    return {
      success: true,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '提交失败，请稍后重试'
    }
  }
}

// 获取反馈列表
export async function getFeedbackList(params: {
  page?: number
  limit?: number
  status?: string
}) {
  try {
    const baseUrl = getBaseUrl()
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.status) searchParams.set('status', params.status)

    const response = await fetch(`${baseUrl}/api/feedback?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '获取失败')
    }

    return {
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit
    }
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取失败，请稍后重试'
    }
  }
}
