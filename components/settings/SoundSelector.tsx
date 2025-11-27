'use client'

import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { SoundPreset } from '@/lib/stores/settingsStore'
import { SUPPORTED_SOUND_PRESETS, audioManager } from '@/lib/audio/audioManager'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import useStore from '@/lib/hooks/useStore'
import { useSoundSelectorEffects } from '@/lib/hooks/useSoundSelectorEffects'

interface SoundSelectorProps {
  value: SoundPreset
  onChange: (preset: SoundPreset) => void
}

const SOUND_OPTIONS = [
  ...SUPPORTED_SOUND_PRESETS,
  'none',
] as const satisfies ReadonlyArray<SoundPreset>
const FALLBACK_SOUND = SUPPORTED_SOUND_PRESETS[0]

/**
 * SoundSelector - Glass-styled sound preset selector
 *
 * Features Apple's Liquid Glass design:
 * - Glass trigger button with backdrop blur
 * - Glass dropdown content with elevated shadow
 * - Interactive preview buttons with glass styling
 */
export const SoundSelector = React.memo(function SoundSelector({
  value,
  onChange,
}: SoundSelectorProps) {
  const t = useTranslations('Settings')
  const tPresets = useTranslations('SoundPresets')
  const volume = useStore(useSettingsStore, (state) => state.volume) ?? 70
  const isValueSupported = React.useMemo(
    () => SOUND_OPTIONS.includes(value),
    [value],
  )
  const safeValue = isValueSupported ? value : FALLBACK_SOUND

  // Track preview playback state
  const [previewingSound, setPreviewingSound] =
    React.useState<SoundPreset | null>(null)
  const [previewProgress, setPreviewProgress] = React.useState(0)

  /**
   * Handles the preview button click to play the selected sound
   * @param e - Mouse event to prevent default select behavior
   * @param preset - The sound preset to preview
   */
  const handlePreview = async (e: React.MouseEvent, preset: SoundPreset) => {
    e.preventDefault()
    e.stopPropagation()

    // Initialize AudioContext on first preview (user interaction)
    await audioManager.initialize()

    setPreviewingSound(preset)
    setPreviewProgress(0)

    await audioManager.play(preset, volume, (progress) => {
      setPreviewProgress(progress)

      // Reset state when playback completes
      if (progress >= 100) {
        setTimeout(() => {
          setPreviewingSound(null)
          setPreviewProgress(0)
        }, 100)
      }
    })
  }

  // Use custom hook for effects
  useSoundSelectorEffects(isValueSupported, onChange, FALLBACK_SOUND)

  const currentLabel = tPresets(safeValue)

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text-primary">
        {t('sound')}
      </label>

      <Select.Root value={safeValue} onValueChange={onChange}>
        <Select.Trigger
          data-testid="sound-selector"
          className="flex w-full items-center justify-between rounded-xl glass glass-highlight px-4 py-3 text-left text-text-primary transition-all hover:glass-tint-green focus:outline-none focus:ring-2 focus:ring-primary-green/50"
          aria-label={t('selectSound')}
        >
          <Select.Value>{currentLabel}</Select.Value>
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-auto max-h-48 md:max-h-64 rounded-2xl glass glass-elevated glass-highlight"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-2">
              {SOUND_OPTIONS.map((preset) => (
                <div key={preset} className="relative flex flex-col">
                  <div className="flex items-center justify-between rounded-xl px-2 py-1">
                    <Select.Item
                      value={preset}
                      className="relative flex-1 cursor-pointer rounded-xl pl-8 pr-4 py-2 text-sm text-text-primary outline-none transition-colors data-[state=checked]:glass-tint-green data-[state=checked]:text-primary-green data-[highlighted]:glass-tint-green/50"
                    >
                      <Select.ItemText>{tPresets(preset)}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>

                    {preset !== 'none' && (
                      <motion.button
                        type="button"
                        data-testid="sound-preview-button"
                        onPointerDown={(e) => handlePreview(e, preset)}
                        className="ml-2 rounded-full p-2 min-w-10 min-h-10 flex items-center justify-center glass glass-highlight text-text-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={t('previewSound', {
                          sound: tPresets(preset),
                        })}
                      >
                        <Play className="h-4 w-4 fill-current" />
                      </motion.button>
                    )}
                  </div>

                  {/* Progress bar - shown when this sound is previewing */}
                  {previewingSound === preset && (
                    <div className="mx-2 mb-2 px-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full glass">
                        <motion.div
                          className="h-full rounded-full bg-primary-green"
                          initial={{ width: 0 }}
                          animate={{ width: `${previewProgress}%` }}
                          transition={{ duration: 0.1 }}
                          role="progressbar"
                          aria-valuenow={Math.round(previewProgress)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={t('previewProgress')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
})
