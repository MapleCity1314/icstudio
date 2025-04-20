'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
//import RotatingText from '@/components/anime/RotatingText/RotatingText';

interface LogoProps {
      size?: 'sm' | 'md' | 'lg';
      className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
      const { theme, resolvedTheme } = useTheme();
      const [mounted, setMounted] = useState(false);

      useEffect(() => {
            setMounted(true);
      }, []);

      // 根据size属性确定字体大小
      const getFontSize = () => {
            switch (size) {
                  case 'sm':
                        return 'text-xl';
                  case 'lg':
                        return 'text-4xl';
                  case 'md':
                  default:
                        return 'text-2xl';
            }
      };

      // 根据size属性确定图标大小
      const getIconSize = () => {
            switch (size) {
                  case 'sm':
                        return 32;
                  case 'lg':
                        return 64;
                  case 'md':
                  default:
                        return 48;
            }
      };

      // 当前使用的主题
      const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'dark';
      
      // 预先计算图标宽高，避免布局偏移
      const iconWidth = getIconSize() * 3.3;
      const iconHeight = getIconSize() * 1.0;

      return (
            <Link href="/">
                  <div
                        className={`inline-flex items-center gap-3 ${getFontSize()} font-bold tracking-tight ${className}`}
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                        {/* Logo图标 - 完全透明但有固定尺寸 */}
                        <div 
                              className="relative flex items-center justify-center"
                              style={{ 
                                    width: iconWidth, 
                                    height: iconHeight,
                                    backgroundColor: 'transparent'
                              }}
                        >
                              <Image
                                    src={currentTheme === 'dark' ? '/logo/loome-w-logo.svg' : '/logo/loome-b-logo.svg'}
                                    alt="InfinityCreators Logo"
                                    width={iconWidth}
                                    height={iconHeight}
                                    priority={true}
                                    className="object-contain"
                              />
                        </div>

                        {/* 文字区域 */}
                        <div className="flex items-center space-x-2">
                              {/* RotatingText组件
                              <div className={`${getTextSize()} font-medium`}>
                                    <strong>
                                          <RotatingText
                                                texts={['Thinking', 'Creating', 'Coding', 'Join us!']}
                                                mainClassName={`px-2 sm:px-2 md:px-3 ${
                                                      theme === 'bg-gradient-to-r from-cyan-400 to-blue-500'
                                                } text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg`}
                                                staggerFrom={'last'}
                                                initial={{ y: '100%' }}
                                                animate={{ y: 0 }}
                                                exit={{ y: '-120%' }}
                                                staggerDuration={0.025}
                                                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                                rotationInterval={2000}
                                          />
                                    </strong>
                              </div> */}
                        </div>
                  </div>
            </Link>
      );
}
