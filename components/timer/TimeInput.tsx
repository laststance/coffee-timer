'use client'

import { memo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { MAX_TIMER_MINUTES } from '@/lib/constants/time'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { GlassNumberStepper } from '@/components/ui/GlassNumberStepper'

interface TimeInputProps {
  onTimeChange: (minutes: number, seconds: number) => void
  disabled: boolean
  initialMinutes?: number
  initialSeconds?: number
}

/**
 * TimeInput - Theme-aware time input with stepper controls
 *
 * Features:
 * - Mouse/trackpad friendly with +/- buttons
 * - Hold-to-repeat for rapid value changes
 * - Keyboard input still supported
 * - Arrow key navigation
 *
 * For Liquid Glass themes:
 * - Glass container wrapper with capsule shape
 * - Translucent stepper components with backdrop blur
 * - Focus states with glass tint
 * - Smooth transitions
 *
 * For original themes (light/dark/coffee):
 * - Standard bordered stepper components
 * - Maintains original visual appearance
 *
 * @example
 * ```tsx
 * <TimeInput
 *   onTimeChange={(m, s) => console.log(m, s)}
 *   disabled={false}
 *   initialMinutes={5}
 *   initialSeconds={0}
 * />
 * ```
 */
export const TimeInput = memo(function TimeInput({
  onTimeChange,
  disabled,
  initialMinutes = 5,
  initialSeconds = 0,
}: TimeInputProps) {
  const t = useTranslations('Timer')
  const { resolvedTheme } = useTheme()

  // Check if current theme is a liquid-glass variant
  const isLiquidGlass = resolvedTheme?.startsWith('liquid-glass') ?? false

  /**
   * Handle minutes value change.
   * @param value - New minutes value
   */
  const handleMinutesChange = useCallback(
    (value: number) => {
      onTimeChange(value, initialSeconds)
    },
    [onTimeChange, initialSeconds],
  )

  /**
   * Handle seconds value change.
   * @param value - New seconds value
   */
  const handleSecondsChange = useCallback(
    (value: number) => {
      onTimeChange(initialMinutes, value)
    },
    [onTimeChange, initialMinutes],
  )

  // For original themes: render without GlassPanel wrapper
  if (!isLiquidGlass) {
    return (
      <div className="flex items-center justify-center gap-4">
        {/* Minutes Stepper */}
        <GlassNumberStepper
          value={initialMinutes}
          min={0}
          max={MAX_TIMER_MINUTES}
          step={1}
          onChange={handleMinutesChange}
          disabled={disabled}
          label={t('minutes')}
          data-testid="time-input-minutes"
        />

        {/* Separator */}
        <span className="mt-6 text-3xl font-bold text-text-secondary">:</span>

        {/* Seconds Stepper */}
        <GlassNumberStepper
          value={initialSeconds}
          min={0}
          max={59}
          step={1}
          onChange={handleSecondsChange}
          disabled={disabled}
          label={t('seconds')}
          data-testid="time-input-seconds"
        />
      </div>
    )
  }

  // For Liquid Glass themes: render with GlassPanel wrapper
  return (
    <GlassPanel
      variant="regular"
      shape="capsule"
      highlight
      className="px-4 py-3"
    >
      <div className="flex items-center justify-center gap-3">
        {/* Minutes Stepper */}
        <GlassNumberStepper
          value={initialMinutes}
          min={0}
          max={MAX_TIMER_MINUTES}
          step={1}
          onChange={handleMinutesChange}
          disabled={disabled}
          label={t('minutes')}
          data-testid="time-input-minutes"
        />

        {/* Separator - glass style */}
        <span className="mt-6 text-3xl font-bold text-text-secondary/70">
          :
        </span>

        {/* Seconds Stepper */}
        <GlassNumberStepper
          value={initialSeconds}
          min={0}
          max={59}
          step={1}
          onChange={handleSecondsChange}
          disabled={disabled}
          label={t('seconds')}
          data-testid="time-input-seconds"
        />
      </div>
    </GlassPanel>
  )
})
