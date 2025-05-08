'use server';

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

//server组件
export async function fetchCategories() {
      return CATEGORIES;
}

/**
 * @description 获取新闻列表
 */

interface getNewsListParams {
      page: number; // 页码
      limit: number; // 每页条数
      category: string; // 分类
}

interface NewsList {
      data: NewsListItem[];
}

interface NewsListItem {
      id: string; // 新闻ID
      title: string; // 新闻标题
      date: string; // 新闻日期
      month: string; // 新闻月份
      day: string; // 新闻日期
      slug: string; // 新闻slug
      excerpt: string; // 摘要
      category: string; // 分类
      readTime: string; // 阅读时间
      image: string; // 图片路径
      content: string; // 内容
}

export async function fetchNewsList(params: getNewsListParams) {
      const { page, limit, category } = params;
      const newsList = await fetch('http://localhost:3000/api/news');
      const filteredNews = newsList.filter((item) => item.category === category);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNews = filteredNews.slice(startIndex, endIndex);
      return paginatedNews;
}