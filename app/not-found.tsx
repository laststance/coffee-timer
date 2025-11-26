import { memo } from 'react'

const NotFound = memo(function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  )
})

export default NotFound
