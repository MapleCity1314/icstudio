"use client"

import { motion } from "framer-motion"
import { ServiceCard } from "./service-card"
import { services } from "./data"

export default function WhatWeDo() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-sans">
            我们的服务
            <span className="block text-primary">为您提供。</span>
          </h1>
          <p className="text-lg max-w-md text-muted-foreground">
            我们创造卓越的数字体验，转变企业并取悦用户。我们的专业知识涵盖多个领域，提供全面的解决方案。
          </p>
        </div>

        <div className="relative">
          <div className="absolute -z-10 w-[300px] h-[300px] rounded-full bg-primary/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-lg max-w-md ml-auto text-muted-foreground">
            我们的专家团队将创造力与技术卓越结合起来，提供在当今竞争激烈的数字环境中脱颖而出的解决方案。
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((service) => (
          <ServiceCard key={service.id} title={service.title} description={service.description} icon={service.icon} />
        ))}
      </motion.div>
    </section>
  )
}
