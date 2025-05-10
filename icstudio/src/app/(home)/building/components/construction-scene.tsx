"use client"

import { useEffect, useState } from "react"

export function ConstructionScene() {
  const [animationState, setAnimationState] = useState({
    workerPosition: 0,
    cranePosition: 0,
    signWiggle: false,
    cloudMoving: false,
  })

  // Set up automated animation sequence
  useEffect(() => {
    // Animation timeline
    const animationSequence = () => {
      // Worker movement animation
      const workerInterval = setInterval(() => {
        setAnimationState((prev) => ({
          ...prev,
          workerPosition: (prev.workerPosition + 1) % 3, // 3 positions: left, middle, right
        }))
      }, 3000)

      // Crane animation
      const craneInterval = setInterval(() => {
        setAnimationState((prev) => ({
          ...prev,
          cranePosition: prev.cranePosition === 0 ? 1 : 0, // Toggle between up and down
        }))
      }, 4000)

      // Sign wiggle animation
      const signInterval = setInterval(() => {
        setAnimationState((prev) => ({
          ...prev,
          signWiggle: !prev.signWiggle,
        }))
        // Reset sign wiggle after 500ms
        setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            signWiggle: false,
          }))
        }, 500)
      }, 5000)

      // Cloud movement
      const cloudInterval = setInterval(() => {
        setAnimationState((prev) => ({
          ...prev,
          cloudMoving: !prev.cloudMoving,
        }))
      }, 10000)

      // Cleanup intervals on unmount
      return () => {
        clearInterval(workerInterval)
        clearInterval(craneInterval)
        clearInterval(signInterval)
        clearInterval(cloudInterval)
      }
    }

    // Start the animation sequence
    const cleanup = animationSequence()
    return cleanup
  }, [])

  // Calculate worker position based on state
  const getWorkerTransform = () => {
    switch (animationState.workerPosition) {
      case 0:
        return "translate-x-0" // Left
      case 1:
        return "translate-x-[100%]" // Middle
      case 2:
        return "translate-x-[200%]" // Right
      default:
        return "translate-x-0"
    }
  }

  return (
    <div className="relative h-64 md:h-80 w-full rounded-lg bg-blue-50 border-2 border-blue-200 overflow-hidden">
      {/* Construction site background */}
      <div className="absolute bottom-0 w-full h-1/4 bg-yellow-800"></div>
      <div className="absolute bottom-[25%] w-full h-2 bg-yellow-600"></div>

      {/* Building structure */}
      <div className="absolute bottom-[25%] left-[20%] w-[60%] h-[50%] bg-gray-200 border-2 border-gray-300">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-300 border border-blue-400"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-300 border border-blue-400"></div>
      </div>

      {/* Crane */}
      <div className="absolute bottom-[25%] right-[10%] w-4 h-[60%] bg-yellow-500">
        <div className="absolute top-0 left-0 w-[200%] h-3 bg-yellow-500"></div>
        <div className="absolute top-0 left-[200%] w-1 h-[40%] bg-yellow-500"></div>
        <div
          className={`absolute top-[5%] left-[200%] w-6 h-6 bg-red-500 rounded-md transition-all duration-1000 ${
            animationState.cranePosition === 1 ? "translate-y-[500%]" : ""
          }`}
        ></div>
      </div>

      {/* Construction worker */}
      <div className={`absolute bottom-[30%] left-[30%] transition-all duration-1000 ${getWorkerTransform()}`}>
        <div className="relative w-12 h-16">
          {/* <div className="absolute top-0 left-2 w-8 h-5 bg-yellow-400 rounded-t-full"></div> */}
          <div className="absolute top-5 left-3 w-6 h-6 bg-pink-200 rounded-full"></div>
          <div className="absolute top-11 left-2 w-8 h-9 bg-blue-500"></div>
          {/* Animated arm */}
          {/* <div
            className={`absolute top-8 right-0 w-4 h-2 bg-pink-200 origin-left transform ${
              animationState.workerPosition === 1 ? "rotate-45" : "rotate-0"
            } transition-transform duration-300`}
          ></div> */}
        </div>
      </div>

      {/* Sign */}
      <div
        className={`absolute bottom-[25%] left-[70%] flex flex-col items-center transform transition-transform duration-300 ${
          animationState.signWiggle ? "rotate-3" : "rotate-0"
        }`}
      >
        <div className="w-2 h-16 bg-brown-500"></div>
        <div className="w-24 h-12 bg-white border-2 border-red-500 flex items-center justify-center p-1 rounded-md">
          <p className="text-xs font-bold text-red-500 text-center">即将推出！</p>
        </div>
      </div>

      {/* Clouds */}
      <div
        className={`absolute top-[10%] left-[10%] w-16 h-8 bg-white rounded-full transition-all duration-10000 ${
          animationState.cloudMoving ? "translate-x-[300%]" : ""
        }`}
      ></div>
      <div
        className={`absolute top-[15%] left-[15%] w-12 h-6 bg-white rounded-full transition-all duration-10000 delay-1000 ${
          animationState.cloudMoving ? "translate-x-[200%]" : ""
        }`}
      ></div>
      <div
        className={`absolute top-[5%] right-[20%] w-20 h-10 bg-white rounded-full transition-all duration-10000 ${
          animationState.cloudMoving ? "-translate-x-[250%]" : ""
        }`}
      ></div>
      <div
        className={`absolute top-[15%] right-[25%] w-14 h-7 bg-white rounded-full transition-all duration-10000 delay-2000 ${
          animationState.cloudMoving ? "-translate-x-[150%]" : ""
        }`}
      ></div>

      {/* Sun */}
      <div className="absolute top-[10%] right-[10%] w-12 h-12 bg-yellow-300 rounded-full animate-pulse"></div>

      {/* Informational text */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white/70 px-2 py-1 rounded-md">自动动画</div>
    </div>
  )
}
