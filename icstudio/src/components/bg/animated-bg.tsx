"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
// @ts-expect-error - three.js扩展模块缺少类型声明
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
// @ts-expect-error - three.js扩展模块缺少类型声明
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
// @ts-expect-error - three.js扩展模块缺少类型声明
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
// @ts-expect-error - three.js扩展模块缺少类型声明
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"

// 自定义接口用于扩展网格对象
interface ExtendedMesh extends THREE.Mesh {
  velocity?: {
    y: number
    rotX: number
    rotY: number
    rotZ: number
  }
  flareProperties?: {
    active: boolean
    progress: number
    duration: number
    nextFlareTime: number
  }
}

export default function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    containerRef.current.appendChild(renderer.domElement)

    // Camera position
    camera.position.z = 20

    // Theme colors
    const themeColors = {
      primary: new THREE.Color(0x0a1929),
      secondary: new THREE.Color(0x0d47a1),
      accent: new THREE.Color(0x2196f3),
      highlight: new THREE.Color(0x64b5f6),
      glow: new THREE.Color(0x90caf9),
    }

    // Background color
    scene.background = themeColors.primary

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    // Main light source in top right corner
    const mainLight = new THREE.PointLight(themeColors.highlight, 2, 100, 1.5)
    mainLight.position.set(15, 15, 10)
    scene.add(mainLight)

    // Add a visible sphere for the light source
    const lightSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: themeColors.highlight }),
    )
    lightSphere.position.copy(mainLight.position)
    scene.add(lightSphere)

    // Secondary lights
    const secondaryLight = new THREE.PointLight(themeColors.accent, 1, 50, 1)
    secondaryLight.position.set(-10, -5, 5)
    scene.add(secondaryLight)

    // Add after scene creation but before creating materials
    // Create an environment map for better reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()

    // Create a simple environment map
    const cubeRenderTarget = pmremGenerator.fromScene(new THREE.Scene())
    const envMap = cubeRenderTarget.texture

    // Create triangles
    const triangles: ExtendedMesh[] = []
    const lines: ExtendedMesh[] = []
    const triangleCount = 30

    // Enhanced material with reflections
    const triangleMaterial = new THREE.MeshPhysicalMaterial({
      color: themeColors.secondary,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      envMapIntensity: 1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(themeColors.secondary).multiplyScalar(0.1), // Add minimal base emissive
      emissiveIntensity: 0.1, // Minimal emissive intensity by default
    })

    // Set the environment map for all materials
    triangleMaterial.envMap = envMap

    // Create triangular shapes
    for (let i = 0; i < triangleCount; i++) {
      const geometry = new THREE.TetrahedronGeometry(Math.random() * 1.0 + 1.0, 0)
      const triangle = new THREE.Mesh(geometry, triangleMaterial.clone()) as ExtendedMesh

      // Random starting positions
      triangle.position.x = Math.random() * 40 - 20
      triangle.position.y = Math.random() * 40 - 20
      triangle.position.z = Math.random() * 10 - 5

      // Random rotation
      triangle.rotation.x = Math.random() * Math.PI
      triangle.rotation.y = Math.random() * Math.PI

      // Store velocity for animation
      triangle.velocity = {
        y: -Math.random() * 0.03 - 0.01,
        rotX: Math.random() * 0.01 - 0.005,
        rotY: Math.random() * 0.01 - 0.005,
        rotZ: Math.random() * 0.01 - 0.005,
      }

      // Randomize material properties slightly for variety
      const material = triangle.material as THREE.MeshPhysicalMaterial
      material.color.set(new THREE.Color(themeColors.secondary).lerp(themeColors.accent, Math.random() * 0.5))
      material.metalness = 0.7 + Math.random() * 0.3
      material.roughness = 0.05 + Math.random() * 0.15

      scene.add(triangle)
      triangles.push(triangle)
    }

    // Create long lines with enhanced properties
    const lineMaterial = new THREE.MeshPhongMaterial({
      color: themeColors.accent,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      shininess: 100,
      flatShading: true,
    })

    for (let i = 0; i < 15; i++) {
      // Create a plane geometry instead of a line for better visual effects
      const lineLength = window.innerHeight
      const lineWidth = 0.05 + Math.random() * 0.1
      const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineLength, 1, 10)

      const line = new THREE.Mesh(lineGeometry, lineMaterial.clone()) as ExtendedMesh

      line.position.x = Math.random() * 40 - 20
      line.position.y = 0 // Center vertically
      line.position.z = Math.random() * 10 - 5

      // Random initial rotation
      line.rotation.x = Math.random() * Math.PI * 0.1
      line.rotation.z = Math.random() * Math.PI * 0.25 // Slight angle

      // Store velocity for animation
      line.velocity = {
        y: -Math.random() * 0.02 - 0.01,
        rotX: (Math.random() * 0.002 - 0.001) * (Math.random() > 0.5 ? 1 : -1),
        rotY: (Math.random() * 0.002 - 0.001) * (Math.random() > 0.5 ? 1 : -1),
        rotZ: (Math.random() * 0.002 - 0.001) * (Math.random() > 0.5 ? 1 : -1),
      }

      // Add flare properties
      line.flareProperties = {
        active: false,
        progress: 0,
        duration: 2 + Math.random() * 3,
        nextFlareTime: Math.random() * 10,
      }

      // Randomize line color slightly
      ;(line.material as THREE.MeshPhongMaterial).color.set(
        new THREE.Color(themeColors.accent).lerp(themeColors.highlight, Math.random() * 0.5),
      )

      scene.add(line)
      lines.push(line)
    }

    // Post-processing for bloom and glare effects
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6, // strength (reduced slightly)
      0.4, // radius (increased slightly)
      0.7, // threshold (reduced to catch more mid-tones)
    )
    composer.addPass(bloomPass)

    // Custom glare shader with improved smoothing
    const glareShader = {
      uniforms: {
        tDiffuse: { value: null },
        lightPosition: { value: new THREE.Vector3(15, 15, 10) },
        glareIntensity: { value: 0.4 },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 lightPosition;
        uniform float glareIntensity;
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          
          // Improved glare effect with smoother transition
          float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
          
          // Smooth step for more gradual transition
          float glareAmount = smoothstep(0.5, 0.9, brightness) * glareIntensity;
          
          // Add slight time variation to prevent static glare
          glareAmount *= (0.9 + 0.1 * sin(time * 0.5));
          
          // Add glare with blue tint
          texel.rgb += vec3(0.5, 0.7, 1.0) * glareAmount;
          
          gl_FragColor = texel;
        }
      `,
    }

    const glarePass = new ShaderPass(glareShader)
    composer.addPass(glarePass)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Slightly move the main light for dynamic lighting
      mainLight.position.x = 15 + Math.sin(elapsedTime * 0.2) * 2
      mainLight.position.y = 15 + Math.cos(elapsedTime * 0.3) * 2
      lightSphere.position.copy(mainLight.position)

      // Update glare shader with current light position
      glarePass.uniforms.lightPosition.value.copy(mainLight.position)

      // Update time uniform for glare shader
      glarePass.uniforms.time.value = elapsedTime

      // Animate triangles
      triangles.forEach((triangle) => {
        if (!triangle.velocity) return;
        
        // Move down
        triangle.position.y += triangle.velocity.y

        // Rotate (tumbling effect)
        triangle.rotation.x += triangle.velocity.rotX
        triangle.rotation.y += triangle.velocity.rotY
        triangle.rotation.z += triangle.velocity.rotZ

        // Get the material
        const material = triangle.material as THREE.MeshPhysicalMaterial

        // IMPROVED: Calculate face normals properly for tetrahedron
        // A tetrahedron has 4 faces, we'll check all of them against the light
        const geometry = triangle.geometry as THREE.BufferGeometry
        // 移除未使用变量
        const normalAttribute = geometry.attributes.normal

        // Initialize variables to track the best light alignment
        let bestAlignment = -1

        // Check each face's normal against the light direction
        for (let face = 0; face < normalAttribute.count; face++) {
          // Get the normal for this vertex
          const nx = normalAttribute.getX(face)
          const ny = normalAttribute.getY(face)
          const nz = normalAttribute.getZ(face)

          // Create a normal vector and apply the triangle's rotation
          const normal = new THREE.Vector3(nx, ny, nz).applyQuaternion(triangle.quaternion)

          // Calculate light direction from this face to both lights
          const mainLightDir = new THREE.Vector3().subVectors(mainLight.position, triangle.position).normalize()
          const secondaryLightDir = new THREE.Vector3()
            .subVectors(secondaryLight.position, triangle.position)
            .normalize()

          // Calculate alignment with both lights
          const mainAlignment = Math.max(0, normal.dot(mainLightDir))
          const secondaryAlignment = Math.max(0, normal.dot(secondaryLightDir) * 0.5) // Secondary light has less effect

          // Combined alignment from both lights
          const combinedAlignment = Math.min(1, mainAlignment + secondaryAlignment)

          // Keep track of the best alignment for any face
          if (combinedAlignment > bestAlignment) {
            bestAlignment = combinedAlignment
          }
        }

        // IMPROVED: Gradual emissive intensity based on alignment
        // This prevents sudden changes from bright to dark
        const minEmissive = 0.05 // Minimum emissive to prevent complete darkness
        const emissiveIntensity = minEmissive + bestAlignment * 0.6

        // Set emissive color based on alignment (gradual transition)
        const emissiveColor = new THREE.Color(themeColors.glow)

        // Always have some minimal emissive to prevent complete darkness
        material.emissive.set(emissiveColor)
        material.emissiveIntensity = emissiveIntensity

        // IMPROVED: Adjust other material properties based on alignment for better visual effect
        material.roughness = Math.max(0.05, 0.2 - bestAlignment * 0.15)

        // Reset position when out of view
        if (triangle.position.y < -20) {
          triangle.position.y = 20
          triangle.position.x = Math.random() * 40 - 20
        }
      })

      // Animate lines
      lines.forEach((line, index) => {
        if (!line.velocity || !line.flareProperties) return;
        
        // Move down
        line.position.y += line.velocity.y

        // Apply consistent rotation
        line.rotation.x += line.velocity.rotX
        line.rotation.y += line.velocity.rotY
        line.rotation.z += line.velocity.rotZ

        // Handle flare effects
        const flareProps = line.flareProperties
        const material = line.material as THREE.MeshPhongMaterial

        if (flareProps.active) {
          // Update flare progress
          flareProps.progress += 1 / (60 * flareProps.duration)

          if (flareProps.progress >= 1) {
            // End flare
            flareProps.active = false
            flareProps.progress = 0
            flareProps.nextFlareTime = 5 + Math.random() * 10
            material.emissive = new THREE.Color(0, 0, 0) // 使用黑色代替 undefined
            material.emissiveIntensity = 0
          } else {
            // Calculate flare intensity (peak in the middle)
            const intensity = Math.sin(flareProps.progress * Math.PI)

            // Set emissive properties for the flare
            material.emissive = themeColors.glow
            material.emissiveIntensity = intensity * 0.8
          }
        } else {
          // Count down to next flare
          flareProps.nextFlareTime -= 1 / 60

          if (flareProps.nextFlareTime <= 0) {
            // Start a new flare
            flareProps.active = true
            flareProps.progress = 0
          }
        }

        // Reset position when the line moves completely off-screen
        if (line.position.y < -window.innerHeight) {
          // Remove this line
          scene.remove(line)
          line.geometry.dispose()
          ;(line.material as THREE.Material).dispose()

          // Create a new line to replace it
          const lineLength = window.innerHeight
          const lineWidth = 0.05 + Math.random() * 0.1
          const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineLength, 1, 10)

          const newMaterial = lineMaterial.clone()
          newMaterial.color.set(new THREE.Color(themeColors.accent).lerp(themeColors.highlight, Math.random() * 0.5))

          const newLine = new THREE.Mesh(lineGeometry, newMaterial) as ExtendedMesh

          newLine.position.x = Math.random() * 40 - 20
          newLine.position.y = window.innerHeight / 2
          newLine.position.z = Math.random() * 10 - 5

          // Random initial rotation
          newLine.rotation.x = Math.random() * Math.PI * 0.1
          newLine.rotation.z = Math.random() * Math.PI * 0.25

          // Store velocity for animation
          newLine.velocity = {
            y: -Math.random() * 0.02 - 0.01,
            rotX: (Math.random() * 0.002 - 0.001) * (Math.random() > 0.5 ? 1 : -1),
            rotY: (Math.random() * 0.002 - 0.001) * (Math.random() > 0.5 ? 1 : -1),
            rotZ: (Math.random() * 0.002 - 0.001) * (Math.random() > 0.5 ? 1 : -1),
          }

          // Add flare properties
          newLine.flareProperties = {
            active: false,
            progress: 0,
            duration: 2 + Math.random() * 3,
            nextFlareTime: Math.random() * 10,
          }

          scene.add(newLine)
          lines[index] = newLine
        }
      })

      // Render with post-processing
      composer.render()
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
      bloomPass.resolution.set(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      triangles.forEach((triangle) => {
        triangle.geometry.dispose()
        ;(triangle.material as THREE.Material).dispose()
      })

      lines.forEach((line) => {
        line.geometry.dispose()
        ;(line.material as THREE.Material).dispose()
      })

      composer.dispose()
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
