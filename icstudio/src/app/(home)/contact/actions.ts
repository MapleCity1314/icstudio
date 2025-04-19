'use server'

import { cookies } from 'next/headers'
import { dbFactory } from '@/lib/db/db-factory'
import { 
  FEEDBACK_MODEL_NAME, 
  feedbackSchema, 
  FeedbackType, 
  FeedbackStatus, 
  IFeedback,
  IJoinFeedback,
  ICollaborateFeedback,
  IMessageFeedback
} from '@/lib/db/schema/feedback'

// 注册Schema
dbFactory.registerSchema(FEEDBACK_MODEL_NAME, feedbackSchema)

// 表单数据接口
interface FormData {
  name: string
  email: string
  message: string
  address?: string  
  company?: string  
  phone?: string    
  portfolio?: string 
  mode: 'collaborate' | 'join' | 'message'
}

// API响应接口
interface ApiResponse {
  success: boolean
  message: string
  remaining?: number
}

/**
 * 检查并更新提交次数限制
 * @returns {Promise<{ canSubmit: boolean, remaining: number }>}
 */
async function checkSubmitLimit(): Promise<{ canSubmit: boolean, remaining: number }> {
  const cookieStore = await cookies()
  const today = new Date().toISOString().split('T')[0] // 获取当前日期，格式：YYYY-MM-DD
  
  // 获取当前日期的提交记录
  const submissionRecord = cookieStore.get(`contact_submissions_${today}`)
  
  // 如果没有当天的记录，则创建新记录
  const submissions = submissionRecord ? parseInt(submissionRecord.value) : 0

  // 检查是否超过每日限制
  const maxSubmissionsPerDay = 3
  const remaining = Math.max(0, maxSubmissionsPerDay - submissions)
  const canSubmit = submissions < maxSubmissionsPerDay

  return { canSubmit, remaining }
}

/**
 * 更新提交计数
 */
async function updateSubmitCount(): Promise<void> {
  const cookieStore = await cookies()
  const today = new Date().toISOString().split('T')[0]
  
  // 获取当前日期的提交记录
  const submissionRecord = cookieStore.get(`contact_submissions_${today}`)
  const submissions = submissionRecord ? parseInt(submissionRecord.value) : 0
  
  // 更新提交次数
  const newCount = submissions + 1
  
  // 更新Cookie，设置一天有效期
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  cookieStore.set({
    name: `contact_submissions_${today}`,
    value: newCount.toString(),
    expires: tomorrow,
    path: '/',
  })
}

/**
 * 将表单数据转换为数据库数据
 */
function mapFormDataToDbData(data: FormData): Partial<IFeedback> {
  // 映射模式到枚举
  const typeMap: Record<FormData['mode'], FeedbackType> = {
    'join': FeedbackType.JOIN,
    'collaborate': FeedbackType.COLLABORATE,
    'message': FeedbackType.MESSAGE
  }

  // 基础字段，所有类型共用
  const baseData = {
    name: data.name,
    email: data.email,
    message: data.message,
    type: typeMap[data.mode],
    status: FeedbackStatus.PENDING
  };
  
  // 根据不同模式返回不同类型的数据
  if (data.mode === 'join') {
    // 加入团队模式
    return {
      ...baseData,
      type: FeedbackType.JOIN,
      phone: data.phone || '', // 必填字段
      portfolio: data.portfolio // 可选字段
    } as Partial<IJoinFeedback>;
  } else if (data.mode === 'collaborate') {
    // 合作模式
    return {
      ...baseData,
      type: FeedbackType.COLLABORATE,
      company: data.company,
      address: data.address
    } as Partial<ICollaborateFeedback>;
  } else {
    // 普通消息模式
    return {
      ...baseData,
      type: FeedbackType.MESSAGE,
      _messageType: 'simple'
    } as Partial<IMessageFeedback>;
  }
}

/**
 * 处理联系表单提交
 * @param {FormData} data - 表单数据
 * @returns {Promise<ApiResponse>} 表单处理响应
 */
export async function submitContactForm(data: FormData): Promise<ApiResponse> {
  try {
    // 检查提交限制
    const { canSubmit, remaining } = await checkSubmitLimit()
    
    // 如果是空表单（用于检查剩余次数），则直接返回
    if (!data.name && !data.email && !data.message) {
      return {
        success: false,
        message: '表单验证失败',
        remaining
      }
    }
    
    if (!canSubmit) {
      return {
        success: false,
        message: '您今天的提交次数已达上限，请明天再试',
        remaining: 0
      }
    }
    
    // 验证必填字段
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: '请填写所有必填字段',
        remaining
      }
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: '请输入有效的邮箱地址',
        remaining
      }
    }

    // 模式特定验证
    if (data.mode === 'join' && !data.phone) {
      return {
        success: false,
        message: '加入团队需要提供电话号码',
        remaining
      }
    }

    // 实际的表单提交逻辑
    try {
      // 获取反馈服务
      const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME)
      
      // 转换数据
      const dbData = mapFormDataToDbData(data)
      
      // 保存到数据库
      const result = await feedbackService.create(dbData)
      
      if (!result.success) {
        throw new Error(result.message || '保存反馈失败')
      }
      
      // 模拟API处理延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 成功后更新提交计数
      await updateSubmitCount()
      
      // 计算剩余提交次数
      const updatedRemaining = remaining - 1
      
      return {
        success: true,
        message: '表单提交成功',
        remaining: updatedRemaining
      }
    } catch (submitError) {
      console.error('API提交错误:', submitError)
      return {
        success: false,
        message: submitError instanceof Error ? submitError.message : '表单提交失败',
        remaining
      }
    }
  } catch (error) {
    console.error('表单提交错误:', error)
    // 确保在任何情况下都返回剩余次数
    const { remaining = 0 } = await checkSubmitLimit().catch(() => ({ canSubmit: false, remaining: 0 }))
    
    return {
      success: false,
      message: '服务器处理错误，请稍后再试',
      remaining
    }
  }
} 