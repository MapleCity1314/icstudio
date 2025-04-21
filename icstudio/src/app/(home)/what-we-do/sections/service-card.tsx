"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
}

export function ServiceCard({ title, description, icon: Icon, className }: ServiceCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={item}>
      <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md group h-full", className)}>
        <CardHeader className="p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
            <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
          </div>
          <h3 className="text-xl font-medium">{title}</h3>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
