'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Minus, Plus } from 'lucide-react'

/**
 * Props for GlassNumberStepper component.
 * @param value - Current numeric value
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: 99)
 * @param step - Increment/decrement step (default: 1)
 * @param onChange - Callback when value changes
 * @param disabled - Disable all interactions
 * @param label - Accessible label for the input
 * @param className - Additional CSS classes
 */
interface GlassNumberStepperProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  disabled?: boolean
  label?: string
  className?: string
  'data-testid'?: string
}

/**
 * Custom hook for hold-to-repeat behavior.
 * Waits 300ms, then repeats every 100ms.
 * Automatically cleans up timers on unmount.
 */
function useHoldToRepeat() {
  const [isHolding, setIsHolding] = useState<'increment' | 'decrement' | null>(
    null,
  )
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startHold = (
    action: 'increment' | 'decrement',
    callback: () => void,
  ) => {
    setIsHolding(action)
    callback()

    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(callback, 100)
    }, 300)
  }

  const stopHold = () => {
    setIsHolding(null)
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  // Cleanup timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    }
  }, [])

  return { isHolding, startHold, stopHold }
}

/**
 * GlassNumberStepper - Theme-aware numeric stepper with +/- buttons
 *
 * Features:
 * - Mouse/trackpad friendly with large click targets
 * - Hold-to-repeat for rapid value changes
 * - Keyboard input still supported
 * - Liquid Glass styling for glass themes
 * - Original styling for light/dark/coffee themes
 *
 * @example
 * ```tsx
 * <GlassNumberStepper
 *   value={5}
 *   min={0}
 *   max={60}
 *   onChange={(v) => setMinutes(v)}
 *   label="Minutes"
 * />
 * ```
 */
export const GlassNumberStepper = memo(function GlassNumberStepper({
  value,
  min = 0,
  max = 99,
  step = 1,
  onChange,
  disabled = false,
  label,
  className = '',
  'data-testid': testId,
}: GlassNumberStepperProps) {
  const { resolvedTheme } = useTheme()
  const isLiquidGlass = resolvedTheme?.startsWith('liquid-glass') ?? false
  const { startHold, stopHold } = useHoldToRepeat()

  /**
   * Clamp value within min/max bounds.
   * @param v - Value to clamp
   * @returns Clamped value
   */
  const clamp = (v: number): number => Math.max(min, Math.min(max, v))

  const increment = () => {
    if (disabled) return
    const newValue = clamp(value + step)
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const decrement = () => {
    if (disabled) return
    const newValue = clamp(value - step)
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      onChange(min)
      return
    }
    const num = parseInt(inputValue, 10)
    if (!isNaN(num)) {
      onChange(clamp(num))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }

  // Format value with leading zero for single digits
  const displayValue = value.toString().padStart(2, '0')

  // ===== LIQUID GLASS THEME RENDERING =====
  if (isLiquidGlass) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="glass glass-highlight rounded-xl flex items-center overflow-hidden">
          {/* Decrement Button */}
          <motion.button
            type="button"
            onPointerDown={() => startHold('decrement', decrement)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            disabled={disabled || value <= min}
            aria-label={`Decrease ${label || 'value'}`}
            className={`
              flex items-center justify-center
              w-12 h-14
              glass-highlight
              text-text-primary
              transition-all duration-200
              hover:glass-tint-blue
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none
            `}
            whileHover={{ scale: disabled || value <= min ? 1 : 1.05 }}
            whileTap={{ scale: disabled || value <= min ? 1 : 0.95 }}
          >
            <Minus className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>

          {/* Value Input */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            data-testid={testId}
            aria-label={label}
            className={`
              w-16 h-14
              bg-transparent
              text-center text-2xl font-semibold
              text-text-primary
              transition-all duration-200
              focus:glass-tint-blue focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            `}
          />

          {/* Increment Button */}
          <motion.button
            type="button"
            onPointerDown={() => startHold('increment', increment)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            disabled={disabled || value >= max}
            aria-label={`Increase ${label || 'value'}`}
            className={`
              flex items-center justify-center
              w-12 h-14
              glass-highlight
              text-text-primary
              transition-all duration-200
              hover:glass-tint-blue
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none
            `}
            whileHover={{ scale: disabled || value >= max ? 1 : 1.05 }}
            whileTap={{ scale: disabled || value >= max ? 1 : 0.95 }}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    )
  }

  // ===== ORIGINAL THEME RENDERING =====
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex items-center rounded-lg border-2 border-bg-secondary bg-bg-primary shadow-soft overflow-hidden">
        {/* Decrement Button */}
        <button
          type="button"
          onPointerDown={() => startHold('decrement', decrement)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label || 'value'}`}
          className={`
            flex items-center justify-center
            w-12 h-14
            bg-bg-secondary
            text-text-primary
            transition-colors duration-200
            hover:bg-bg-secondary/80
            active:bg-bg-secondary/60
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none
          `}
        >
          <Minus className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Value Input */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          data-testid={testId}
          aria-label={label}
          className={`
            w-16 h-14
            bg-bg-primary
            text-center text-2xl font-semibold
            text-text-primary
            focus:outline-none
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
        />

        {/* Increment Button */}
        <button
          type="button"
          onPointerDown={() => startHold('increment', increment)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label || 'value'}`}
          className={`
            flex items-center justify-center
            w-12 h-14
            bg-bg-secondary
            text-text-primary
            transition-colors duration-200
            hover:bg-bg-secondary/80
            active:bg-bg-secondary/60
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none
          `}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
})
