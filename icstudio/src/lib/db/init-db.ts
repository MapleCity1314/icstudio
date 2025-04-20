import { dbFactory } from './db-factory';

let initialized = false;

/**
 * @description 确保数据库连接
 * @param uri 可选的数据库连接URI
 * @returns 是否成功初始化
 */
export async function ensureDbConnection(uri?: string): Promise<boolean> {
  if (!initialized) {
    try {
      await dbFactory.initialize(uri);
      initialized = true;
      console.log('数据库连接已初始化');
    } catch (error) {
      console.error('数据库连接失败:', error);
      throw error;
    }
  }
  return initialized;
}

/**
 * @description 获取数据库初始化状态
 * @returns 是否已初始化
 */
export function isDbInitialized(): boolean {
  return initialized;
}

/**
 * @description 清理数据库连接
 * @returns 是否成功断开连接
 */
export async function cleanupDbConnection(): Promise<boolean> {
  if (initialized) {
    try {
      await dbFactory.disconnect();
      initialized = false;
      console.log('数据库连接已断开');
      return true;
    } catch (error) {
      console.error('断开数据库连接失败:', error);
      return false;
    }
  }
  return true;
} 