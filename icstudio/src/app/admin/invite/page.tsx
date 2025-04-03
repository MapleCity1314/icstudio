"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Copy, Trash2 } from "lucide-react"

export default function InvitePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession()
  const [inviteCodes, setInviteCodes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // 获取邀请码列表
  const fetchInviteCodes = async () => {
    try {
      const res = await fetch('/api/admin/invite')
      const data = await res.json()
      if (res.ok) {
        setInviteCodes(data)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
        console.error(error)
      toast.error("获取邀请码列表失败")
    }
  }

  // 生成新的邀请码
  const generateInviteCode = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/invite', {
        method: 'POST'
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("邀请码生成成功")
        fetchInviteCodes()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
        console.error(error)
      toast.error("生成邀请码失败")
    } finally {
      setIsLoading(false)
    }
  }

  // 删除邀请码
  const deleteInviteCode = async (code: string) => {
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'DELETE',
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("删除成功")
        fetchInviteCodes()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
        console.error(error)
      toast.error("删除失败")
    }
  }

  // 复制邀请码
  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("邀请码已复制到剪贴板")
  }

  useEffect(() => {
    fetchInviteCodes()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>团队邀请码管理</CardTitle>
          <CardDescription>
            生成邀请码邀请团队成员加入，邀请码有效期为24小时
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={generateInviteCode} 
              disabled={isLoading}
            >
              生成新邀请码
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>邀请码</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>剩余有效期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                inviteCodes.map((item: any) => (
                  <TableRow key={item.code}>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell>
                      {new Date(item.data.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {Math.floor(item.expiresIn / 3600)}小时
                      {Math.floor((item.expiresIn % 3600) / 60)}分钟
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyInviteCode(item.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteInviteCode(item.code)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 