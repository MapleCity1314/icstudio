// 'use server' 指令已注释掉，转为客户端模式

// 模拟的客户端版本API响应接口
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// 模拟状态枚举（替代原来的服务器端枚举）
export enum FeedbackStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  REPLIED = 'replied',
  ARCHIVED = 'archived'
}

/**
 * 模拟获取反馈列表 - 客户端版本
 */
export function getFeedbackList(
  filters: { type?: string; status?: string; search?: string } = {},
  paginationOptions = { page: 1, limit: 10 }
): ApiResponse {
  console.log('获取反馈列表 - 客户端模拟', { filters, paginationOptions });
  
  return {
    success: true,
    message: '获取反馈列表成功',
    data: {
      items: [],
      pagination: {
        total: 0,
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        pages: 0
      }
    }
  };
}

/**
 * 模拟删除反馈 - 客户端版本
 */
export function deleteFeedback(id: string): ApiResponse {
  console.log('删除反馈 - 客户端模拟', id);
  
  return {
    success: true,
    message: '删除反馈成功'
  };
}

/**
 * 模拟更新反馈状态 - 客户端版本
 */
export function updateFeedbackStatus(
  id: string, 
  status: FeedbackStatus
): ApiResponse {
  console.log('更新反馈状态 - 客户端模拟', { id, status });
  
  return {
    success: true,
    message: '更新反馈状态成功'
  };
} 