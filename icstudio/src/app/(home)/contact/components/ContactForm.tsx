"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/ui/form-input"
import { toast } from "@/components/ui/use-toast"
import { useDB, DBConnectionStatus } from "@/hooks/use-db"
import { FEEDBACK_MODEL_NAME, feedbackSchema } from "@/lib/db/schema/feedback"

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
  remaining?: number
  data?: unknown
}

// 错误对象接口
interface FormErrors {
  name?: string
  email?: string
  message?: string
  address?: string
  company?: string
  phone?: string
  portfolio?: string
  general?: string
}

const ContactForm = ({ mode }: ContactFormProps) => {
  // 获取DB服务
  const { 
    registerSchema, 
    connectionStatus, 
    error: dbError 
  } = useDB();

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
  const [remainingSubmissions, setRemainingSubmissions] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  
  // DOM引用
  const formRef = useRef<HTMLFormElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const planeRef = useRef<SVGSVGElement | null>(null)

  // 注册Schema
  useEffect(() => {
    registerSchema(FEEDBACK_MODEL_NAME, feedbackSchema);
  }, [registerSchema]);

  // 获取初始剩余提交次数
  useEffect(() => {
    const fetchRemainingSubmissions = async () => {
      try {
        const response = await fetch('/api/contact')
        const data = await response.json() as ApiResponse
        
        if (data.remaining !== undefined) {
          setRemainingSubmissions(data.remaining)
        }
      } catch (error) {
        console.error("获取剩余提交次数失败:", error)
      }
    }

    fetchRemainingSubmissions()
  }, [mode])

  // 监听数据库连接状态
  useEffect(() => {
    if (connectionStatus === DBConnectionStatus.ERROR && dbError) {
      console.error("数据库连接错误:", dbError);
      toast({
        title: "数据库连接错误",
        description: "无法连接到数据库，请稍后再试",
        variant: "destructive",
      });
    }
  }, [connectionStatus, dbError]);

  // 验证表单字段
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "请输入您的姓名" : undefined
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return value.trim() === "" 
          ? "请输入您的邮箱" 
          : !emailRegex.test(value) 
            ? "请输入有效的邮箱地址" 
            : undefined
      case "message":
        return value.trim() === "" ? "请输入消息内容" : undefined
      case "phone":
        if (mode === "join" && value.trim() === "") {
          return "请输入您的联系电话"
        }
        return undefined
      default:
        return undefined
    }
  }

  // 处理表单输入更改
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    
    // 清除特定字段的错误
    const error = validateField(id, value)
    setFieldErrors(prev => ({
      ...prev,
      [id]: error
    }))
    
    // 清除表单总体错误
    if (formError) {
      setFormError(null)
    }
  }

  // 验证整个表单
  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    // 验证必填字段
    Object.entries(formData).forEach(([key, value]) => {
      // 只验证必填字段
      if (
        key === "name" || 
        key === "email" || 
        key === "message" || 
        (key === "phone" && mode === "join")
      ) {
        const error = validateField(key, value as string)
        if (error) {
          errors[key as keyof FormErrors] = error
          isValid = false
        }
      }
    })

    setFieldErrors(errors)
    return isValid
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!validateForm()) {
      // 如果表单验证失败，显示错误并停止
      setFormError("表单填写有误，请检查后重试")
      toast({
        title: "验证失败",
        description: "请检查表单中的错误信息",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    setFormError(null)

    try {
      // 准备提交数据
      const submitData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        mode,
        ...(mode === "collaborate" && {
          address: formData.address,
          company: formData.company
        }),
        ...(mode === "join" && {
          phone: formData.phone,
          portfolio: formData.portfolio
        })
      }

      // 使用fetch API提交数据到新的API端点
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })
      
      const data = await response.json() as ApiResponse
      
      // 更新剩余提交次数
      if (data.remaining !== undefined) {
        setRemainingSubmissions(data.remaining)
      }
      
      if (data.success) {
        // 表单提交成功
        setIsSubmitted(true)
        
        // 显示成功提示
        toast({
          title: "提交成功",
          description: `${data.message}${data.remaining !== undefined ? `，今日还可提交${data.remaining}次` : ''}`,
        })
        
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
          setFieldErrors({})
        }, 3000)
      } else {
        // 显示错误信息
        setFormError(data.message)
        toast({
          title: "提交失败",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("提交错误:", error)
      setFormError("表单提交失败，请稍后再试")
      toast({
        title: "系统错误",
        description: "提交失败，请稍后再试",
        variant: "destructive",
      })
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
        <FormInput
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          label={placeholder}
          error={fieldErrors[id as keyof FormErrors]}
          className="border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                {remainingSubmissions !== null && (
                  <span className="text-sm font-normal text-gray-500 block mt-2">
                    今日还可提交 {remainingSubmissions} 次
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-10 lg:p-16 pt-4">
              {formError && (
                <div className="bg-red-50 text-red-500 p-4 mb-6 rounded-md">
                  {formError}
                </div>
              )}
              
              {connectionStatus === DBConnectionStatus.ERROR && (
                <div className="bg-yellow-50 text-yellow-500 p-4 mb-6 rounded-md">
                  数据库连接错误，您的表单将通过备用系统提交
                </div>
              )}
              
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
                      {remainingSubmissions !== null && (
                        <span className="block mt-2">
                          今日还可提交 {remainingSubmissions} 次
                        </span>
                      )}
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key={`form-${mode}`}
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
                            {renderInput("address", formData.address || "", "地址", false)}
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
                            {renderInput("company", formData.company || "", "公司", false)}
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
                            {renderInput("portfolio", formData.portfolio || "", "作品集链接", false)}
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
                        {fieldErrors.message && (
                          <div className="text-red-500 text-sm mt-1">
                            {fieldErrors.message}
                          </div>
                        )}
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
                            disabled={isSubmitting || remainingSubmissions === 0}
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              remainingSubmissions === 0 
                                ? 'bg-gray-200 cursor-not-allowed' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            } border-0`}
                            aria-label="发送消息"
                            whileHover={remainingSubmissions === 0 ? {} : { scale: 1.05 }}
                            whileTap={remainingSubmissions === 0 ? {} : { scale: 0.95 }}
                          >
                            {isSubmitting ? (
                              <div className="h-5 w-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                            ) : remainingSubmissions === 0 ? (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM7 11h10v2H7v-2z" 
                                  fill="currentColor"/>
                              </svg>
                            ) : (
                              <motion.div
                                whileHover={{ x: 3, y: -3 }}
                              >
                                <Send ref={planeRef} className="h-5 w-5 text-black" />
                              </motion.div>
                            )}
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