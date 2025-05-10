"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "错误",
        description: "请输入您的电子邮件地址",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "成功！",
      description: "您已成功订阅我们的通讯！",
    })

    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">电子邮件地址</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-yellow-300 focus:border-purple-500 rounded-md"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 rounded-md" disabled={isSubmitting}>
        {isSubmitting ? "订阅中..." : "订阅"}
      </Button>
    </form>
  )
}
