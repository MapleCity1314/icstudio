'use server';

import { getBaseUrl } from '@/app/get-base-url';
import { NewsItem } from '@/types/news';

/**
 * @description 新闻分类
 */

const CATEGORIES = [
      { id: 'all', name: '全部' },
      { id: 'technology', name: '技术' },
      { id: 'projects', name: '项目' },
      { id: 'company', name: '公司' },
      { id: 'industry', name: '行业' },
];

/**
 * @description 获取新闻分类
 * @returns 分类列表
 */
export async function fetchCategories() {
      // 延迟执行，避免同步调用引起状态更新问题
      await new Promise(resolve => setTimeout(resolve, 0));
      return CATEGORIES;
}

/**
 * @description 获取新闻列表
 */

export async function fetchNewsList(params: {
      page: number;
      limit: number;
      category: string;
}): Promise<NewsItem[]> {
      try {
            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}/api/news`);
            if (!response.ok) {
                  throw new Error('Failed to fetch news');
            }
            const allNews: NewsItem[] = await response.json();
            
            const { page, limit, category } = params;
            const filteredNews = category === 'all' 
                  ? allNews 
                  : allNews.filter((item) => item.category === category);
            
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            return filteredNews.slice(startIndex, endIndex);
      } catch (error) {
            console.error('获取新闻列表失败:', error);
            return [];
      }
}

/**
 * @description 获取指定ID的新闻详情
 * @param slug 新闻slug
 */
export async function fetchNewsDetail(slug: string): Promise<NewsItem | null> {
      try {
            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}/api/news`);
            
            if (!response.ok) {
                  throw new Error('Failed to fetch news');
            }
            
            const allNews: NewsItem[] = await response.json();
            
            // 查找指定slug的新闻
            const news = allNews.find((item) => item.slug === slug);
            
            return news || null;
      } catch (error) {
            console.error('获取新闻详情失败:', error);
            return null;
      }
}