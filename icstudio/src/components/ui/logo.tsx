"use client"

import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/admin" className="flex items-center justify-center w-full h-full">
      <div className="relative w-full h-full p-2">
        <Image
          src="/logo/logo-t.png"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  )
}
