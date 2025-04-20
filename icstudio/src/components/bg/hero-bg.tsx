'use client';

import React from 'react';
import { useEffect, useRef, useCallback } from 'react';

interface circles {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      color: string;
}

// 定义组件接口类型
interface HeroBgProps {
      children: React.ReactNode;
      // 圆形大小配置
      minRadius?: number; // 最小圆半径
      maxRadius?: number; // 最大圆半径
      // 动画速度控制
      speedFactor?: number; // 速度系数，值越大移动越快
      // 其他可选配置
      colors?: string[]; // 自定义颜色
      className?: string; // 允许额外的类名
}

const HeroBg = React.memo(({
      children,
      minRadius = 200, // 默认最小圆半径
      maxRadius = 400, // 默认最大圆半径
      speedFactor = 1.8, // 默认速度系数，提高为原来的1.8倍
      colors = ['#836FFF', '#15F5BA', '#69F2FF'], // 默认颜色
      className = '', // 默认空类名
}: HeroBgProps) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const circlesRef = useRef<circles[]>([]);
      const animationFrameRef = useRef<number | undefined>(undefined);
      const isInitializedRef = useRef<boolean>(false);

      function randomBetween(min: number, max: number) {
            return Math.random() * (max - min) + min;
      }

      // 根据屏幕宽度计算圆形的合适半径
      const calculateRadius = useCallback(
            (screenWidth: number) => {
                  // 设置屏幕宽度范围
                  const minScreenWidth = 320;
                  const maxScreenWidth = 1920;

                  // 限制屏幕宽度在范围内
                  const clampedWidth = Math.max(minScreenWidth, Math.min(screenWidth, maxScreenWidth));

                  // 计算比例尺缩放系数
                  const scale = (clampedWidth - minScreenWidth) / (maxScreenWidth - minScreenWidth);

                  // 在大屏幕上使用非线性缩放，让圆形在大屏幕上相对小一些
                  const nonLinearScale = Math.pow(scale, 1.5);

                  // 计算半径，根据传入的最小和最大半径
                  return minRadius + nonLinearScale * (maxRadius - minRadius);
            },
            [minRadius, maxRadius],
      );

      const initCircles = useCallback(() => {
            if (!canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            circlesRef.current = [];

            const baseCount = Math.max(5, Math.min(20, Math.floor(window.innerWidth / 150)));

            for (let i = 0; i < baseCount; i++) {
                  const baseRadius = calculateRadius(window.innerWidth);
                  const radius = randomBetween(baseRadius * 0.7, baseRadius * 1.3);

                  const x = randomBetween(radius, canvas.width - radius);
                  const y = randomBetween(radius, canvas.height - radius);

                  const baseSpeed = Math.min(1, window.innerWidth / 1000) * speedFactor;
                  const dx = randomBetween(window.innerWidth / -4000, window.innerWidth / 4000) * baseSpeed;
                  const dy = randomBetween(window.innerWidth / -4000, window.innerWidth / 4000) * baseSpeed;

                  const color = colors[Math.floor(Math.random() * colors.length)];

                  circlesRef.current.push({ x, y, radius, dx, dy, color });
            }
      }, [calculateRadius, speedFactor, colors]);

      const drawCircles = useCallback((circle: circles) => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = circle.color;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();
      }, []);

      const animate = useCallback(() => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            circlesRef.current.forEach((circle) => {
                  if (circle.x + circle.radius > canvasRef.current!.width || circle.x - circle.radius < 0) {
                        circle.dx = -circle.dx;
                  }

                  if (circle.y + circle.radius > canvasRef.current!.height || circle.y - circle.radius < 0) {
                        circle.dy = -circle.dy;
                  }
                  circle.x += circle.dx;
                  circle.y += circle.dy;

                  drawCircles(circle);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
      }, [drawCircles]);

      const resizeCanvas = useCallback(() => {
            if (!canvasRef.current) return;

            const currentWidth = window.innerWidth;
            canvasRef.current.width = currentWidth * 1.2;
            canvasRef.current.height = window.innerHeight;
            
            // 只有在初始化时或窗口大小真正改变时才重新初始化圆圈
            if (!isInitializedRef.current) {
                  initCircles();
                  isInitializedRef.current = true;
            }
      }, [initCircles]);

      useEffect(() => {
            if (!canvasRef.current) return;

            // 确保只初始化一次
            if (!isInitializedRef.current) {
                  resizeCanvas();
                  initCircles();
                  animate();
                  isInitializedRef.current = true;
            }

            const handleResize = () => {
                  resizeCanvas();
                  // 窗口大小变化时重新初始化圆圈
                  initCircles();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                  window.removeEventListener('resize', handleResize);
                  if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                  }
                  isInitializedRef.current = false;
            };
      }, [animate, initCircles, resizeCanvas]);

      return (
            <div className={`h-screen min-h-[30em] flex justify-center items-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[hsla(0,0%,41%,0.25)] before:backdrop-blur-[70px] before:top-0 before:left-0 before:w-full before:h-full before:z-[1] before:mix-blend-overlay ${className}`}>
                  <canvas
                        ref={canvasRef}
                        id="hero-bg"
                        width={500}
                        height={500}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-screen pointer-events-none"
                  ></canvas>
                  <div className="relative z-10 w-full h-full">
                        {children}
                  </div>
            </div>
      );
});

// 显式设置displayName，用于调试
HeroBg.displayName = 'HeroBg';

export default HeroBg;
