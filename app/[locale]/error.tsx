'use client'

import { memo } from 'react'
import { useErrorLogger } from '@/lib/hooks/useErrorLogger'

const Error = memo(function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useErrorLogger(error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          An error occurred while loading the application.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary-green px-6 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-primary-green-dark"
        >
          Try again
        </button>
      </div>
    </div>
  )
})

export default Error
