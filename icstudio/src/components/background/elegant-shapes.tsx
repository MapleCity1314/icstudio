"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  darkGradient?: string;
  lightGradient?: string;
}

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient,
  darkGradient = "from-white/[0.08]",
  lightGradient = "from-black/[0.08]",
}: ElegantShapeProps) {
  const { theme } = useTheme();
  
  // Use the provided gradient or choose based on theme
  const gradientClass = gradient || (theme === 'dark' ? darkGradient : lightGradient);
  
  // Border color based on theme
  const borderColor = theme === 'dark' ? "border-white/[0.15]" : "border-black/[0.15]";
  
  // Shadow based on theme
  const shadowColor = theme === 'dark' 
    ? "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]" 
    : "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]";
  
  // After pseudo-element gradient based on theme
  const afterGradient = theme === 'dark'
    ? "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
    : "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),transparent_70%)]";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradientClass,
            "backdrop-blur-[2px] border-2",
            borderColor,
            shadowColor,
            "after:absolute after:inset-0 after:rounded-full",
            afterGradient
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function ElegantShapesContainer() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <ElegantShape
        delay={0.3}
        width={600}
        height={140}
        rotate={12}
        darkGradient="from-indigo-500/[0.15]"
        lightGradient="from-indigo-500/[0.25]"
        className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
      />

      <ElegantShape
        delay={0.5}
        width={500}
        height={120}
        rotate={-15}
        darkGradient="from-rose-500/[0.15]"
        lightGradient="from-rose-500/[0.25]"
        className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
      />

      <ElegantShape
        delay={0.4}
        width={300}
        height={80}
        rotate={-8}
        darkGradient="from-violet-500/[0.15]"
        lightGradient="from-violet-500/[0.25]"
        className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
      />

      <ElegantShape
        delay={0.6}
        width={200}
        height={60}
        rotate={20}
        darkGradient="from-amber-500/[0.15]"
        lightGradient="from-amber-500/[0.25]"
        className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
      />

      <ElegantShape
        delay={0.7}
        width={150}
        height={40}
        rotate={-25}
        darkGradient="from-cyan-500/[0.15]"
        lightGradient="from-cyan-500/[0.25]"
        className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
      />
    </div>
  );
}
