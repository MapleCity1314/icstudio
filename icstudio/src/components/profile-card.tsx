"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoonIcon, SunIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react"
import { useTheme } from "next-themes"

// 用户类型定义
type User = {
  username: string
  email: string
  phone: string
  avatarUrl?: string
}

export default function ProfileCard() {
  // 主题切换
  const { theme, setTheme } = useTheme()

  // 用户数据状态
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟从API获取用户数据
  useEffect(() => {
    // 模拟API调用延迟
    const timer = setTimeout(() => {
      // 模拟用户数据
      const userData: User = {
        username: "张三",
        email: "zhangsan@example.com",
        phone: "13800138000",
        avatarUrl: "",
      }
      setUser(userData)
      setEditedUser(userData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 处理编辑表单变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [name]: value,
      })
    }
  }

  // 保存编辑
  const handleSave = () => {
    if (editedUser) {
      setUser(editedUser)
      setIsEditing(false)
      // 这里可以添加API调用来保存数据
      console.log("保存用户数据:", editedUser)
    }
  }

  // 取消编辑
  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  // 获取头像回退显示
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "用"
  }

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-lg">加载中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">个人资料</CardTitle>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {user && (
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.username} />
              ) : (
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(user.username)}
                </AvatarFallback>
              )}
            </Avatar>

            {isEditing ? (
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    name="username"
                    value={editedUser?.username || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">电子邮箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editedUser?.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input id="phone" name="phone" value={editedUser?.phone || ""} onChange={handleInputChange} />
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-muted-foreground">用户名</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-muted-foreground">电子邮箱</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-muted-foreground">手机号码</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel}>
              <XIcon className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button onClick={handleSave}>
              <CheckIcon className="mr-2 h-4 w-4" />
              保存
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={() => setIsEditing(true)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            编辑资料
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

