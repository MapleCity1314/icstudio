"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FeaturedProjectProps {
  title: string
  description: string
  image: string
  categories: string[]
}

export function FeaturedProject({ title, description, image, categories }: FeaturedProjectProps) {
  return (
    <motion.div
      whileHover={{ scale: 0.99 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={1920}
          height={1080}
          unoptimized={true}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 md:p-8 flex flex-col justify-end">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category, index) => (
            <Badge key={index} variant="outline" className="bg-black/50 text-white border-white/20">
              {category}
            </Badge>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-medium text-white mb-2">{title}</h2>
        <p className="text-gray-300 max-w-2xl mb-4">{description}</p>

        <Link href="#" className="flex items-center text-white font-medium group/link">
          <span>查看项目</span>
          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </Link>
      </div>
    </motion.div>
  )
}
