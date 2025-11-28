'use client'

import { memo } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { Volume2, VolumeX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

interface VolumeControlProps {
  value: number // 0-100
  onChange: (volume: number) => void
}

/**
 * VolumeControl - Theme-aware volume slider
 *
 * For Liquid Glass themes:
 * - Glass track with backdrop blur
 * - Glass thumb with specular highlight
 * - Smooth transition effects
 *
 * For original themes (light/dark/coffee):
 * - Standard solid styling
 * - Maintains original visual appearance
 */
export const VolumeControl = memo(function VolumeControl({
  value,
  onChange,
}: VolumeControlProps) {
  const t = useTranslations('Settings')
  const { resolvedTheme } = useTheme()

  // Check if current theme is a liquid-glass variant
  const isLiquidGlass = resolvedTheme?.startsWith('liquid-glass') ?? false

  const handleValueChange = (values: number[]) => {
    onChange(values[0])
  }

  // For original themes: render standard slider
  if (!isLiquidGlass) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            {t('volume')}
          </label>
          <span className="text-sm font-semibold text-text-secondary">
            {value}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Volume Icon */}
          {value === 0 ? (
            <VolumeX className="h-5 w-5 text-text-secondary" />
          ) : (
            <Volume2 className="h-5 w-5 text-text-secondary" />
          )}

          {/* Radix UI Slider */}
          <Slider.Root
            data-testid="volume-control"
            className="relative flex h-5 w-full touch-none select-none items-center"
            value={[value]}
            onValueChange={handleValueChange}
            max={100}
            step={1}
            aria-label={t('volume')}
          >
            <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-bg-secondary">
              <Slider.Range className="absolute h-full bg-primary-green" />
            </Slider.Track>
            <Slider.Thumb
              data-testid="volume-slider-thumb"
              className="block h-5 w-5 rounded-full border-2 border-primary-green bg-white shadow-soft transition-colors hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
            />
          </Slider.Root>
        </div>
      </div>
    )
  }

  // For Liquid Glass themes: render glass slider
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">
          {t('volume')}
        </label>
        <span className="text-sm font-semibold text-text-secondary glass glass-highlight px-2 py-0.5 rounded-full">
          {value}%
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Volume Icon */}
        {value === 0 ? (
          <VolumeX className="h-5 w-5 text-text-secondary" />
        ) : (
          <Volume2 className="h-5 w-5 text-text-secondary" />
        )}

        {/* Radix UI Slider with Glass styling */}
        <Slider.Root
          data-testid="volume-control"
          className="relative flex h-5 w-full touch-none select-none items-center"
          value={[value]}
          onValueChange={handleValueChange}
          max={100}
          step={1}
          aria-label={t('volume')}
        >
          <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full glass">
            <Slider.Range className="absolute h-full bg-primary-green/80 rounded-full" />
          </Slider.Track>
          <Slider.Thumb
            data-testid="volume-slider-thumb"
            className="block h-5 w-5 rounded-full glass glass-elevated glass-highlight cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-green/50"
          />
        </Slider.Root>
      </div>
    </div>
  )
})
