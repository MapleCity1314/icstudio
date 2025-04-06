"use client";

import { motion } from "framer-motion";
import { Pacifico } from 'next/font/google';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";
import { ParticlesCanvas } from "@/components/background/particles-canvas";
import { GradientBackground } from "@/components/background/gradient-background";
import { ElegantShapesContainer } from "@/components/background/elegant-shapes";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

export default function HeroGeometric({
  badge = "IC Studio",
  title1 = "尽所能，创所想",
  title2 = "Infinity Creators",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 在客户端加载完成后设置mounted为true
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  // 防止水合不匹配
  if (!mounted) {
    return <div className="min-h-screen w-full"></div>;
  }
  
  return (
    <div className={cn(
      "relative min-h-screen w-full flex items-center justify-center overflow-hidden",
      theme === 'dark' ? "bg-[#030303]" : "bg-white"
    )}>
      <ParticlesCanvas />
      <GradientBackground />
      <ElegantShapesContainer />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 md:mb-12",
              theme === 'dark' 
                ? "bg-white/[0.03] border border-white/[0.08]" 
                : "bg-black/[0.03] border border-black/[0.08]"
            )}
          >
            <Image
              src="https://kokonutui.com/logo.svg"
              alt="Kokonut UI"
              width={20}
              height={20}
            />
            <span className={cn(
              "text-sm tracking-wide",
              theme === 'dark' ? "text-white/60" : "text-black/60"
            )}>
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className={cn(
                "bg-clip-text text-transparent",
                theme === 'dark' 
                  ? "bg-gradient-to-b from-white to-white/80" 
                  : "bg-gradient-to-b from-black to-black/80"
              )}>
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                  theme === 'dark' 
                    ? "bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300" 
                    : "bg-gradient-to-r from-indigo-500 via-black/90 to-rose-500",
                  pacifico.className,
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className={cn(
              "text-base sm:text-lg md:text-xl mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4",
              theme === 'dark' ? "text-white/40" : "text-black/40"
            )}>
              我们是由大学生组成的团队，我们致力于打造AI高度融合的产品，致力于用AI为各行各业赋能.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
