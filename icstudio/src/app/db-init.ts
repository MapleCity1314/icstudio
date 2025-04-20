import { ensureDbConnection } from "@/lib/db/init-db";

// 尝试在应用启动时初始化数据库
// Next.js会在应用启动时自动加载此文件
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
export async function register() {
  try {
    console.log('正在初始化数据库连接...');
    await ensureDbConnection();
    console.log('数据库初始化成功！');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    // 不要在这里抛出错误，让应用继续启动
    // 后续的数据库操作会在需要时重新尝试连接
  }
} 