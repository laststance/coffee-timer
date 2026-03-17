'use client'

import { memo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'
import { useMounted } from '@/lib/hooks/useMounted'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Link } from '@/i18n/navigation'

/**
 * SignUpForm - Email/password registration form with theme-aware styling.
 * Supports both original and Liquid Glass theme variants.
 *
 * @example
 * <SignUpForm />
 */
export const SignUpForm = memo(function SignUpForm() {
  const t = useTranslations('Auth')
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const mounted = useMounted()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  const isLiquidGlass =
    mounted && (resolvedTheme?.startsWith('liquid-glass') ?? false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsPending(true)

    await authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: () => {
          router.push('/')
          router.refresh()
        },
        onError: (ctx) => {
          setError(ctx.error?.message ?? t('signUpError'))
          setIsPending(false)
        },
      },
    )
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary text-center">
        {t('signUp')}
      </h1>

      {error && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {t('name')}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-lg border-2 border-bg-secondary bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border-2 border-bg-secondary bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            className="w-full rounded-lg border-2 border-bg-secondary bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-primary-green px-4 py-3 min-h-11 font-medium text-white transition-colors hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? t('signingUp') : t('signUp')}
      </button>

      <p className="text-sm text-text-secondary text-center">
        {t('hasAccount')}{' '}
        <Link
          href="/sign-in"
          className="text-primary-green hover:underline font-medium"
        >
          {t('signIn')}
        </Link>
      </p>
    </form>
  )

  if (isLiquidGlass) {
    return (
      <GlassPanel variant="elevated" highlight className="w-full max-w-sm p-8">
        {formContent}
      </GlassPanel>
    )
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border-2 border-bg-secondary bg-bg-primary p-8 shadow-soft">
      {formContent}
    </div>
  )
})
