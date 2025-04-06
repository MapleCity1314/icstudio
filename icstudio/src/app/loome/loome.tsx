"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect } from "react";

const Loome = () => {
    // 下载按钮动画效果的引用
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // 添加鼠标跟踪效果
    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            // 计算鼠标相对于按钮中心的位置
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // 根据鼠标位置应用轻微的倾斜变换
            const tiltX = y / 10;
            const tiltY = -x / 10;
            
            // 应用变换
            button.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
            
            // 更新光影效果
            const shineX = (x / rect.width) * 100 + 50;
            const shineY = (y / rect.height) * 100 + 50;
            button.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.2) 0%, rgba(0,0,255,0.5) 50%, rgba(0,0,128,0.7) 100%)`;
        };
        
        const handleMouseLeave = () => {
            button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            button.style.background = 'linear-gradient(135deg, #1e40af, #3b82f6, #1e3a8a)';
        };
        
        const handleMouseDown = () => {
            button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(0.95)';
        };
        
        const handleMouseUp = () => {
            button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1.05)';
        };
        
        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);
        button.addEventListener('mousedown', handleMouseDown);
        button.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
            button.removeEventListener('mousedown', handleMouseDown);
            button.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    
    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* 内容覆盖层 */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center text-white">
                {/* Logo */}
                <div className="mb-10">
                    <Image 
                        src="/loome/loome-w-logo.svg" 
                        alt="Loome Logo" 
                        width={240} 
                        height={80} 
                        className="drop-shadow-lg"
                        priority
                    />
                </div>
                
                {/* 下载按钮 */}
                <button 
                    ref={buttonRef}
                    className="group relative flex items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white font-bold py-4 px-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-700/40 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-gray-500/10 hover:shadow-xl"
                    style={{
                        background: 'linear-gradient(135deg, #111827, #374151, #111827)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    {/* 内部发光效果 */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></span>
                    
                    {/* 图标和文字 */}
                    <Download className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:translate-y-1" />
                    <span className="text-lg tracking-wide">立刻下载</span>
                    
                    {/* 按钮后光晕 */}
                    <div className="absolute -right-3 -top-3 w-24 h-8 bg-gray-400 blur-[20px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="absolute -left-3 -bottom-3 w-24 h-8 bg-gray-600 blur-[20px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </button>
                
                {/* 版本信息 */}
                <div className="text-sm text-gray-200 max-w-md space-y-1 mt-10 backdrop-blur-sm bg-black/10 px-6 py-3 rounded-full">
                    <p>版本 1.0.0</p>
                    <p>推荐使用 Windows 10 及以上 64位系统</p>
                </div>
            </div>
        </div>
    );
};

export default Loome;
