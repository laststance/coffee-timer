# Coffee Timer - Design Specification

## 📋 Project Overview

**Purpose**: Simple, relaxing coffee timer application for 1-60+ minute intervals with web push notifications and customizable sound alerts.

**Target Users**: Individuals needing focused time tracking for tasks, meditation, cooking, study sessions, etc.

**Core Value**: Minimal, calm user experience with reliable notifications that work even when the browser is in the background.

---

## 🎯 Requirements

### Functional Requirements

- ✅ Timer for minutes to tens of minutes (1-99 minutes supported)
- ✅ Green-themed timer display (primary visual element)
- ✅ Web Push notifications on timer completion
- ✅ Sound alerts with multiple presets + "None" option
- ✅ Volume control (0-100%)
- ✅ Test notification feature
- ✅ Bilingual support (Japanese/English)
- ✅ Relaxed, calming UI design

### Non-Functional Requirements

- Performance: Fast load (<2s), minimal bundle size
- Accessibility: WCAG 2.1 AA compliance
- Browser Support: Modern browsers with Web Push API support
- PWA: Installable, works offline for core functionality
- Mobile-First: Responsive design, touch-friendly

---

## 🏗️ Technology Stack

### Core Framework

```json
{
  "framework": "Next.js 15.x (App Router)",
  "runtime": "React 19 RC",
  "language": "TypeScript 5.x",
  "packageManager": "pnpm"
}
```

### UI & Styling

- **Styling**: Tailwind CSS 4.x
- **Components**: Radix UI (headless, accessible)
  - `@radix-ui/react-slider` - Volume control
  - `@radix-ui/react-select` - Sound preset selector
  - `@radix-ui/react-dialog` - Settings modal
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`

### State & Data Management

- **Global State**: `zustand`
- **Persistence**: localStorage
- **Internationalization**: `next-intl` (App Router compatible)

### Audio & Notifications

- **Audio**: Web Audio API (native) or `howler.js`
- **PWA**: `@ducanh2912/next-pwa`
- **Push Notifications**: Web Push API + Service Worker

### Development Tools

- ESLint (code quality)
- Prettier (formatting)
- TypeScript strict mode

---

## 📁 Project Structure

```
coffee-timer/
├── app/
│   ├── [locale]/                    # i18n routing
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Main timer page
│   │   └── globals.css              # Tailwind base styles
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts             # Push subscription endpoint
│   └── manifest.ts                  # PWA manifest config
│
├── components/
│   ├── timer/
│   │   ├── TimerDisplay.tsx         # Main countdown display
│   │   ├── TimerControls.tsx        # Start/Pause/Reset buttons
│   │   └── TimeInput.tsx            # Time selection input
│   ├── settings/
│   │   ├── SettingsPanel.tsx        # Settings container
│   │   ├── SoundSelector.tsx        # Sound preset dropdown
│   │   ├── VolumeControl.tsx        # Volume slider
│   │   └── NotificationTest.tsx     # Test notification button
│   ├── ui/                          # Radix wrappers
│   │   ├── button.tsx
│   │   ├── slider.tsx
│   │   └── select.tsx
│   └── LanguageToggle.tsx           # JP/EN switcher
│
├── lib/
│   ├── stores/
│   │   ├── timerStore.ts            # Zustand timer state
│   │   └── settingsStore.ts         # Zustand settings state
│   ├── audio/
│   │   └── audioManager.ts          # Audio playback logic
│   ├── notifications/
│   │   ├── notificationManager.ts   # Notification logic
│   │   └── pushService.ts           # Push subscription
│   └── utils/
│       └── cn.ts                    # className utility
│
├── messages/
│   ├── en.json                      # English translations
│   └── ja.json                      # Japanese translations
│
├── public/
│   ├── sounds/                      # Audio files
│   │   ├── gentle-bell.mp3
│   │   ├── chime.mp3
│   │   ├── soft-alarm.mp3
│   │   └── digital-beep.mp3
│   ├── sw.js                        # Service Worker
│   └── icons/                       # PWA icons (various sizes)
│
├── i18n/
│   └── request.ts                   # next-intl configuration
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 UI/UX Design

### Design Philosophy

- **Calm & Minimal**: Reduce visual noise, focus on timer
- **Spacious**: Generous padding, breathing room
- **Smooth**: No harsh transitions, gentle animations
- **Accessible**: Keyboard nav, screen reader support, high contrast

### Color Palette (Relaxed Theme)

```css
/* Primary Colors */
--primary-green: #10b981; /* Timer display */
--primary-green-dark: #059669; /* Hover states */

/* Neutral Background */
--bg-primary: #faf9f6; /* Cream/warm white */
--bg-secondary: #f3f4f6; /* Slightly darker */

/* Text */
--text-primary: #374151; /* Soft dark gray */
--text-secondary: #6b7280; /* Muted gray */

/* Accents */
--accent-blue: #60a5fa; /* Info/link */
--accent-amber: #fbbf24; /* Warning */

/* Shadows */
--shadow-soft: 0 4px 6px -1px rgb(0 0 0 / 0.05);
```

### Typography

- **Display Font**: Inter or Plus Jakarta Sans
- **Timer Size**: 4-6rem (large, monospace-style)
- **Body Text**: 1rem (16px base)
- **Controls**: 0.875-1rem

### Layout

- **Center-focused**: Timer as hero element
- **Mobile-first**: Responsive breakpoints (sm, md, lg)
- **Grid**: Simple centered column layout
- **Spacing**: Consistent 4px/8px increments

---

## 🔧 Component Specifications

### 1. TimerDisplay Component

**Purpose**: Main visual timer countdown display

**Props**:

```typescript
interface TimerDisplayProps {
  timeRemaining: number // seconds
  isRunning: boolean
  isPaused: boolean
}
```

**Visual Design**:

- Large green text (4-6rem)
- Format: MM:SS
- Circular progress indicator (optional)
- Smooth countdown animation
- Pulse effect when running

**States**:

- Idle (gray)
- Running (green, animated)
- Paused (amber)
- Completed (red flash → green)

---

### 2. TimerControls Component

**Purpose**: Start, pause, reset controls

**Props**:

```typescript
interface TimerControlsProps {
  onStart: () => void
  onPause: () => void
  onReset: () => void
  isRunning: boolean
  isPaused: boolean
}
```

**Buttons**:

- **Start**: Primary button (green)
- **Pause**: Secondary button (amber)
- **Reset**: Tertiary button (gray)

**Layout**: Horizontal row, centered, responsive

---

### 3. TimeInput Component

**Purpose**: Select timer duration

**Props**:

```typescript
interface TimeInputProps {
  onTimeChange: (minutes: number, seconds: number) => void
  disabled: boolean // disabled when running
}
```

**Design**:

- Two number inputs: Minutes (0-99), Seconds (0-59)
- Large touch-friendly inputs
- Clear labels (i18n)
- Validation feedback

---

### 4. SettingsPanel Component

**Purpose**: Consolidated settings (sound, volume, language)

**Props**:

```typescript
interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}
```

**Contains**:

- SoundSelector
- VolumeControl
- NotificationTest
- LanguageToggle

**Design**: Modal or slide-out panel

---

### 5. SoundSelector Component

**Purpose**: Choose sound preset

**Props**:

```typescript
interface SoundSelectorProps {
  value: SoundPreset
  onChange: (preset: SoundPreset) => void
}

type SoundPreset =
  | 'gentle-bell'
  | 'chime'
  | 'soft-alarm'
  | 'digital-beep'
  | 'none'
```

**Design**: Radix Select dropdown with preview button

---

### 6. VolumeControl Component

**Purpose**: Adjust sound volume

**Props**:

```typescript
interface VolumeControlProps {
  value: number // 0-100
  onChange: (volume: number) => void
}
```

**Design**: Radix Slider with percentage display

---

### 7. NotificationTest Component

**Purpose**: Test notification + sound

**Props**:

```typescript
interface NotificationTestProps {
  soundPreset: SoundPreset
  volume: number
}
```

**Design**: Button that triggers test notification

---

### 8. LanguageToggle Component

**Purpose**: Switch between JP/EN

**Props**:

```typescript
interface LanguageToggleProps {
  currentLocale: 'ja' | 'en'
  onLocaleChange: (locale: 'ja' | 'en') => void
}
```

**Design**: Toggle switch or flag icons

---

## 📊 State Management

### Timer Store (Zustand)

```typescript
interface TimerState {
  // State
  timeRemaining: number // seconds
  initialTime: number // seconds
  isRunning: boolean
  isPaused: boolean

  // Actions
  setTime: (minutes: number, seconds: number) => void
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void // Decrease by 1 second
}
```

**Persistence**: Save to localStorage on state change

---

### Settings Store (Zustand)

```typescript
interface SettingsState {
  // State
  soundPreset: SoundPreset
  volume: number // 0-100
  locale: 'ja' | 'en'
  notificationPermission: NotificationPermission

  // Actions
  setSoundPreset: (preset: SoundPreset) => void
  setVolume: (volume: number) => void
  setLocale: (locale: 'ja' | 'en') => void
  updateNotificationPermission: () => void
}
```

**Persistence**: Save to localStorage

---

## 🔔 Notification System

### Permission Flow

1. **First Visit**: Show permission explanation
2. **User Action**: Request permission on button click
3. **Granted**: Register service worker + subscribe to push
4. **Denied**: Fall back to in-app notifications

### Service Worker Implementation

```typescript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json()

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'timer-complete',
    requireInteraction: true,
    vibrate: [200, 100, 200],
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
```

### Push Subscription

- **VAPID Keys**: Generate for push service
- **Subscription Endpoint**: `/api/subscribe` (POST)
- **Storage**: Save subscription to localStorage or backend

### Trigger Notification

```typescript
// On timer completion
if (timerState.timeRemaining === 0) {
  // Play sound
  audioManager.play(settings.soundPreset, settings.volume)

  // Show notification
  if (settings.notificationPermission === 'granted') {
    notificationManager.show({
      title: t('notification.title'), // i18n
      body: t('notification.body'),
    })
  }
}
```

---

## 🔊 Audio System

### Sound Preset Files

| Preset       | File               | Description        |
| ------------ | ------------------ | ------------------ |
| Gentle Bell  | `gentle-bell.mp3`  | Soft, calming bell |
| Chime        | `chime.mp3`        | Wind chime sound   |
| Soft Alarm   | `soft-alarm.mp3`   | Gentle wake-up     |
| Digital Beep | `digital-beep.mp3` | Modern beep        |
| None         | -                  | Silent mode        |

### Audio Manager

```typescript
class AudioManager {
  private audio: HTMLAudioElement | null = null

  play(preset: SoundPreset, volume: number) {
    if (preset === 'none') return

    this.audio = new Audio(`/sounds/${preset}.mp3`)
    this.audio.volume = volume / 100
    this.audio.play()
  }

  stop() {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
  }
}
```

---

## 🌐 Internationalization

### Supported Languages

- **Japanese (ja)**: Primary language
- **English (en)**: Secondary language

### Translation Keys Structure

```json
{
  "timer": {
    "title": "Timer",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "start": "Start",
    "pause": "Pause",
    "reset": "Reset"
  },
  "settings": {
    "title": "Settings",
    "sound": "Sound",
    "volume": "Volume",
    "testNotification": "Test Notification"
  },
  "notification": {
    "title": "Timer Complete!",
    "body": "Your timer has finished.",
    "permission": {
      "request": "Enable notifications",
      "granted": "Notifications enabled",
      "denied": "Notifications blocked"
    }
  },
  "sounds": {
    "gentle-bell": "Gentle Bell",
    "chime": "Chime",
    "soft-alarm": "Soft Alarm",
    "digital-beep": "Digital Beep",
    "none": "None"
  }
}
```

### Implementation

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 🚀 PWA Configuration

### Manifest

```json
{
  "name": "Coffee Timer",
  "short_name": "Timer",
  "description": "Simple timer with notifications",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF9F6",
  "theme_color": "#10B981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Features

- Push notification handling
- Offline fallback (basic)
- Asset caching (optional)

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- **Color Contrast**: Minimum 4.5:1 for text
- **Keyboard Navigation**: All interactive elements accessible
- **Focus Indicators**: Visible focus states
- **Screen Readers**: ARIA labels, semantic HTML
- **Reduced Motion**: Respect `prefers-reduced-motion`

### Implementation

```tsx
// Example: TimerDisplay with ARIA
<div
  role="timer"
  aria-live="polite"
  aria-label={t('timer.countdown')}
  className="text-6xl font-mono text-green-600"
>
  {formatTime(timeRemaining)}
</div>
```

---

## 🔒 Security & Privacy

### Push Notifications

- **VAPID Keys**: Securely stored on server
- **Subscription Data**: Encrypted, minimal storage
- **Permissions**: User-controlled, revocable

### Data Storage

- **localStorage Only**: No external data transmission
- **No Analytics**: Privacy-first approach
- **No Cookies**: Session data in localStorage

---

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large screens */
```

### Layout Adjustments

- **Mobile (<640px)**: Single column, stacked controls
- **Tablet (640-1024px)**: Centered content, comfortable touch targets
- **Desktop (>1024px)**: Optimal width (max 600-800px), centered

---

## 🧪 Testing Strategy

### Unit Tests

- Timer logic (tick, start, pause, reset)
- Audio manager (play, stop, volume)
- Notification manager (permission, show)

### Integration Tests

- Timer → Notification flow
- Settings → Audio playback
- Locale switching

### E2E Tests (Playwright)

- Complete timer flow
- Notification permission flow
- Settings persistence

---

## 📦 Deployment

### Build Process

```bash
pnpm install
pnpm build
pnpm start
```

### Environment Variables

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-vapid-public-key>
VAPID_PRIVATE_KEY=<your-vapid-private-key>
```

### Hosting Recommendations

- **Vercel**: Optimized for Next.js
- **Netlify**: Good PWA support
- **Cloudflare Pages**: Fast global CDN

---

## 🗺️ Implementation Roadmap

### Phase 1: Core Timer (Week 1)

- [x] Project setup (Next.js 15, TypeScript, Tailwind)
- [ ] Basic timer state (Zustand)
- [ ] TimerDisplay component
- [ ] TimerControls component
- [ ] TimeInput component
- [ ] Basic UI theme

### Phase 2: Settings & Audio (Week 2)

- [ ] Audio manager implementation
- [ ] Sound preset files
- [ ] SoundSelector component
- [ ] VolumeControl component
- [ ] Settings persistence

### Phase 3: Internationalization (Week 2-3)

- [ ] next-intl setup
- [ ] Translation files (JP/EN)
- [ ] LanguageToggle component
- [ ] Locale routing

### Phase 4: Notifications (Week 3-4)

- [ ] Permission flow
- [ ] Service Worker setup
- [ ] Push notification integration
- [ ] NotificationTest component
- [ ] Fallback notifications

### Phase 5: PWA & Polish (Week 4-5)

- [ ] PWA manifest
- [ ] Icon generation
- [ ] Offline support
- [ ] Accessibility audit
- [ ] Performance optimization

### Phase 6: Testing & Launch (Week 5-6)

- [ ] Unit tests
- [ ] E2E tests
- [ ] Cross-browser testing
- [ ] Production deployment
- [ ] User feedback iteration

---

## 📚 References

### Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [next-intl Docs](https://next-intl.dev/docs/getting-started/app-router)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

### Tools

- [VAPID Key Generator](https://vapidkeys.com/)
- [PWA Icon Generator](https://www.pwabuilder.com/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## ✅ Success Criteria

### Functional

- ✅ Timer counts down accurately
- ✅ Notifications work reliably (even in background)
- ✅ Sound plays on completion
- ✅ Settings persist across sessions
- ✅ Works in both JP and EN

### Non-Functional

- ✅ Page load <2 seconds
- ✅ Lighthouse score >90 (all metrics)
- ✅ WCAG 2.1 AA compliant
- ✅ Works on Chrome, Safari, Firefox (latest versions)
- ✅ Mobile-responsive (320px - 1920px)

---

## 📝 Notes

### Browser Compatibility

- **Push Notifications**: Limited on iOS Safari (requires PWA install)
- **Service Workers**: HTTPS required (except localhost)
- **Audio Autoplay**: May require user interaction

### Future Enhancements (v2)

- Multiple timers
- Timer presets (Pomodoro, etc.)
- Statistics/history
- Cloud sync
- Dark mode
- More sound options
- Custom timer durations (hours)

---

**Design Version**: 1.0
**Last Updated**: 2025-10-02
**Status**: Ready for Implementation
