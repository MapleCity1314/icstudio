import { dbFactory } from './db-factory';
import { newsSchema } from './schema/new';

/**
 * 初始化所有数据库模型
 * @description 注册所有模型Schema到数据库工厂
 */
export function initDatabaseModels(): void {
  console.log('正在初始化数据库模型...');
  
  try {
    // 注册新闻模型
    dbFactory.registerSchema('News', newsSchema);
    
    console.log('数据库模型初始化完成');
  } catch (error) {
    console.error('初始化数据库模型失败:', error);
    throw error;
  }
} 