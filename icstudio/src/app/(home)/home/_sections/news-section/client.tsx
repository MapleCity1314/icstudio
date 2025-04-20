'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NewsItemContent } from './server';
import type { NewsItem } from '../../_components/server/news-server';

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 交互式新闻项组件
export function NewsItemInteractive({ item, index }: { item: NewsItem, index: number }) {
  const titleUnderlineRef = useRef<HTMLSpanElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!titleUnderlineRef.current || !itemRef.current) return;

    // 创建hover动画但不立即播放
    const hoverAnimation = gsap.to(titleUnderlineRef.current, {
      width: "100%",
      duration: 0.3,
      ease: "power1.out",
      paused: true
    });
    
    // 使用函数引用以便于移除
    const handleMouseEnter = () => hoverAnimation.play();
    const handleMouseLeave = () => hoverAnimation.reverse();
    
    // 鼠标进入时播放动画
    itemRef.current.addEventListener("mouseenter", handleMouseEnter);
    
    // 鼠标离开时反向播放
    itemRef.current.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      if (itemRef.current) {
        itemRef.current.removeEventListener("mouseenter", handleMouseEnter);
        itemRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      hoverAnimation.kill();
    };
  }, []);

  return (
    <div ref={itemRef} className={`news-item news-item-${index} group`}>
      <Link href={`/news/${item.slug}`} className="block group-hover:opacity-100">
        <div className="relative overflow-hidden">
          <NewsItemContent item={item} />
          
          {/* 下划线动画 - 仅在客户端处理 */}
          <span 
            ref={titleUnderlineRef}
            className="absolute bottom-[65px] md:bottom-[95px] left-[82px] md:left-[122px] w-0 h-[1px] bg-white"
          ></span>
          
          {/* 箭头指示器 - 仅在客户端处理 */}
          <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>

      {/* 分隔线 */}
      <div className="h-px w-full bg-white/10 mt-12"></div>
    </div>
  );
} 