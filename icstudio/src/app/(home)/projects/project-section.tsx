"use client"

import { motion } from "framer-motion"
import { ProjectCategory } from "./project-category"
import { FeaturedProject } from "./featured-project"
import { projects, categories } from "./data"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="w-full min-h-screen">

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="aspect-square bg-neutral-100 rounded-md overflow-hidden">
            <Image src="/abstract-monochrome-elements.png" alt="项目展示" className="w-full h-full object-cover" width={1920} height={1080} unoptimized={true} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
            Make it like
            <span className="block">Really good</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-md">
            探索我们的创意作品集，展示我们如何通过创新技术和设计为客户创造独特的数字体验。
          </p>
        </motion.div>
      </div>

      {/* Featured Project Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="container mx-auto px-4 md:px-8 py-16 relative"
      >
        <div className="relative">
          <FeaturedProject
            title={projects[currentIndex].title}
            description={projects[currentIndex].description}
            image={projects[currentIndex].image}
            categories={projects[currentIndex].categories}
          />

          {/* 导航指示器 */}
          <div className="flex justify-center mt-6 gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-gray-500/50"
                }`}
                aria-label={`转到项目 ${index + 1}`}
              />
            ))}
          </div>

          {/* 导航按钮 */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10"
            aria-label="上一个项目"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10"
            aria-label="下一个项目"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </motion.div>

      {/* Project Categories */}
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ProjectCategory title={category.title} projects={category.projects} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 md:px-8 py-24 md:py-32"
      >
        <div className="flex flex-col items-start">
          <h2 className="text-5xl md:text-6xl font-light tracking-tight">
            与我们合作
            <span className="block">创造精彩。</span>
          </h2>
          <Link
            href="/contact"
            className="mt-8 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors rounded-md text-lg font-medium"
          >
            联系我们
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
