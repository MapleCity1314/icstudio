'use client';

import React,{ useEffect, useRef, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextPressure from '@/components/anime/TextPressure/TextPressure';
import Magnet from '@/components/anime/Magnet/Magnet';
import Image from 'next/image';
import { TechStackIcon } from '../_components/server/creative-server';

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
}

// 技术栈展示函数
const TechStackWrapper = React.memo(({
      techStack,
}:{
      techStack: ReactNode
}) => {
      const techStackRef = useRef<HTMLDivElement>(null);
      const animationTriggers = useRef<ScrollTrigger[]>([]);
      
      useEffect(() => {
            if (!techStackRef.current) return;
            
            // 创建技术栈元素的动画
            const techItems = techStackRef.current.children;
            
            if (techItems.length > 0) {
                  gsap.fromTo(
                        techItems,
                        { 
                              opacity: 0, 
                              y: 30, 
                              scale: 0.9 
                        },
                        { 
                              opacity: 1, 
                              y: 0, 
                              scale: 1, 
                              stagger: 0.1,
                              duration: 0.6,
                              ease: "power2.out",
                              scrollTrigger: {
                                    trigger: techStackRef.current,
                                    start: "top 80%",
                                    toggleActions: "play none none none"
                              }
                        }
                  );
                  
                  // 存储ScrollTrigger实例用于清理
                  if (ScrollTrigger.getAll().length > 0) {
                        animationTriggers.current = [...ScrollTrigger.getAll()];
                  }
            }
            
            return () => {
                  // 清理动画触发器
                  animationTriggers.current.forEach(trigger => {
                        if (trigger) trigger.kill();
                  });
            };
      }, []);
      
      return (
            <div ref={techStackRef} className="flex flex-wrap justify-center gap-8 mt-8">
                  {techStack}
            </div>
      );
});

TechStackWrapper.displayName = "TechStackWrapper";

const CreativeSection = React.memo(() => {
      const sectionRef = useRef<HTMLDivElement>(null);
      const containerRef = useRef<HTMLDivElement>(null);
      const titleRef = useRef<HTMLHeadingElement>(null);
      const subtitleRef = useRef<HTMLParagraphElement>(null);
      const descriptionRef = useRef<HTMLDivElement>(null);
      const buttonRef = useRef<HTMLDivElement>(null);
      const techStackRef = useRef<HTMLDivElement>(null);
      // 存储ScrollTrigger实例，用于清理
      const scrollTriggers = useRef<ScrollTrigger[]>([]);
      // 组件挂载状态标记
      const isMounted = useRef(true);

      useEffect(() => {
            // 容器入场动画
            if (containerRef.current) {
                  const containerTrigger = ScrollTrigger.create({
                        trigger: containerRef.current,
                        start: 'top 80%',
                  });
                  
                  scrollTriggers.current.push(containerTrigger);
            }

            // 标题动画
            if (titleRef.current) {
                  const titleTrigger = ScrollTrigger.create({
                        trigger: titleRef.current,
                        start: 'top 85%',
                        toggleActions: "play none none none", // 只执行一次
                  });
                  
                  scrollTriggers.current.push(titleTrigger);
            }

            // 副标题动画
            if (subtitleRef.current) {
                  const subtitleTrigger = ScrollTrigger.create({
                        trigger: subtitleRef.current,
                        start: 'top 85%',
                        toggleActions: "play none none none", // 只执行一次
                  });
                  
                  scrollTriggers.current.push(subtitleTrigger);
            }

            // 描述文字动画
                  if (descriptionRef.current) {
                        const descriptionTrigger = ScrollTrigger.create({
                              trigger: descriptionRef.current,
                              start: 'top 85%',
                              toggleActions: "play none none none", // 只执行一次
                  });
                  
                  scrollTriggers.current.push(descriptionTrigger);
            }

            // 技术栈动画
            if (techStackRef.current) {
                  const techTrigger = ScrollTrigger.create({
                        trigger: techStackRef.current,
                        start: 'top 85%',
                        toggleActions: "play none none none", // 只执行一次
                  });
                  
                  scrollTriggers.current.push(techTrigger);
            }

            // 按钮动画
            if (buttonRef.current) {
                  const buttonTrigger = ScrollTrigger.create({
                        trigger: buttonRef.current,
                        start: 'top 90%',
                        toggleActions: "play none none none", // 只执行一次
                  });
                  
                  scrollTriggers.current.push(buttonTrigger);
            }

            return () => {
                  // 标记组件已卸载
                  isMounted.current = false;
                  
                  // 正确清理所有ScrollTrigger实例
                  scrollTriggers.current.forEach(trigger => {
                        if (trigger) trigger.kill();
                  });
                  scrollTriggers.current = [];
                  
                  // 刷新其余的ScrollTrigger
                  ScrollTrigger.refresh();
            };
      }, []);

      return (
            <>
                  <section
                        id="creative"
                        ref={sectionRef}
                        className="relative py-24 md:py-32 px-4 flex items-center justify-center min-h-screen overflow-hidden bg-gray-800 dark:bg-black"
                  >
                        {/* 主要内容 */}
                        <div ref={containerRef} className="container mx-auto max-w-6xl z-10">
                              <div className="flex flex-col items-center justify-center text-center space-y-12">
                                    {/* 标题 */}
                                    <h2
                                          ref={titleRef}
                                          className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-violet-300"
                                    >
                                          年轻，敢想，敢创
                                    </h2>

                                    {/* 副标题 */}
                                    <p
                                          ref={subtitleRef}
                                          className="text-xl md:text-2xl font-medium text-gray-300 italic font-family-[--font-beatrice-display]"
                                    >
                                          Be Young, Be Creative, Be Bold
                                    </p>

                                    {/* GridDistortion 区域 */}
                                    <div className="flex items-center justify-center w-full h-[400px] relative rounded-3xl overflow-hidden my-12 mx-auto">
                                          
                                          <Image
                                          src="/bg/background.webp"
                                          alt="background"
                                          className="w-full h-full"
                                          width={1920}
                                          height={1080}
                                          />

                                          {/* TextPressure 组件 */}
                                          <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-full flex items-center justify-center">
                                                      <TextPressure
                                                            text="Creators"
                                                            fontFamily="Compressa VF"
                                                            fontUrl="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
                                                            width={true}
                                                            weight={true}
                                                            italic={true}
                                                            alpha={false}
                                                            flex={true}
                                                            stroke={true}
                                                            scale={true}
                                                            textColor="#FFFFFF"
                                                            strokeColor="#3B82F6"
                                                            strokeWidth={2}
                                                            className="w-full h-full"
                                                            minFontSize={48}
                                                      />
                                                </div>
                                          </div>
                                    </div>

                                    {/* 描述内容 */}
                                    <div
                                          ref={descriptionRef}
                                          className="space-y-6 text-md md:text-lg text-gray-300 max-w-2xl"
                                    >
                                          <p>
                                                我们是一群充满激情和创造力的年轻人，致力于用科技和创新改变世界。在无限创作工作室，我们相信每个想法都有实现的可能。
                                          </p>
                                          <p>
                                                从前端到后端，从移动应用到桌面软件，我们精通各种技术栈，包括Vue3、React、Next.js、Django、Tauri、Electron和SpringBoot。但技术只是工具，真正驱动我们的是通过AI和前沿技术解决实际问题的热情。
                                          </p>
                                          <p>加入我们，一起探索无限可能，让创意照亮未来。</p>
                                    </div>

                                    {/* 技术栈展示 */}
                                    <TechStackWrapper techStack={<TechStackIcon />} />

                                    {/* 按钮 */}
                                    <div ref={buttonRef} className="mt-6">
                                          <Button
                                                size="lg"
                                                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full w-24 h-24 p-0 flex items-center justify-center text-lg group"
                                                onClick={() => window.open('/about', '_self')}
                                          >
                                                <Magnet magnetStrength={1.5} className="inline-block">
                                                      <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-1" />
                                                </Magnet>
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  </section>
            </>
      );
});

CreativeSection.displayName = "CreativeSection"

export default CreativeSection;
