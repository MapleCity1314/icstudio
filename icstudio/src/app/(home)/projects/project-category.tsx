"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Project {
  id: number
  title: string
}

interface ProjectCategoryProps {
  title: string
  projects: Project[]
}

export function ProjectCategory({ title, projects }: ProjectCategoryProps) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">{title}</h3>
      <ul className="space-y-4">
        {projects.map((project) => (
          <motion.li key={project.id} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link
              href="#"
              className="group flex items-center justify-between py-2 border-b border-white/10 hover:border-white/30 transition-colors"
            >
              <span className="text-lg font-light">{project.title}</span>
              <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
