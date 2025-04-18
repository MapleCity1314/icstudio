"use client"

import { motion, Variants, AnimationControls } from "framer-motion"

type ContactMode = "collaborate" | "join" | "message"

type ModeSelectorProps = {
  mode: ContactMode
  setMode: (mode: ContactMode) => void
  controls: AnimationControls
}

// 按钮动画变体
const buttonVariants: Variants = {
  initial: { opacity: 0.3, y: 20 },
  animate: (custom) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      delay: custom * 0.1
    } 
  }),
  hover: { 
    scale: 1.02, 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  inactive: {
    opacity: 0.3,
    scale: 1,
    transition: { duration: 0.3 }
  },
  active: {
    opacity: 1,
    scale: 1.02,
    transition: { duration: 0.3 }
  }
}

// 渐入向上的错开动画
const fadeInUpStagger: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      delay: custom * 0.1
    } 
  })
}

// 标题动画
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1] 
    } 
  }
}

const ModeSelector = ({ mode, setMode, controls }: ModeSelectorProps) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        className="mb-16"
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-center">
          您想与我们交流什么？
        </h1>
        <p className="text-sm uppercase tracking-wider text-center">联系我们</p>
      </motion.div>

      {/* 模式选择 */}
      <div className="space-y-8 max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate={controls}
          custom={0}
          variants={fadeInUpStagger}
          className="relative"
        >
          <motion.button
            onClick={() => setMode("collaborate")}
            className="text-3xl md:text-4xl lg:text-5xl font-light w-full text-center bg-transparent relative"
            initial="initial"
            animate={mode === "collaborate" ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            custom={0}
          >
            与我们合作
            {mode === "collaborate" && (
              <motion.div 
                className="h-0.5 bg-black absolute -bottom-2 left-0 right-0 w-0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}
          </motion.button>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate={controls}
          custom={1}
          variants={fadeInUpStagger}
          className="relative"
        >
          <motion.button
            onClick={() => setMode("join")}
            className="text-3xl md:text-4xl lg:text-5xl font-light w-full text-center bg-transparent relative"
            initial="initial"
            animate={mode === "join" ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            custom={1}
          >
            加入团队
            {mode === "join" && (
              <motion.div 
                className="h-0.5 bg-black absolute -bottom-2 left-0 right-0 w-0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}
          </motion.button>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate={controls}
          custom={2}
          variants={fadeInUpStagger}
          className="relative"
        >
          <motion.button
            onClick={() => setMode("message")}
            className="text-3xl md:text-4xl lg:text-5xl font-light w-full text-center bg-transparent relative"
            initial="initial"
            animate={mode === "message" ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            custom={2}
          >
            打个招呼
            {mode === "message" && (
              <motion.div 
                className="h-0.5 bg-black absolute -bottom-2 left-0 right-0 w-0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default ModeSelector 