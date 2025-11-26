import nextConfig from 'eslint-config-next'
import lastStanceReactNextPlugin from '@laststance/react-next-eslint-plugin'

const config = [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
  {
    plugins: {
      '@laststance/react-next': lastStanceReactNextPlugin,
    },
    rules: {
      '@laststance/react-next/no-jsx-without-return': 'error',
      '@laststance/react-next/all-memo': 'error',
      '@laststance/react-next/no-use-reducer': 'error',
      '@laststance/react-next/no-set-state-prop-drilling': 'error',
      '@laststance/react-next/no-deopt-use-callback': 'error',
      '@laststance/react-next/no-deopt-use-memo': 'error',
      '@laststance/react-next/no-direct-use-effect': 'error',
      '@laststance/react-next/prefer-stable-context-value': 'error',
      '@laststance/react-next/no-unstable-classname-prop': 'error',
      '@laststance/react-next/prefer-usecallback-might-work': 'error',
      '@laststance/react-next/prefer-usecallback-for-memoized-component':
        'error',
      '@laststance/react-next/prefer-usememo-for-memoized-component': 'error',
      '@laststance/react-next/prefer-usememo-might-work': 'error',
    },
  },
  ...nextConfig,
]

export default config
