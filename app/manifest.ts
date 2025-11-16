import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coffee Timer',
    short_name: 'CoffeeTimer',
    description:
      'Simple, relaxing coffee timer application with web push notifications',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F9FAFB',
    theme_color: '#10B981',
    categories: ['productivity', 'utilities', 'lifestyle'],
    icons: [
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192-safe.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/badge.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'monochrome',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Coffee Timer - Desktop View',
      },
      {
        src: '/screenshots/mobile-narrow.png',
        sizes: '375x812',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Coffee Timer - Mobile View',
      },
    ],
    shortcuts: [
      {
        name: 'Start Timer',
        short_name: 'Start',
        description: 'Quickly start a timer',
        url: '/?action=start',
        icons: [
          {
            src: '/shortcuts/start.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Settings',
        short_name: 'Settings',
        description: 'Open timer settings',
        url: '/?action=settings',
        icons: [
          {
            src: '/shortcuts/settings.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
    share_target: {
      action: '/share-target/',
      method: 'GET',
      enctype: 'application/x-www-form-urlencoded',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    },
  }
}
