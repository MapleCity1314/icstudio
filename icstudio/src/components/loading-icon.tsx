"use client"

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const LoadingIcon = ({
    isLoading,
    fullScreen = true
}: {
    isLoading: boolean;
    fullScreen?: boolean;
}) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (!isLoading) return null;

    const loadingIconSrc = theme === 'dark' ? "/loading.gif" : "/loading.gif";
    
    return (
        <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
            <div className="relative w-10 h-10 bg-background rounded-full animate-spin">
                <Image 
                    src={loadingIconSrc} 
                    alt="加载中" 
                    fill 
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    )
}

export default LoadingIcon;
