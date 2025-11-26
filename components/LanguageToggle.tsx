'use client'

import { memo } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export const LanguageToggle = memo(function LanguageToggle() {
  const t = useTranslations('Language')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-text-secondary" />
      <Select.Root value={locale} onValueChange={handleLocaleChange}>
        <Select.Trigger
          className="flex items-center gap-2 rounded-lg border-2 border-bg-secondary bg-bg-primary min-w-[44px] min-h-[44px] px-4 py-3 text-sm text-text-primary shadow-soft transition-colors hover:border-primary-green focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green"
          aria-label={t('label')}
        >
          <Select.Value>{t(locale as 'en' | 'ja')}</Select.Value>
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
              {routing.locales.map((loc) => (
                <Select.Item
                  key={loc}
                  value={loc}
                  className="relative flex cursor-pointer items-center rounded-md px-8 py-2 text-sm text-text-primary outline-none data-[highlighted]:bg-primary-green data-[highlighted]:text-white"
                >
                  <Select.ItemText>{t(loc as 'en' | 'ja')}</Select.ItemText>
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
