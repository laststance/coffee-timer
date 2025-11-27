'use client'

import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import {
  Check,
  ChevronDown,
  Moon,
  Sun,
  Coffee,
  Monitor,
  Sparkles,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useMounted } from '@/lib/hooks/useMounted'

/**
 * ThemeSelector - Theme-aware theme selector component
 *
 * For original themes (light/dark/coffee):
 * - Shows only 4 original themes (light, dark, coffee, system)
 * - Uses standard solid styling with borders
 * - Maintains original visual appearance for VRT compatibility
 *
 * For Liquid Glass themes:
 * - Shows all 7 themes including liquid-glass variants
 * - Uses glass styling with backdrop blur
 */
export const ThemeSelector = React.memo(function ThemeSelector() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const t = useTranslations('Settings')

  if (!mounted) {
    return null
  }

  // Check if current theme is a liquid-glass variant
  const isLiquidGlass = resolvedTheme?.startsWith('liquid-glass') ?? false

  // Original themes list (for original theme mode)
  const originalThemes = ['light', 'dark', 'coffee', 'system']

  // All themes including liquid-glass variants (for liquid-glass mode)
  const allThemes = [
    'light',
    'dark',
    'coffee',
    'liquid-glass-light',
    'liquid-glass-dark',
    'liquid-glass-coffee',
    'system',
  ]

  const getIcon = (value: string) => {
    switch (value) {
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'coffee':
        return <Coffee className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getLiquidGlassIcon = (value: string) => {
    switch (value) {
      case 'dark':
      case 'liquid-glass-dark':
        return <Moon className="h-4 w-4" />
      case 'coffee':
      case 'liquid-glass-coffee':
        return <Coffee className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      case 'liquid-glass-light':
        return <Sparkles className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const isLiquidGlassTheme = (value: string) =>
    value.startsWith('liquid-glass-')

  // For original themes: render standard selector with only 4 themes
  if (!isLiquidGlass) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">
          {t('theme')}
        </label>

        <Select.Root value={theme} onValueChange={setTheme}>
          <Select.Trigger
            data-testid="theme-selector"
            className="flex w-full items-center justify-between rounded-lg border-2 border-bg-secondary bg-bg-primary px-4 py-3 text-left text-text-primary shadow-soft transition-colors hover:border-primary-green focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green"
            aria-label={t('selectTheme')}
          >
            <div className="flex items-center gap-2">
              {getIcon(theme || 'light')}
              <Select.Value>{t(`Themes.${theme || 'system'}`)}</Select.Value>
            </div>
            <Select.Icon>
              <ChevronDown className="h-4 w-4 text-text-secondary" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className="overflow-hidden rounded-lg border-2 border-bg-secondary bg-bg-primary shadow-lg"
              position="popper"
              sideOffset={5}
            >
              <Select.Viewport className="p-1">
                {originalThemes.map((item) => (
                  <Select.Item
                    key={item}
                    value={item}
                    className="relative flex cursor-pointer items-center rounded-md py-2 pl-8 pr-4 text-sm text-text-primary outline-none data-[state=checked]:bg-primary-green data-[state=checked]:text-white data-[highlighted]:bg-bg-secondary"
                  >
                    <Select.ItemText>
                      <div className="flex items-center gap-2">
                        {getIcon(item)}
                        <span>{t(`Themes.${item}`)}</span>
                      </div>
                    </Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    )
  }

  // For Liquid Glass themes: render glass selector with all themes
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text-primary">
        {t('theme')}
      </label>

      <Select.Root value={theme} onValueChange={setTheme}>
        <Select.Trigger
          data-testid="theme-selector"
          className="flex w-full items-center justify-between rounded-xl glass glass-highlight px-4 py-3 text-left text-text-primary transition-all hover:glass-tint-green focus:outline-none focus:ring-2 focus:ring-primary-green/50"
          aria-label={t('selectTheme')}
        >
          <div className="flex items-center gap-2">
            {getLiquidGlassIcon(theme || 'light')}
            <Select.Value>{t(`Themes.${theme || 'system'}`)}</Select.Value>
          </div>
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-hidden rounded-2xl glass glass-elevated glass-highlight"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-2">
              {allThemes.map((item) => (
                <Select.Item
                  key={item}
                  value={item}
                  className="relative flex cursor-pointer items-center rounded-xl py-2 pl-8 pr-4 text-sm text-text-primary outline-none transition-colors data-[state=checked]:glass-tint-green data-[state=checked]:text-primary-green data-[highlighted]:glass-tint-green/50"
                >
                  <Select.ItemText>
                    <div className="flex items-center gap-2">
                      {isLiquidGlassTheme(item) ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        getLiquidGlassIcon(item)
                      )}
                      <span>{t(`Themes.${item}`)}</span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
})
