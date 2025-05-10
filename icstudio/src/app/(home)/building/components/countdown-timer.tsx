"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    // Cleanup
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center gap-4 md:gap-6">
      <TimeUnit value={timeLeft.days} label="天" />
      <TimeUnit value={timeLeft.hours} label="小时" />
      <TimeUnit value={timeLeft.minutes} label="分钟" />
      <TimeUnit value={timeLeft.seconds} label="秒" />
    </div>
  )
}

interface TimeUnitProps {
  value: number
  label: string
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 md:w-20 h-16 md:h-20 bg-purple-600 rounded-md flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="text-xs md:text-sm mt-2 text-purple-700">{label}</span>
    </div>
  )
}
