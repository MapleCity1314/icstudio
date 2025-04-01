import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { addToCache, getFromCache } from "@/lib/db/redis/use-cache"
import redis from "@/lib/db/redis/redis"
import { nanoid } from 'nanoid'
import { authOptions } from "../../auth/[...nextauth]/route"

// 生成邀请码
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("当前 Session:", {
      session: session,
      user: session?.user,
      role: session?.user?.role,
      isAdmin: session?.user?.role === 'admin'
    })

    if (!session) {
      console.log("Session 不存在")
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      )
    }

    if (!session.user) {
      console.log("Session 中没有用户信息")
      return NextResponse.json(
        { error: "用户信息不存在" },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      console.log("用户角色不是 admin:", session.user.role)
      return NextResponse.json(
        { error: "无权限执行此操作" },
        { status: 403 }
      )
    }

    // 生成6位邀请码
    const inviteCode = nanoid(6).toUpperCase()
    console.log("生成邀请码:", inviteCode)
    
    // 存储到Redis，设置24小时过期
    await addToCache(
      `invite:${inviteCode}`, 
      {
        createdBy: session.user.id,
        createdAt: new Date().toISOString()
      },
      60 * 60 * 24 // 24小时
    )

    return NextResponse.json({
      code: inviteCode
    })
  } catch (error) {
    console.error("生成邀请码失败:", error)
    return NextResponse.json(
      { error: "生成邀请码失败" },
      { status: 500 }
    )
  }
}

// 获取所有有效的邀请码
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("GET 请求 Session:", {
      session: session,
      user: session?.user,
      role: session?.user?.role
    })

    if (session?.user?.role !== 'admin') {
      console.log("GET 请求权限检查失败:", session?.user?.role)
      return NextResponse.json(
        { error: "无权限执行此操作" },
        { status: 403 }
      )
    }

    // 获取所有invite:开头的key
    const keys = await redis.keys('invite:*')
    console.log("找到的邀请码 keys:", keys)

    const inviteCodes = await Promise.all(
      keys.map(async (key: string) => {
        const data = await getFromCache(key)
        const ttl = await redis.ttl(key)
        return {
          code: key.replace('invite:', ''),
          data,
          expiresIn: ttl
        }
      })
    )

    console.log("处理后的邀请码列表:", inviteCodes)

    return NextResponse.json(inviteCodes)
  } catch (error) {
    console.error("获取邀请码列表失败:", error)
    return NextResponse.json(
      { error: "获取邀请码列表失败" },
      { status: 500 }
    )
  }
}

// 删除邀请码
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("DELETE 请求 Session:", {
      session: session,
      user: session?.user,
      role: session?.user?.role
    })

    if (session?.user?.role !== 'admin') {
      console.log("DELETE 请求权限检查失败:", session?.user?.role)
      return NextResponse.json(
        { error: "无权限执行此操作" },
        { status: 403 }
      )
    }

    const { code } = await request.json()
    console.log("准备删除邀请码:", code)

    await redis.del(`invite:${code}`)

    return NextResponse.json({
      message: "删除成功"
    })
  } catch (error) {
    console.error("删除邀请码失败:", error)
    return NextResponse.json(
      { error: "删除邀请码失败" },
      { status: 500 }
    )
  }
}