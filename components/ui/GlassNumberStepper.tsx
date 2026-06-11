'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Minus, Plus } from 'lucide-react'
import {
  STEPPER_HOLD_REPEAT_DELAY_MS,
  STEPPER_HOLD_REPEAT_INTERVAL_MS,
} from '@/components/ui/constants'

type StepperHoldAction = 'increment' | 'decrement'

interface HoldToRepeatCallbacks {
  onIncrement: () => void
  onDecrement: () => void
}

interface StopHoldAtBoundaryOptions {
  disabled: boolean
  isHolding: StepperHoldAction | null
  max: number
  min: number
  stopHold: () => void
  value: number
}

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
 * Runs the latest +/- callback while a stepper button is held by GlassNumberStepper.
 * @param callbacks - Latest increment and decrement handlers from the rendered stepper.
 * @returns Hold state plus start/stop handlers for pointer, blur, and boundary cleanup.
 * @example
 * const hold = useHoldToRepeat({ onIncrement: addOne, onDecrement: subtractOne })
 */
function useHoldToRepeat({ onIncrement, onDecrement }: HoldToRepeatCallbacks) {
  const [isHolding, setIsHolding] = useState<StepperHoldAction | null>(null)
  const incrementCallbackRef = useRef(onIncrement)
  const decrementCallbackRef = useRef(onDecrement)
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    incrementCallbackRef.current = onIncrement
    decrementCallbackRef.current = onDecrement
  }, [onDecrement, onIncrement])

  /**
   * Clears queued repeat timers when a hold ends, unmounts, or hits a limit.
   * @returns Nothing; it only clears browser timer handles stored in refs.
   * @example
   * clearHoldTimers()
   */
  const clearHoldTimers = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  /**
   * Invokes the current action callback so repeat ticks use the newest prop value.
   * @param action - Which side of the stepper is being held.
   * @returns Nothing; the callback owns whether the value actually changes.
   * @example
   * runHoldAction('increment')
   */
  const runHoldAction = (action: StepperHoldAction) => {
    if (action === 'increment') {
      incrementCallbackRef.current()
      return
    }

    decrementCallbackRef.current()
  }

  /**
   * Starts a hold from pointer down with one immediate change, then repeats after a delay.
   * @param action - Which side of the stepper started the hold.
   * @returns Nothing; timers are stored for stopHold and unmount cleanup.
   * @example
   * startHold('decrement')
   */
  const startHold = (action: StepperHoldAction) => {
    clearHoldTimers()

    setIsHolding(action)
    runHoldAction(action)

    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(
        () => runHoldAction(action),
        STEPPER_HOLD_REPEAT_INTERVAL_MS,
      )
    }, STEPPER_HOLD_REPEAT_DELAY_MS)
  }

  /**
   * Stops a hold when the user releases, leaves, cancels, blurs, or hits a limit.
   * @returns Nothing; it resets visual hold state and clears repeat timers.
   * @example
   * stopHold()
   */
  const stopHold = () => {
    setIsHolding(null)
    clearHoldTimers()
  }

  // Cleanup timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      clearHoldTimers()
    }
  }, [])

  return { isHolding, startHold, stopHold }
}

/**
 * Stops an active hold when the next repeat would be blocked by disabled state or bounds.
 * @param options - Current value, range, disabled state, hold action, and stop callback.
 * @returns Nothing; it only stops active hold timers after render.
 * @example
 * useStopHoldAtBoundary({ disabled: false, isHolding: 'increment', max: 59, min: 0, stopHold, value: 59 })
 */
function useStopHoldAtBoundary({
  disabled,
  isHolding,
  max,
  min,
  stopHold,
  value,
}: StopHoldAtBoundaryOptions) {
  useEffect(() => {
    if (!isHolding) return

    // Stop once limits disable the pressed button; disabled buttons may not fire pointerup.
    if (
      disabled ||
      (isHolding === 'increment' && value >= max) ||
      (isHolding === 'decrement' && value <= min)
    ) {
      stopHold()
    }
  }, [disabled, isHolding, max, min, stopHold, value])
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

  /**
   * Clamp value within min/max bounds.
   * @param candidateValue - Value requested by input, keyboard, or stepper button.
   * @returns The candidate value forced into the component's allowed range.
   * @example
   * clamp(61) // => max when max is lower than 61
   */
  const clamp = useCallback(
    (candidateValue: number): number =>
      Math.max(min, Math.min(max, candidateValue)),
    [max, min],
  )

  /**
   * Increases the value by one step when the plus button, arrow key, or hold repeat fires.
   * @returns Nothing; emits onChange only when the clamped value differs.
   * @example
   * increment()
   */
  const increment = useCallback(() => {
    if (disabled) return
    const newValue = clamp(value + step)
    if (newValue !== value) {
      onChange(newValue)
    }
  }, [clamp, disabled, onChange, step, value])

  /**
   * Decreases the value by one step when the minus button, arrow key, or hold repeat fires.
   * @returns Nothing; emits onChange only when the clamped value differs.
   * @example
   * decrement()
   */
  const decrement = useCallback(() => {
    if (disabled) return
    const newValue = clamp(value - step)
    if (newValue !== value) {
      onChange(newValue)
    }
  }, [clamp, disabled, onChange, step, value])

  const { isHolding, startHold, stopHold } = useHoldToRepeat({
    onDecrement: decrement,
    onIncrement: increment,
  })

  useStopHoldAtBoundary({ disabled, isHolding, max, min, stopHold, value })

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
            onPointerDown={() => startHold('decrement')}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            onBlur={stopHold}
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
            onPointerDown={() => startHold('increment')}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            onBlur={stopHold}
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
          onPointerDown={() => startHold('decrement')}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onBlur={stopHold}
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
          onPointerDown={() => startHold('increment')}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onBlur={stopHold}
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
