'use client';

import { useEffect, useState, Suspense } from 'react';
import { CurvedNavigation } from './_components/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

// 静态导入HeroSection（首屏内容应当立即加载）
import HeroSection from './_sections/hero-section';

// 替换为动态导入其他组件
const CreativeSection = dynamic(() => import('./_sections/creative-section'), {
  loading: () => <SectionLoader title="创意部分" />,
  ssr: false
});

const ProjectsSection = dynamic(() => import('./_sections/projects-section').then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <SectionLoader title="项目展示" />,
  ssr: false
});

const NewsSection = dynamic(() => import('./_sections/news-section').then(mod => ({ default: mod.NewsSection })), {
  loading: () => <SectionLoader title="新闻资讯" />,
  ssr: false
});

const ContactSection = dynamic(() => import('./_sections/contact-section'), {
  loading: () => <SectionLoader title="联系我们" />,
  ssr: false
});

// 加载占位组件
const SectionLoader = ({ title }: { title: string }) => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <h2 className="mt-4 text-xl">{title}加载中...</h2>
    </div>
  </div>
);

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Page = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // 设置滚动平滑并刷新ScrollTrigger
  useEffect(() => {
    // 优化滚动性能
    const scrollSmoother = {
      current: null as unknown as gsap.core.Tween | null,
    };

    // 设置ScrollTrigger默认配置
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
      ignoreMobileResize: true,
    });

    // 刷新所有ScrollTrigger实例
    ScrollTrigger.refresh();

    return () => {
      // 清理所有ScrollTrigger实例
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // 清理滚动平滑
      if (scrollSmoother.current) {
        scrollSmoother.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    setTheme('dark');
    setMounted(true);
  }, [setTheme]);

  if (!mounted) return null;

  return (
    <main className="relative">
      <CurvedNavigation />
      
      {/* HeroSection 保持立即加载 */}
      <HeroSection />
      
      {/* 其他部分使用Suspense包装，实现懒加载 */}
      <Suspense fallback={<SectionLoader title="创意部分" />}>
        <CreativeSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader title="项目展示" />}>
        <ProjectsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader title="新闻资讯" />}>
        <NewsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader title="联系我们" />}>
        <ContactSection />
      </Suspense>
    </main>
  );
};

export default Page;
