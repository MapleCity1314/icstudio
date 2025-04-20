'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Suspense } from 'react';
import { getNews } from './server';
import { NewsItemInteractive } from './client';

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 新闻加载中组件
const NewsLoading = () => (
  <div className="flex justify-center items-center py-32">
    <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
  </div>
);

// 新闻部分主组件
export default function NewsSection() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const newsItemsRef = useRef<HTMLDivElement>(null);
  
  // 存储动画实例以便清理
  const animations = useRef<gsap.core.Tween[]>([]);
  const scrollTriggers = useRef<ScrollTrigger[]>([]);
  
  // 组件是否已卸载的标记
  const isMounted = useRef(true);
  
  // 预获取新闻数据 (服务器端)
  const newsPromise = getNews();

  useEffect(() => {
    setMounted(true);
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 增强动画效果
  useEffect(() => {
    if (!mounted || !titleRef.current) return;
    
    // 标题动画
    const titleAnim = gsap.fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none none", // 只执行一次
        },
      }
    );
    
    // 保存ScrollTrigger实例
    if (titleAnim.scrollTrigger) {
      scrollTriggers.current.push(titleAnim.scrollTrigger);
    }

    return () => {
      // 清理ScrollTrigger实例
      scrollTriggers.current.forEach(trigger => {
        trigger.kill();
      });
      scrollTriggers.current = [];
      
      // 清理其他动画
      animations.current.forEach(animation => {
        animation.kill();
      });
      animations.current = [];
    }
  }, [mounted]);

  // 如果组件未挂载，返回null
  if (!mounted) return null;

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative py-32 md:py-40 w-full bg-[#0a0a0a] text-white news-section"
    >
      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="container mx-auto max-w-6xl px-6">
        {/* 标题 */}
        <div className="flex items-center mb-24">
          <div className="h-px flex-grow bg-white/10"></div>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-light px-6 tracking-wider text-white uppercase">
            Latest News
          </h2>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        {/* 新闻列表 - 使用Suspense包装 */}
        <Suspense fallback={<NewsLoading />}>
          <NewsList newsPromise={newsPromise} />
        </Suspense>

        {/* 页脚 */}
        <div className="mt-32 text-center">
          <Link
            href="/news"
            className="inline-flex items-center text-lg tracking-wider uppercase font-light hover:text-white text-white/80 transition-all duration-300 group border-b border-white/20 pb-2"
          >
            <span>View All Articles</span>
            <ArrowRight className="ml-3 h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// 新闻列表组件 - 处理异步数据
async function NewsList({ newsPromise }:{newsPromise:unknown}) {
  const news = await newsPromise;
  
  return (
    <div className="grid gap-20 md:gap-32">
      {news.map((item, index) => (
        <NewsItemInteractive 
          key={item.id} 
          item={item} 
          index={index} 
        />
      ))}
    </div>
  );
} 