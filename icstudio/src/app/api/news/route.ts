import { NewsItem } from "@/types/news";
import { NextRequest, NextResponse } from "next/server";
import { dbFactory } from "@/lib/db/db-factory";
import { ensureDbConnection, isDbInitialized } from "@/lib/db/init-db";
import { seedDatabase } from "@/lib/db/seed-data";

// 用于标记数据库是否已填充测试数据
let isSeeded = true;

/**
 * 初始化数据库并填充种子数据
 */
async function initializeDatabase() {
  try {
    // 确保数据库已连接
    if (!isDbInitialized()) {
      await ensureDbConnection();
    }                                                                                                                                                                                                                                                                                                                                                                                                 
    
    // 如果尚未填充测试数据，则填充
    if (!isSeeded) {
      await seedDatabase();
      isSeeded = true;
    }
  } catch (error) {
    console.error('初始化数据库失败:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // 初始化数据库
    await initializeDatabase();
    
    // 获取新闻服务
    const newsService = dbFactory.getService<NewsItem>('News');
    
    // 查询所有新闻数据
    const newsItems = await newsService.find({});
    
    // 返回结果
    return NextResponse.json(newsItems, { status: 200 });
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    return NextResponse.json(
      { error: '获取新闻列表失败' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 确保数据库已连接
    await ensureDbConnection();
    
    // 解析请求体
    const newsData = await request.json();
    
    // 获取新闻服务
    const newsService = dbFactory.getService<NewsItem>('News');
    
    // 创建新闻
    const newNews = await newsService.create(newsData);
    
    // 返回结果
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('创建新闻失败:', error);
    return NextResponse.json(
      { error: '创建新闻失败' }, 
      { status: 500 }
    );
  }
}

// 处理DELETE请求 - 删除指定新闻
export async function DELETE(request: NextRequest) {
  try {
    // 确保数据库已连接
    await ensureDbConnection();
    
    // 从URL获取ID
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '未提供新闻ID' }, 
        { status: 400 }
      );
    }
    
    // 获取新闻服务
    const newsService = dbFactory.getService<NewsItem>('News');
    
    // 删除新闻
    await newsService.deleteById(id);
    
    // 返回结果
    return NextResponse.json(
      { message: '新闻删除成功' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('删除新闻失败:', error);
    return NextResponse.json(
      { error: '删除新闻失败' }, 
      { status: 500 }
    );
  }
}      
