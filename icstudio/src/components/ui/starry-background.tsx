"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

interface StarryBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleSpeed?: number;
  particleOpacity?: number;
}

export const StarryBackground: React.FC<StarryBackgroundProps> = ({
  particleCount = 100,
  particleSize = 2,
  particleSpeed = 1,
  particleOpacity = 0.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      update: () => void;
      draw: () => void;
    }[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * particleSize + 0.1;
        this.speedX = (Math.random() * 2 - 1) * particleSpeed;
        this.speedY = (Math.random() * 2 - 1) * particleSpeed;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        const color = theme === "dark" ? "255, 255, 255" : "0, 0, 0";
        ctx.fillStyle = `rgba(${color}, ${particleOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [theme, particleCount, particleSize, particleSpeed, particleOpacity]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};