'use client'

import { memo } from 'react'
import { SignInForm } from '@/components/auth/SignInForm'

const SignInPage = memo(function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <SignInForm />
    </main>
  )
})

export default SignInPage
