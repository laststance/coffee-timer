'use client'

import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Play } from 'lucide-react'
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
          className="flex w-full items-center justify-between rounded-lg border-2 border-bg-secondary bg-bg-primary px-4 py-3 text-left text-text-primary shadow-soft transition-colors hover:border-primary-green focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green"
          aria-label={t('selectSound')}
        >
          <Select.Value>{currentLabel}</Select.Value>
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-auto max-h-48 md:max-h-64 rounded-lg border-2 border-bg-secondary bg-bg-primary shadow-lg"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-1">
              {SOUND_OPTIONS.map((preset) => (
                <div key={preset} className="relative flex flex-col">
                  <div className="flex items-center justify-between rounded-md px-2 py-2">
                    <Select.Item
                      value={preset}
                      className="relative flex-1 cursor-pointer rounded-md pl-8 pr-4 py-1 text-sm text-text-primary outline-none data-[state=checked]:bg-primary-green data-[state=checked]:text-white data-[highlighted]:bg-gray-100"
                    >
                      <Select.ItemText>{tPresets(preset)}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>

                    {preset !== 'none' && (
                      <button
                        type="button"
                        data-testid="sound-preview-button"
                        onPointerDown={(e) => handlePreview(e, preset)}
                        className="ml-2 rounded p-3 min-w-11 min-h-11 flex items-center justify-center text-text-primary hover:bg-bg-secondary hover:text-primary-green transition-colors"
                        aria-label={t('previewSound', {
                          sound: tPresets(preset),
                        })}
                      >
                        <Play className="h-4 w-4 fill-current" />
                      </button>
                    )}
                  </div>

                  {/* Progress bar - shown when this sound is previewing */}
                  {previewingSound === preset && (
                    <div className="mx-2 mb-2 px-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary-green progress-bar"
                          style={
                            {
                              '--progress-width': `${previewProgress}%`,
                            } as React.CSSProperties
                          }
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
