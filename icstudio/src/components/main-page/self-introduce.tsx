"use client";

import React from "react";
import { AnimatedTestimonials } from "../ui/animated-testimonials";
import { StarryBackground } from "../ui/starry-background";
import { team } from "@/data/introduce";

export const AnimatedTestimonialsDemo = () => {
  return (
    <div className="relative min-h-screen w-full">
      <StarryBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <div className="relative z-10">
        <AnimatedTestimonials testimonials={team} />
      </div>
    </div>
  );
};
