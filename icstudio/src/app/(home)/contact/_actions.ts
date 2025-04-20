'use server'

import { dbFactory } from '@/lib/db/db-factory'
import { 
  FEEDBACK_MODEL_NAME, 
  feedbackSchema, 
  FeedbackStatus, 
  IFeedback
} from '@/lib/db/schema/feedback'
import { ensureDbConnection } from '@/lib/db/init-db'
import { FilterQuery } from 'mongoose'

// 注册Schema
dbFactory.registerSchema(FEEDBACK_MODEL_NAME, feedbackSchema)

// API响应接口
interface ApiResponse {
  success: boolean
  message: string
  data?: unknown
}

// 分页选项接口
interface PaginationOptions {
  page: number
  limit: number
}

/**
 * 获取反馈列表 - 用于管理界面
 * @param filters 过滤条件
 * @param paginationOptions 分页选项
 * @returns 反馈列表和分页信息
 */
export async function getFeedbackList(
  filters: { type?: string; status?: string; search?: string } = {},
  paginationOptions: PaginationOptions = { page: 1, limit: 10 }
): Promise<ApiResponse> {
  try {
    // 确保数据库已连接
    await ensureDbConnection();
    
    // 构建查询条件
    const filter: FilterQuery<IFeedback> = {}
    if (filters.type) filter.type = filters.type
    if (filters.status) filter.status = filters.status
    if (filters.search) {
      filter.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { message: { $regex: filters.search, $options: 'i' } }
      ]
    }
    
    // 获取服务
    const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME)
    
    // 分页查询
    const result = await feedbackService.findWithPagination(
      filter, 
      { 
        page: paginationOptions.page, 
        limit: paginationOptions.limit 
      }, 
      {}
    )
    
    if (!result.success) {
      return {
        success: false,
        message: result.message || '获取反馈列表失败'
      }
    }
    
    return {
      success: true,
      message: '获取反馈列表成功',
      data: result.data
    }
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
}

/**
 * 删除反馈 - 用于管理界面
 * @param id 反馈ID
 * @returns 操作结果
 */
export async function deleteFeedback(id: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/feedback/${id}`, {
      method: 'DELETE',
    });
    
    return await response.json();
  } catch (error) {
    console.error('删除反馈失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
}

/**
 * 更新反馈状态 - 用于管理界面
 * @param id 反馈ID
 * @param status 新状态
 * @returns 操作结果
 */
export async function updateFeedbackStatus(
  id: string, 
  status: FeedbackStatus
): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/feedback/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('更新反馈失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
} 