"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ContactMode = "collaborate" | "join" | "message"

type ContactFormProps = {
  mode: ContactMode
}

// 表单动画变体
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    transition: { 
      duration: 0.5,
      ease: [0.33, 0, 0.67, 0]
    }
  }
}

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1]
    }
  }
}

// 表单数据接口
interface FormData {
  name: string
  email: string
  message: string
  address?: string  // 仅用于合作模式
  company?: string  // 仅用于合作模式
  phone?: string    // 仅用于加入模式
  portfolio?: string // 仅用于加入模式
}

// API响应接口
interface ApiResponse {
  success: boolean
  message: string
}

const ContactForm = ({ mode }: ContactFormProps) => {
  // 表单状态
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    address: "",
    company: "",
    phone: "",
    portfolio: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // DOM引用
  const formRef = useRef<HTMLFormElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const planeRef = useRef<SVGSVGElement | null>(null)

  // 处理表单输入更改
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 根据不同的模式构建不同的提交数据
      const submitData: FormData = {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }

      if (mode === "collaborate") {
        submitData.address = formData.address
        submitData.company = formData.company
      } else if (mode === "join") {
        submitData.phone = formData.phone
        submitData.portfolio = formData.portfolio
      }

      // API请求（目前为模拟）
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 处理响应
      const response: ApiResponse = {
        success: true,
        message: "表单提交成功"
      }
      
      if (response.success) {
        setIsSubmitted(true)
        
        // 3秒后重置表单
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            message: "",
            address: "",
            company: "",
            phone: "",
            portfolio: ""
          })
          setIsSubmitted(false)
        }, 3000)
      } else {
        // 处理错误
        console.error("提交失败:", response.message)
      }
    } catch (error) {
      console.error("提交错误:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 根据模式获取标题
  const getTitle = () => {
    switch (mode) {
      case "collaborate":
        return "与我们合作"
      case "join":
        return "加入团队"
      case "message":
        return "打个招呼"
      default:
        return "与我们合作"
    }
  }

  // 渲染输入框组件
  const renderInput = (
    id: string, 
    value: string, 
    placeholder: string,
    required: boolean = true
  ) => {
    return (
      <motion.div 
        className="relative pb-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="border-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* 上半部分白色背景 */}
      <div className="h-1/2 bg-white absolute top-0 left-0 right-0"></div>
      {/* 下半部分黑色背景 */}
      <div className="h-1/2 bg-black absolute bottom-0 left-0 right-0"></div>

      {/* 表单卡片容器 */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-5xl mx-auto transform translate-y-1/4"
          layout
        >
          <Card className="p-0 shadow-xl" style={{ minHeight: '60vh' }}>
            <CardHeader className="p-8 md:p-10 lg:p-16 pb-6">
              <CardTitle className="text-3xl md:text-4xl font-light text-black">
                {getTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-10 lg:p-16 pt-4">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col items-center justify-center py-16"
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: 0.2 
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 13L9 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-light mb-2 text-black"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      消息已发送！
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 text-center max-w-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      感谢您的联系。我们会尽快回复您。
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key={`form-${mode}`} // 添加模式作为键，确保模式变更时重新渲染表单
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={formVariants}
                    layout
                  >
                    {/* 左列 */}
                    <div className="space-y-2">
                      {/* 姓名字段 - 始终显示 */}
                      {renderInput("name", formData.name, "姓名")}

                      {/* 邮箱字段 - 始终显示 */}
                      {renderInput("email", formData.email, "邮箱")}

                      {/* 地址字段 - 仅用于合作 */}
                      <AnimatePresence>
                        {mode === "collaborate" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {renderInput("address", formData.address || "", "地址")}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 公司字段 - 仅用于合作 */}
                      <AnimatePresence>
                        {mode === "collaborate" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {renderInput("company", formData.company || "", "公司")}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 电话字段 - 仅用于加入 */}
                      <AnimatePresence>
                        {mode === "join" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {renderInput("phone", formData.phone || "", "电话")}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 作品集字段 - 仅用于加入 */}
                      <AnimatePresence>
                        {mode === "join" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {renderInput("portfolio", formData.portfolio || "", "作品集链接")}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 右列 - 消息字段 */}
                    <div className="md:row-span-2 flex flex-col">
                      <motion.div 
                        className="relative pb-2 h-full flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="消息内容"
                          required
                          className="w-full h-full min-h-[200px] border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-transparent py-2 placeholder-gray-500 text-black resize-none"
                        />
                      </motion.div>

                      {/* 发送按钮 */}
                      <div className="flex justify-end mt-8">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          <motion.button
                            ref={sendButtonRef}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 border-0 flex items-center justify-center"
                            aria-label="发送消息"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              whileHover={{ x: 3, y: -3 }}
                            >
                              <Send ref={planeRef} className="h-5 w-5 text-black" />
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactForm 