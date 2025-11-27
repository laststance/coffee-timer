'use client'

import { memo } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { Volume2, VolumeX } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface VolumeControlProps {
  value: number // 0-100
  onChange: (volume: number) => void
}

/**
 * VolumeControl - Glass-styled volume slider
 *
 * Features Apple's Liquid Glass design:
 * - Glass track with backdrop blur
 * - Glass thumb with specular highlight
 * - Smooth transition effects
 */
export const VolumeControl = memo(function VolumeControl({
  value,
  onChange,
}: VolumeControlProps) {
  const t = useTranslations('Settings')

  const handleValueChange = (values: number[]) => {
    onChange(values[0])
  }

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
