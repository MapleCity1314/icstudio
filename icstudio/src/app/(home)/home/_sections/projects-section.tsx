'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
// import { AiChatSimulator } from './ai-chat-simulator';
import Image from 'next/image';
import Magnet from '@/components/anime/Magnet/Magnet';
import { motion } from 'framer-motion';
import React from 'react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

// 确保GSAP插件只注册一次
if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
}

// // 几何形状组件
// interface GeometricShapeProps {
//       className?: string;
//       style?: React.CSSProperties;
//       type?: 'circle' | 'triangle' | 'hexagon' | 'diamond';
// }

// const GeometricShape: React.FC<GeometricShapeProps> = ({ className = '', style = {}, type = 'circle' }) => {
//       const shapes = {
//             circle: <div className={`rounded-full ${className}`} style={style}></div>,
//             triangle: (
//                   <div
//                         className={`${className}`}
//                         style={{
//                               ...style,
//                               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
//                         }}
//                   ></div>
//             ),
//             hexagon: (
//                   <div
//                         className={`${className}`}
//                         style={{
//                               ...style,
//                               clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
//                         }}
//                   ></div>
//             ),
//             diamond: (
//                   <div
//                         className={`${className}`}
//                         style={{
//                               ...style,
//                               clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
//                         }}
//                   ></div>
//             ),
//       };

//       return shapes[type];
// };

// 项目数据
const projects = [
      {
            title: '悟创物联',
            description: '使用Vue + Springboot的物联网平台，实现设备管理、数据采集、告警管理、用户管理、角色管理、权限管理、日志管理、系统管理等功能。',
            imageUrl: '/projects/big.gif',
            color: 'from-blue-500 to-purple-500',
            state: '已上线',
            tags: ['Vue', 'Springboot', 'IoT'],
            projectLink: 'https://example.com/project1',
            githubLink: 'https://github.com/example/project1',
      },
      {
            title: '判题鸭',
            description: '基于Vue + Springboot的AI在线判题系统，支持多种编程语言，多种题型，多种难度，多种评测方式，多种评测环境，多种评测数据，多种评测结果，多种评测报告，多种评测分析。',
            imageUrl: '/projects/ya.jpg',
            color: 'from-purple-500 to-pink-500',
            state: '已上线',
            tags: ['Vue', 'Springboot', 'AI'],
            projectLink: 'https://example.com/project2',
            githubLink: 'https://github.com/example/project2',
      },
      {
            title: 'API开放平台',
            description: '基于React + Springboot的API开放平台，支持多种API类型，多种API管理，多种API调用，多种API测试，多种API文档，多种API监控，多种API告警，多种API分析。',
            imageUrl: '/placeholder.svg?height=300&width=400',
            color: 'from-indigo-500 to-blue-500',
            state: '已上线',
            tags: ['React', 'Springboot', 'API'],
            projectLink: 'https://example.com/project3',
            githubLink: 'https://github.com/example/project3',
      },
      {
            title: 'AI多模态MCP交流平台',
            description: '基于Vercel AI SDK + SpringAI 的AI多模态MCP交流平台，支持多种AI模型，多种AI功能，多种AI应用，多种AI管理，多种AI监控，多种AI告警，多种AI分析。',
            imageUrl: '/placeholder.svg?height=300&width=400',
            color: 'from-red-500 to-orange-500',
            state: '已上线',
            tags: ['Next.js', 'SpringAI', 'AI'],
            projectLink: 'https://example.com/project4',
            githubLink: 'https://github.com/example/project4',
      },
      {
            title: 'IC Studio 官网',
            description: '如你所见，我们的官网由 React 18 + Next.js 15 开发，包含GSAP，motion，three等多种动画库，包含资源库，展示等多种功能',
            imageUrl: '/logo/logo-t.png',
            color: 'from-green-500 to-lime-500',
            state: '已上线',
            tags: ['React', 'Next.js', 'GSAP'],
            projectLink: 'https://example.com/project5',
            githubLink: 'https://github.com/example/project5',
      },
      {
            title: 'Loome:织',
            description: '多平台强大的多AI多模态视频编辑器，目前处于研发中',
            imageUrl: '/placeholder.svg?height=300&width=400',
            color: 'from-orange-500 to-yellow-500',
            state: '研发中',
            tags: ['Tauri', 'React', 'AI'],
            projectLink: 'https://example.com/project6',
            githubLink: 'https://github.com/example/project6',
      }
];

// 3D项目卡片组件
interface ProjectCardProps {
      project: {
            title: string;
            description: string;
            imageUrl: string;
            color: string;
            state: string;
            tags?: string[];
            projectLink?: string;
            githubLink?: string;
      };
      index: number;
      theme: string | undefined;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, theme }) => {
      const cardVariants = {
            hidden: { opacity: 0, y: 50 },
            visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                        duration: 0.8, 
                        delay: index * 0.2,
                        ease: [0.25, 0.1, 0.25, 1]
                  } 
            }
      };

      return (
            <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
            >
                  <CardContainer className="w-full">
                        <CardBody className={`w-full h-[400px] min-h-[400px] ${
                              theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/90'
                        } shadow-2xl backdrop-blur-sm rounded-xl border-0 hover:shadow-xl overflow-hidden relative`}>
                              {/* 背景图形装饰
                              <CardItem
                                    translateZ={50}
                                    className="absolute -right-12 -top-12 z-0 opacity-20"
                              >
                                    <GeometricShape 
                                          type={['circle', 'triangle', 'hexagon', 'diamond'][index % 4] as 'circle' | 'triangle' | 'hexagon' | 'diamond'} 
                                          className={`w-32 h-32 bg-gradient-to-r ${project.color}`} 
                                    />
                              </CardItem>
                              <CardItem
                                    translateZ={30}
                                    className="absolute -left-6 -bottom-6 z-0 opacity-20"
                              >
                                    <GeometricShape 
                                          type={['diamond', 'hexagon', 'triangle', 'circle'][(index + 2) % 4] as 'circle' | 'triangle' | 'hexagon' | 'diamond'} 
                                          className={`w-20 h-20 bg-gradient-to-r ${project.color}`} 
                                    />
                              </CardItem> */}

                              {/* 项目状态标签 */}
                              <CardItem
                                    translateZ={60}
                                    className="absolute top-4 right-4 z-10"
                              >
                                    <div className={`px-3 py-1 text-xs font-semibold rounded-full
                                          ${project.state === '已上线' 
                                                ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                                                : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>
                                          {project.state}
                                    </div>
                              </CardItem>

                              {/* 项目主图 */}
                              <CardItem
                                    translateZ={20}
                                    className="relative h-44 w-full bg-gradient-to-r overflow-hidden"
                              >
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black/20 ${project.color}`}>
                                          <Image
                                                src={project.imageUrl || '/placeholder.svg'}
                                                alt={project.title}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                                          />
                                    </div>
                                    
                                    {/* 悬停时显示的链接按钮 */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          {project.projectLink && (
                                                <Magnet>
                                                      <a href={project.projectLink} target="_blank" rel="noopener noreferrer" 
                                                            className="p-2 bg-white/90 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                                            <ExternalLink className="w-5 h-5 text-gray-800" />
                                                      </a>
                                                </Magnet>
                                          )}
                                          {project.githubLink && (
                                                <Magnet>
                                                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                            className="p-2 bg-white/90 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                                            <Github className="w-5 h-5 text-gray-800" />
                                                      </a>
                                                </Magnet>
                                          )}
                                    </div>
                              </CardItem>

                              {/* 项目内容 */}
                              <CardItem
                                    translateZ={40}
                                    className="p-6 z-10 absolute bottom-0 left-0 right-0"
                              >
                                    {/* 标题 */}
                                    <h3 className={`text-xl font-bold mb-2 ${
                                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                                    }`}>
                                          {project.title}
                                    </h3>
                                    
                                    {/* 标签 */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                          {project.tags?.map((tag, idx) => (
                                                <span key={idx} 
                                                      className={`text-xs px-2 py-1 rounded-full ${
                                                            theme === 'dark' 
                                                                  ? 'bg-gray-700 text-gray-300' 
                                                                  : 'bg-gray-200 text-gray-700'
                                                      }`}>
                                                      {tag}
                                                </span>
                                          ))}
                                    </div>
                                    
                                    {/* 描述 */}
                                    <p className={`${
                                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    } text-sm line-clamp-3 mb-4`}>
                                          {project.description}
                                    </p>
                                    
                                    {/* 按钮 */}
                                    <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className={`group mt-2 ${
                                                theme === 'dark'
                                                      ? 'border-gray-700 hover:bg-gray-700'
                                                      : 'border-gray-300 hover:bg-gray-100'
                                          }`}>
                                          了解更多
                                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                              </CardItem>
                        </CardBody>
                  </CardContainer>
            </motion.div>
      );
};

export const ProjectsSection = React.memo(() => {
      const [mounted, setMounted] = useState(false);
      const { theme } = useTheme();
      const sectionRef = useRef<HTMLDivElement>(null);
      const projectsRef = useRef<HTMLDivElement>(null);
      const titleRef = useRef<HTMLHeadingElement>(null);
      // const demoRef = useRef<HTMLDivElement>(null);
      
      // 存储ScrollTrigger实例，用于清理
      const scrollTriggers = useRef<ScrollTrigger[]>([]);
      // 组件挂载状态标记
      const isMounted = useRef(true);

      // 解决水合问题
      useEffect(() => {
            setMounted(true);
            
            return () => {
                  isMounted.current = false;
            };
      }, []);

      useEffect(() => {
            if (!mounted) return;

            // 标题动画
            if (titleRef.current) {
                  const titleTrigger = ScrollTrigger.create({
                        trigger: titleRef.current,
                        start: 'top 80%',
                        toggleActions: "play none none none", // 只执行一次
                  });
                  
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const titleAnim = gsap.fromTo(
                        titleRef.current,
                        { y: -50, opacity: 0 },
                        {
                              y: 0,
                              opacity: 1,
                              duration: 1.2,
                              ease: 'power3.out',
                              scrollTrigger: titleTrigger,
                        }
                  );
                  
                  // 添加到实例列表用于清理
                  scrollTriggers.current.push(titleTrigger);
            }

            return () => {
                  // 清理所有ScrollTrigger实例
                  scrollTriggers.current.forEach((trigger) => {
                        if (trigger) trigger.kill();
                  });
                  scrollTriggers.current = [];
                  
                  // 刷新其余的ScrollTrigger
                  ScrollTrigger.refresh();
            };
      }, [mounted]);

      // 如果组件未挂载，返回空内容
      if (!mounted) return null;

      return (
            <section
                  id="projects"
                  ref={sectionRef}
                  className="min-h-screen w-full bg-gradient-to-b from-background to-background/80 transition-colors duration-300 py-20 relative overflow-hidden"
            >
                  {/* 装饰性背景元素 */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* 大圆形 */}
                        <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>
                        {/* 多边形 */}
                        <div className="absolute top-[30%] -left-[5%] w-[30%] h-[30%] bg-gradient-to-r from-pink-500/5 to-orange-500/5 blur-3xl"
                              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                        {/* 小圆形组 */}
                        <div className="absolute bottom-[10%] right-[15%] w-[15%] h-[15%] rounded-full bg-gradient-to-r from-green-500/5 to-teal-500/5 blur-2xl"></div>
                        <div className="absolute bottom-[5%] right-[5%] w-[8%] h-[8%] rounded-full bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-xl"></div>
                  </div>

                  <div className="container mx-auto px-4 relative z-10">
                        {/* 标题部分 */}
                        <div className="text-center mb-16">
                              <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="inline-block mb-4"
                              >
                                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium
                                          ${theme === 'dark' 
                                                ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                          我们的作品
                                    </span>
                              </motion.div>
                              
                              <h2
                                    ref={titleRef}
                                    className={`text-4xl md:text-5xl font-bold 
                                          ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                              >
                                    <span className="relative">
                                          创意 
                                          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                                    </span>
                                    <span className="mx-2">&</span> 
                                    <span className="relative">
                                          技术
                                          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500"></span>
                                    </span>
                                    <span className="mx-2">的融合</span>
                              </h2>
                              
                              <p className={`mt-4 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    每一个项目都是我们团队创意和技术能力的结晶，探索无限可能，创造有价值的体验
                              </p>
                        </div>

                        {/* 项目展示网格 - 采用交错的模式 */}
                        <div 
                              ref={projectsRef} 
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                        >
                              {projects.map((project, index) => (
                                    <ProjectCard 
                                          key={index}
                                          project={project}
                                          index={index}
                                          theme={theme}
                                    />
                              ))}
                        </div>

                        {/* 更多项目按钮 */}
                        <div className="flex justify-center mt-16">
                              <Magnet>
                                    <Button 
                                          size="lg" 
                                          className={`group rounded-full ${
                                                theme === 'dark' 
                                                      ? 'bg-white text-gray-900 hover:bg-gray-100' 
                                                      : 'bg-gray-900 text-white hover:bg-gray-800'
                                          }`}
                                          onClick={() => window.open('/projects', '_self')}
                                    >
                                          查看全部项目
                                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                              </Magnet>
                        </div>

                        {/* <div ref={demoRef} className="mt-24">
                              <AiChatSimulator />
                        </div> */}
                  </div>
            </section>
      );
})

ProjectsSection.displayName = "ProjectsSection"
