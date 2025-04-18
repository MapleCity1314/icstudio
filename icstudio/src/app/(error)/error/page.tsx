"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, RotateCw } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Page() {
  const [lines, setLines] = useState<Array<{ points: Array<{ x: number; y: number }>; color: string }>>([])
  const [doodles, setDoodles] = useState<Array<{ x: number; y: number; rotation: number }>>([])

  // 生成手绘线条和涂鸦
  useEffect(() => {
    // 生成随机线条
    const newLines = []
    for (let i = 0; i < 15; i++) {
      const points = []
      const startX = Math.random() * window.innerWidth
      const startY = Math.random() * window.innerHeight
      let x = startX
      let y = startY

      for (let j = 0; j < 10; j++) {
        x += (Math.random() - 0.5) * 100
        y += (Math.random() - 0.5) * 100
        points.push({ x, y })
      }

      newLines.push({
        points,
        color: ["#FF5555", "#3B82F6", "#000000"][Math.floor(Math.random() * 3)],
      })
    }
    setLines(newLines)

    // 生成涂鸦
    const newDoodles = []
    for (let i = 0; i < 20; i++) {
      newDoodles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
      })
    }
    setDoodles(newDoodles)
  }, [])

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 手绘线条 */}
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line, i) => (
          <path
            key={i}
            d={`M ${line.points.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
            fill="none"
            stroke={line.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5,5"
            className="opacity-20"
          />
        ))}
      </svg>

      {/* 涂鸦 */}
      {doodles.map((doodle, i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${doodle.x}px`,
            top: `${doodle.y}px`,
            transform: `rotate(${doodle.rotation}deg)`,
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-16 h-16 border-2 border-black rounded-full"></div>
          ) : i % 3 === 1 ? (
            <div className="w-16 h-16 border-2 border-black"></div>
          ) : (
            <div className="text-4xl">✗</div>
          )}
        </div>
      ))}

      <div className="w-full max-w-md z-10">
        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-8 border-red-500 rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 w-16 h-4 bg-red-500 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                    <div className="absolute top-1/2 left-1/2 w-16 h-4 bg-red-500 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                哎呀！出错啦！
              </h1>
              <p className="text-gray-600 mt-2 text-center italic">服务器好像在偷懒...</p>
            </div>

            <div className="bg-amber-100 border-2 border-black p-4 mb-6 transform -rotate-1">
              <p className="text-gray-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                如果您看到此页面，说明我们的网站遇到了一些技术问题。请联系我们的开发者获取帮助。
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                asChild
              >
                <Link href="mailto:developer@example.com">
                  <Mail className="mr-2 h-4 w-4" />
                  联系开发者
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                asChild
              >
                <Link href="/">
                  <RotateCw className="mr-2 h-4 w-4" />
                  返回首页
                </Link>
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-dashed border-black text-center">
              <p className="text-sm font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                错误代码: DOODLE_404_NOT_FOUND
              </p>
              <div className="mt-2 flex justify-center">
                <div className="inline-block border-2 border-black px-3 py-1 bg-yellow-200 transform rotate-3">
                  别担心，我们正在修复问题！
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
