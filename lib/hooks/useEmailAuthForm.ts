'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth-client'

/**
 * Keeps submissions retryable for {@link SignUpForm} and {@link SignInForm} when authentication fails.
 * @param mode - Selects account creation or existing-account authentication.
 * @returns Controlled fields, localized errors, and a form action with automatic pending state.
 * @example
 * const { fields, setFields, submitAction, error, isPending } = useEmailAuthForm('sign-up')
 */
export function useEmailAuthForm(mode: 'sign-up' | 'sign-in') {
  const translate = useTranslations('Auth')
  const router = useRouter()
  const [fields, setFields] = useState({ name: '', email: '', password: '' })

  /**
   * Submits the form through {@link authClient}; React releases pending state after every handled result.
   * @returns A localized failure message, or an empty message after navigating home.
   * @example
   * <form action={submitAction}>...</form>
   */
  async function authenticateAction() {
    try {
      const result =
        mode === 'sign-up'
          ? await authClient.signUp.email(fields)
          : await authClient.signIn.email({
              email: fields.email,
              password: fields.password,
            })

      // Server responses may contain internal details; show only translated messages.
      if (result.error) {
        return result.error.status >= 500
          ? translate('serverError')
          : translate(mode === 'sign-up' ? 'signUpError' : 'signInError')
      }

      router.push('/')
      router.refresh()
      return ''
    } catch {
      // Offline requests and timeouts throw before Better Auth's HTTP error callbacks.
      return translate('networkError')
    }
  }

  const [error, submitAction, isPending] = useActionState(
    authenticateAction,
    '',
  )

  return {
    fields,
    setFields,
    submitAction,
    error: isPending ? '' : error,
    isPending,
  }
}
