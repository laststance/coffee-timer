'use client'

import { memo } from 'react'
import { SignUpForm } from '@/components/auth/SignUpForm'

const SignUpPage = memo(function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <SignUpForm />
    </main>
  )
})

export default SignUpPage
