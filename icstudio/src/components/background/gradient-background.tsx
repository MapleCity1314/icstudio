"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function GradientBackground() {
  const { theme } = useTheme();

  return (
    <>
      <div 
        className={cn(
          "absolute inset-0",
          theme === 'dark' 
            ? "bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]" 
            : "bg-gradient-to-br from-indigo-500/[0.1] via-transparent to-rose-500/[0.1]",
          "blur-3xl"
        )} 
      />
      <div 
        className={cn(
          "absolute inset-0",
          theme === 'dark' 
            ? "bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" 
            : "bg-gradient-to-t from-white via-transparent to-white/80",
          "pointer-events-none"
        )} 
      />
    </>
  );
}
