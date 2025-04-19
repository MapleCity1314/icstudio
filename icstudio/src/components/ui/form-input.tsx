"use client"

import type React from "react"
import { useState, forwardRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  className?: string
  inputClassName?: string
  labelClassName?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, inputClassName, labelClassName, ...props }: FormInputProps, ref:React.Ref<HTMLInputElement>) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const borderControls = useAnimation()

    // Handle focus - trigger animation from left to right
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      borderControls.start({
        scaleX: 1,
        transition: { duration: 0.4, ease: "easeInOut" },
      })
      props.onFocus?.(e)
    }

    // Handle blur - reverse animation from right to left
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value.length > 0)
      borderControls.start({
        scaleX: 0,
        transition: { duration: 0.4, ease: "easeInOut" },
      })
      props.onBlur?.(e)
    }

    // Check if input has value
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    return (
      <div className={cn("relative w-full mb-4", className)}>
        <motion.label
          className={cn(
            "absolute pointer-events-none text-muted-foreground transition-all duration-200 ease-in-out",
            isFocused || hasValue ? "text-xs top-[-8px] left-0" : "text-base top-2 left-0",
            labelClassName,
          )}
          animate={{
            top: isFocused || hasValue ? -8 : 8,
            fontSize: isFocused || hasValue ? "0.75rem" : "1rem",
            color: isFocused ? "var(--color-primary, #000)" : "var(--color-muted-foreground, #666)",
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>

        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent border-0 border-input focus:ring-0 focus:outline-none py-2 px-0",
            "placeholder:opacity-0",
            inputClassName,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={borderControls}
        />

        {error && (
          <div id={`${props.id}-error`} className="mt-1 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"

export { FormInput }
