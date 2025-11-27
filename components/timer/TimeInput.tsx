'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { MAX_TIMER_MINUTES } from '@/lib/constants/time'
import { GlassPanel } from '@/components/ui/GlassPanel'

interface TimeInputProps {
  onTimeChange: (minutes: number, seconds: number) => void
  disabled: boolean
  initialMinutes?: number
  initialSeconds?: number
}

/**
 * TimeInput - Glass-styled time input fields
 *
 * Features Apple's Liquid Glass design:
 * - Glass container wrapper with capsule shape
 * - Translucent input fields with backdrop blur
 * - Focus states with glass tint
 * - Smooth transitions
 */
export const TimeInput = memo(function TimeInput({
  onTimeChange,
  disabled,
  initialMinutes = 5,
  initialSeconds = 0,
}: TimeInputProps) {
  const t = useTranslations('Timer')

  const handleMinutesChange = (value: string) => {
    const num = parseInt(value) || 0
    const clamped = Math.max(0, Math.min(MAX_TIMER_MINUTES, num))
    onTimeChange(clamped, initialSeconds)
  }

  const handleSecondsChange = (value: string) => {
    const num = parseInt(value) || 0
    const clamped = Math.max(0, Math.min(59, num))
    onTimeChange(initialMinutes, clamped)
  }

  const inputClasses = `
    w-24 rounded-xl 
    glass glass-highlight
    px-4 py-3 text-center text-2xl font-semibold 
    text-text-primary
    transition-all duration-200
    focus:glass-tint-green focus:outline-none focus:ring-2 focus:ring-primary-green/50
    disabled:cursor-not-allowed disabled:opacity-50
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
  `

  return (
    <GlassPanel
      variant="regular"
      shape="capsule"
      highlight
      className="px-6 py-4"
    >
      <div className="flex items-center justify-center gap-4">
        {/* Minutes Input */}
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="minutes"
            className="text-sm font-medium text-text-secondary"
          >
            {t('minutes')}
          </label>
          <input
            id="minutes"
            type="number"
            min="0"
            max={MAX_TIMER_MINUTES}
            value={initialMinutes}
            onChange={(e) => handleMinutesChange(e.target.value)}
            disabled={disabled}
            data-testid="time-input-minutes"
            className={inputClasses}
          />
        </div>

        {/* Separator - glass style */}
        <span className="mt-6 text-3xl font-bold text-text-secondary/70">
          :
        </span>

        {/* Seconds Input */}
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="seconds"
            className="text-sm font-medium text-text-secondary"
          >
            {t('seconds')}
          </label>
          <input
            id="seconds"
            type="number"
            min="0"
            max="59"
            value={initialSeconds}
            onChange={(e) => handleSecondsChange(e.target.value)}
            disabled={disabled}
            data-testid="time-input-seconds"
            className={inputClasses}
          />
        </div>
      </div>
    </GlassPanel>
  )
})
