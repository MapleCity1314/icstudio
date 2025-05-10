'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '@/types/news';
import { useCallback } from 'react';

interface NewsCardProps {
  item: NewsItem;
  index: number;
  onHover?: (index: number) => void;
}

const NewsCard = ({ item, index, onHover }: NewsCardProps) => {
  // 使用useCallback避免不必要的函数重建
  const handleMouseEnter = useCallback(() => {
    if (onHover) onHover(index);
  }, [onHover, index]);

  // 图片路径处理
  const imageSrc = item.image || `/placeholder.svg?height=400&width=600&query=新闻图片`;
  const category = item.category || "新闻";
  const readTime = item.readTime || "5分钟阅读";

  return (
    <Link 
      href={`/news/${item.slug}`} 
      key={item.id} 
      className={`group news-card news-card-${index}`}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full transition-all duration-300 hover:border-gray-700">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageSrc}
              alt={item.title}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white border-none">
                {category}
              </Badge>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="text-sm text-white/60 mb-3 flex items-center">
              <span>{item.month} {item.day}</span>
              <span className="mx-2">•</span>
              <span>{readTime}</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-3 group-hover:text-white/90 transition-colors duration-300 relative">
              {item.title}
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-white news-card-underline"></span>
            </h3>
            {item.excerpt && (
              <p className="text-white/60 text-sm mb-4 flex-1">{item.excerpt}</p>
            )}
            <div className="flex items-center text-white/70 text-sm mt-auto group-hover:text-white transition-colors duration-300">
              <span>阅读更多</span>
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
