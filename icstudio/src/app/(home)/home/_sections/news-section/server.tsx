import { getNewsData } from '../../_components/server/news-server';
import type { NewsItem } from '../../_components/server/news-server';

// 服务端获取新闻数据
export async function getNews(): Promise<NewsItem[]> {
  const newsData = await getNewsData();
  return newsData;
}

// 静态新闻条目组件
export function NewsItemContent({ item }: { item: NewsItem }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
      {/* 日期显示 */}
      <div className="md:w-24 text-center md:text-left">
        <div className="inline-flex flex-col items-center md:items-start">
          <span className="text-xs font-light tracking-widest text-white/60">{item.month}</span>
          <span className="text-2xl font-medium">{item.day}</span>
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-3 transition-all duration-300 text-white/90 relative">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-white/60 text-lg md:text-xl font-light mt-3 max-w-3xl">{item.excerpt}</p>
        )}
      </div>
    </div>
  );
} 