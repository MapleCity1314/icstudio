import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/db/mongo/mongo"
import { Admin, TeamUser, User } from "@/lib/db/mongo/schemas/user"
import bcrypt from "bcryptjs"
import { addToCache, getFromCache } from "@/lib/db/redis/use-cache"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: "用户名/邮箱/手机号", type: "text" },
        password: { label: "密码", type: "password" },
        rememberMe: { label: "记住我", type: "boolean" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('请输入用户名和密码')
        }

        await dbConnect()
        console.log("验证用户凭据:", credentials.identifier);

        // 检查Redis缓存中是否有用户信息
        const cachedUser = await getFromCache(`auth:${credentials.identifier}`);
        if (cachedUser) {
          console.log("从缓存中获取用户信息");
          return cachedUser;
        }

        // 在三个集合中查找用户
        const admin = await Admin.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
            { phone: credentials.identifier }
          ]
        })

        const teamUser = await TeamUser.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
            { phone: credentials.identifier }
          ]
        })

        const normalUser = await User.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
            { phone: credentials.identifier }
          ]
        })

        const user = admin || teamUser || normalUser
        if (!user) {
          throw new Error('用户不存在')
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isValidPassword) {
          throw new Error('密码错误')
        }

        console.log("用户验证成功:", user.username);

        const userData = {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: admin ? 'admin' : (teamUser ? 'team' : 'user'),
          image: user.avatar
        };

        // 如果选择了"记住我"，将用户信息存入Redis
        if (credentials.rememberMe === "true") {
          await addToCache(`auth:${credentials.identifier}`, userData, 60 * 60 * 24 * 30); // 30天
          console.log("用户信息已缓存到Redis");
        }

        return userData;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-do-not-use-in-production",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        console.log("JWT 生成:", { id: user.id, role: user.role });
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        console.log("Session 更新:", session);
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log("重定向请求:", { url, baseUrl });
      // 确保重定向到正确的路由
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    }
  }
})

export { handler as GET, handler as POST } 