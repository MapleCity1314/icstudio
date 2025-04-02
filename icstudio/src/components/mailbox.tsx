"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MailboxProps {
  isSubmitting: boolean
  onAnimationComplete?: () => void
}

const Mailbox = ({ isSubmitting, onAnimationComplete }: MailboxProps) => {
  return (
    <motion.div
      initial={{ y: 200 }}
      animate={{
        y: isSubmitting ? [200, 0, 200] : 200,
      }}
      transition={{
        duration: 2,
        times: [0, 0.4, 1],
      }}
      className="w-24 h-32"
    >
      {/* 信封动画 */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: -200 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-100, -50, 0],
            x: [-200, -100, 0],
          }}
          transition={{
            duration: 1,
            delay: 0.6,
            times: [0, 0.3, 0.7, 1],
          }}
          onAnimationComplete={onAnimationComplete}
          className="absolute w-12 h-8 bg-primary/80 rounded-sm transform -rotate-12"
        >
          <div className="absolute inset-0 border-2 border-background/20 rounded-sm" />
        </motion.div>
      )}

      {/* 信箱 */}
      <div className="relative w-full h-full">
        {/* 信箱盖子 */}
        <motion.div
          animate={{
            rotateX: isSubmitting ? [0, 45, 0] : 0,
          }}
          transition={{
            duration: 1,
            delay: 0.6,
            times: [0, 0.5, 1],
          }}
          className="absolute top-0 w-full h-1/3 bg-primary origin-bottom"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 border-2 border-background/20" />
        </motion.div>

        {/* 信箱主体 */}
        <div
          className={cn(
            "absolute bottom-0 w-full h-2/3 bg-primary transition-colors duration-300",
            isSubmitting && "bg-primary/80"
          )}
        >
          <div className="absolute inset-0 border-2 border-background/20" />
          {/* 投信口 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-background/20" />
        </div>
      </div>
    </motion.div>
  )
}

export default Mailbox