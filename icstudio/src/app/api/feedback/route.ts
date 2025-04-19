import { NextRequest, NextResponse } from 'next/server'
import { dbFactory } from '@/lib/db/db-factory'
import { FEEDBACK_MODEL_NAME, feedbackSchema, FeedbackType, FeedbackStatus, IFeedback } from '@/lib/db/schema/feedback'
import { FilterQuery } from 'mongoose'

// 注册Schema
dbFactory.registerSchema(FEEDBACK_MODEL_NAME, feedbackSchema)

/**
 * 表单验证的输入数据接口
 */
interface FeedbackInput {
  name?: string;
  email?: string;
  message?: string;
  type?: string;
  phone?: string;
  portfolio?: string;
  company?: string;
  address?: string;
  [key: string]: unknown;
}

/**
 * 验证反馈数据
 */
function validateFeedbackData(data: FeedbackInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // 验证必填字段
  if (!data.name) errors.push('缺少姓名字段')
  if (!data.email) errors.push('缺少邮箱字段')
  if (!data.message) errors.push('缺少消息字段')
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (data.email && !emailRegex.test(data.email)) errors.push('邮箱格式不正确')
  
  // 验证类型
  if (!data.type) {
    errors.push('缺少类型字段')
  } else if (!Object.values(FeedbackType).includes(data.type as FeedbackType)) {
    errors.push('类型字段不正确')
  }
  
  // 根据类型验证特有字段
  if (data.type === FeedbackType.JOIN && !data.phone) {
    errors.push('加入类型必须提供电话')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 创建反馈
 * @route POST /api/feedback
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const data = await request.json() as FeedbackInput
    
    // 验证数据
    const { isValid, errors } = validateFeedbackData(data)
    if (!isValid) {
      return NextResponse.json({ success: false, message: '数据验证失败', errors }, { status: 400 })
    }

    await dbFactory.initialize()
    
    // 获取服务
    const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME)
    
    // 创建反馈
    const result = await feedbackService.create({
      ...data,
      status: FeedbackStatus.PENDING,
    } as IFeedback)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || '创建反馈失败' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: true, data: result.data, message: '创建反馈成功' }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('创建反馈失败:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' }, 
      { status: 500 }
    )
  } finally {
        await dbFactory.disconnect()
  }
}

/**
 * 获取反馈列表
 * @route GET /api/feedback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 分页参数
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // 过滤参数
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    // 构建查询条件
    const filter: FilterQuery<IFeedback> = {}
    if (type) filter.type = type
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ]
    }

    //链接数据库
    await dbFactory.initialize()
    
    // 获取服务
    const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME)
    
    // 分页查询
    const result = await feedbackService.findWithPagination(filter, { page, limit }, {})
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || '获取反馈列表失败' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, ...result.data })
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' }, 
      { status: 500 }
    )
  } finally {
        await dbFactory.disconnect()
  }
}

/**
 * 删除反馈
 * @route DELETE /api/feedback/:id
 */
export async function DELETE(request: NextRequest) {
  try {
    // 获取ID
    const id = request.url.split('/').pop()
    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少ID参数' }, 
        { status: 400 }
      )
    }
    
    // 获取服务
    const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME)
    
    // 删除反馈
    const result = await feedbackService.deleteById(id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || '删除反馈失败' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: '删除反馈成功' })
  } catch (error) {
    console.error('删除反馈失败:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' }, 
      { status: 500 }
    )
  }
}

/**
 * 更新反馈状态
 * @route PATCH /api/feedback/:id
 */
export async function PATCH(request: NextRequest) {
  try {
    // 获取ID
    const id = request.url.split('/').pop()
    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少ID参数' }, 
        { status: 400 }
      )
    }
    
    // 获取请求体
    const data = await request.json()
    
    // 确保只更新状态
    if (!data.status || !Object.values(FeedbackStatus).includes(data.status)) {
      return NextResponse.json(
        { success: false, message: '状态字段不正确' }, 
        { status: 400 }
      )
    }
    
    // 获取服务
    const feedbackService = dbFactory.getService<IFeedback>(FEEDBACK_MODEL_NAME)
    
    // 更新反馈
    const result = await feedbackService.updateById(id, { status: data.status })
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || '更新反馈失败' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data: result.data, message: '更新反馈成功' })
  } catch (error) {
    console.error('更新反馈失败:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' }, 
      { status: 500 }
    )
  }
}