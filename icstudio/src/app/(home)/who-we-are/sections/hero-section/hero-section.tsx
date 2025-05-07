"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import TimelineSection from "../timeline-section/server-timeline";

const HeroSection = () => {
      const { theme } = useTheme();
      const [mounted, setMounted] = useState(false);

      useEffect(() => {
            setMounted(true);
      }, []);

      if (!mounted) return null;

      return (
            <div className="flex flex-col items-center justify-center h-screen">
                  <div className="absolute top-0 left-0 w-full h-full z-0 bg-background">
                        <TimelineSection />
                  </div>
            </div>
      );
}

export default HeroSection;
