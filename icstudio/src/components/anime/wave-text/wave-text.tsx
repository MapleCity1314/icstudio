"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface WaveTextProps {
  text?: string
  className?: string
}

export default function WaveText({ text = "", className = "" }: WaveTextProps) {
  // Initialize with empty array if text is undefined
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    // Only update if text exists and is different from current
    if (text) {
      setCharacters(Array.from(text))
    }
  }, [text])

  // Return early if no characters
  if (!characters.length) return null

  return (
    <div className={`inline-flex flex-wrap gap-[1px] ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="relative inline-block font-semibold text-transparent bg-clip-text"
          style={{
            background: "linear-gradient(180deg, #67e8f9 0%, #22d3ee 100%)",
            WebkitBackgroundClip: "text",
            textShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
          }}
          animate={{
            y: [0, -4, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.1,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  )
}
