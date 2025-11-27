'use client'

import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Moon, Sun, Coffee, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useMounted } from '@/lib/hooks/useMounted'

/**
 * ThemeSelector - Glass-styled theme selector
 *
 * Features Apple's Liquid Glass design:
 * - Glass trigger with backdrop blur
 * - Glass dropdown with elevated shadow
 * - Smooth transitions and hover states
 */
export const ThemeSelector = React.memo(function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const t = useTranslations('Settings')

  if (!mounted) {
    return null
  }

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
            {getIcon(theme || 'light')}
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
              {['light', 'dark', 'coffee', 'system'].map((item) => (
                <Select.Item
                  key={item}
                  value={item}
                  className="relative flex cursor-pointer items-center rounded-xl py-2 pl-8 pr-4 text-sm text-text-primary outline-none transition-colors data-[state=checked]:glass-tint-green data-[state=checked]:text-primary-green data-[highlighted]:glass-tint-green/50"
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
})
