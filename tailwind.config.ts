import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: 'var(--color-primary-green)',
          'green-dark': 'var(--color-primary-green-dark)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        accent: {
          blue: 'var(--color-accent-blue)',
          amber: 'var(--color-accent-amber)',
        },
        heatmap: {
          empty: 'var(--heatmap-empty)',
          'level-1': 'var(--heatmap-level-1)',
          'level-2': 'var(--heatmap-level-2)',
          'level-3': 'var(--heatmap-level-3)',
          'level-4': 'var(--heatmap-level-4)',
          selected: 'var(--heatmap-selected)',
        },
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
    },
  },
  plugins: [],
}

export default config
