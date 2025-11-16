# UI Component Designs

This document contains visual component designs and implementation guides for the Coffee Timer application.

## 1. Circular Countdown Timer

### Visual Design

- **Type**: Circular progress indicator with centered time display
- **Colors**: Emerald green (#10B981) with soft shadows and glow effects
- **Size**: 280x280px SVG with 120px radius
- **Animation**: Smooth 1-second transitions for progress updates

### Key Features

- Circular SVG progress ring that depletes as time counts down
- Large monospace MM:SS time display in center
- Status text below timer ("Running", "Paused", "Complete")
- Outer glow effect for visual appeal
- Responsive to timer state changes

### Implementation Notes

```tsx
// Progress calculation
const progress = (timeLeft / totalTime) * 100
const circumference = 2 * Math.PI * 120
const strokeDashoffset = circumference - (progress / 100) * circumference

// SVG Circle
;<circle
  cx="140"
  cy="140"
  r="120"
  stroke="#10B981"
  strokeDasharray={circumference}
  strokeDashoffset={strokeDashoffset}
  className="transition-all duration-1000"
/>
```

### Component File

See the Magic MCP output above for complete implementation in:

- `CircularCountdownTimer` component
- Uses `lucide-react` icons (Play, Pause, RotateCcw)
- Radix UI Button component with custom styling

---

## 2. Timer Controls

### Visual Design

```
[Play/Pause]  [Reset]
  (Green)     (Outlined)
```

- **Play/Pause Button**:
  - Circular (64x64px)
  - Emerald green (#10B981)
  - Shadow effect
  - Hover scale animation
  - Icon changes based on state

- **Reset Button**:
  - Circular (64x64px)
  - Outlined with emerald border
  - Lighter background on hover
  - RotateCcw icon

### States

- **Disabled**: Grayed out when timer is at 0
- **Hover**: Scale up slightly (1.05x)
- **Active**: Visual press feedback

---

## 3. Time Input Component

### Visual Design

```
Minutes: [__]  Seconds: [__]
   (0-99)        (0-59)
```

### Features

- Two separate number inputs
- Large touch-friendly size (min 48x48px)
- Clear labels (internationalized)
- Input validation (minutes: 0-99, seconds: 0-59)
- Disabled during timer running

### Styling

```tsx
<div className="flex gap-6 items-center">
  <div className="flex flex-col gap-2">
    <label className="text-sm text-emerald-600 font-medium">
      {t('timer.minutes')}
    </label>
    <input
      type="number"
      min="0"
      max="99"
      className="w-20 h-12 text-center text-2xl rounded-lg border-2
                 border-emerald-300 focus:border-emerald-500
                 focus:ring-2 focus:ring-emerald-200"
      disabled={isRunning}
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="text-sm text-emerald-600 font-medium">
      {t('timer.seconds')}
    </label>
    <input
      type="number"
      min="0"
      max="59"
      className="w-20 h-12 text-center text-2xl rounded-lg border-2
                 border-emerald-300 focus:border-emerald-500
                 focus:ring-2 focus:ring-emerald-200"
      disabled={isRunning}
    />
  </div>
</div>
```

---

## 4. Settings Panel

### Visual Design

- **Type**: Modal dialog or slide-out panel
- **Trigger**: Settings icon button (top-right corner)
- **Background**: White with soft shadow
- **Layout**: Vertical stack of settings sections

### Structure

```
┌─────────────────────────────┐
│  Settings                   │
├─────────────────────────────┤
│  Sound Preset               │
│  [Dropdown ▼]               │
│                             │
│  Volume                     │
│  [────●────────] 75%        │
│                             │
│  Language                   │
│  [ EN | JP ]                │
│                             │
│  Notifications              │
│  [Test Notification]        │
│                             │
│  [Close]                    │
└─────────────────────────────┘
```

### Implementation

```tsx
import { Dialog, DialogContent } from '@radix-ui/react-dialog'
;<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-xl">
    <h2 className="text-2xl font-bold text-emerald-600 mb-6">
      {t('settings.title')}
    </h2>

    {/* Settings sections */}
    <div className="space-y-6">
      <SoundSelector />
      <VolumeControl />
      <LanguageToggle />
      <NotificationTest />
    </div>
  </DialogContent>
</Dialog>
```

---

## 5. Sound Selector

### Visual Design

```
Sound
[Gentle Bell ▼]
```

- **Type**: Radix UI Select dropdown
- **Options**:
  - Gentle Bell
  - Chime
  - Soft Alarm
  - Digital Beep
  - None

### Features

- Preview button (play icon) next to dropdown
- Selected option highlighted in emerald
- Smooth open/close animation

### Implementation

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select'
;<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    {t('settings.sound')}
  </label>

  <div className="flex gap-2">
    <Select value={soundPreset} onValueChange={setSoundPreset}>
      <SelectTrigger
        className="flex-1 h-10 px-3 rounded-lg border-2
                                border-emerald-300 focus:border-emerald-500"
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-white rounded-lg shadow-lg border">
        <SelectItem value="gentle-bell">{t('sounds.gentle-bell')}</SelectItem>
        <SelectItem value="chime">{t('sounds.chime')}</SelectItem>
        <SelectItem value="soft-alarm">{t('sounds.soft-alarm')}</SelectItem>
        <SelectItem value="digital-beep">{t('sounds.digital-beep')}</SelectItem>
        <SelectItem value="none">{t('sounds.none')}</SelectItem>
      </SelectContent>
    </Select>

    <Button
      variant="outline"
      size="icon"
      onClick={playPreview}
      className="h-10 w-10"
    >
      <PlayIcon />
    </Button>
  </div>
</div>
```

---

## 6. Volume Control

### Visual Design

```
Volume
[────●────────] 75%
```

- **Type**: Radix UI Slider
- **Range**: 0-100
- **Visual**: Green track with circular thumb
- **Display**: Percentage value beside slider

### Implementation

```tsx
import { Slider } from '@radix-ui/react-slider'
;<div className="space-y-2">
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-gray-700">
      {t('settings.volume')}
    </label>
    <span className="text-sm text-emerald-600 font-medium">{volume}%</span>
  </div>

  <Slider
    value={[volume]}
    onValueChange={([val]) => setVolume(val)}
    min={0}
    max={100}
    step={1}
    className="relative flex items-center w-full h-5"
  >
    <Slider.Track className="relative h-2 w-full rounded-full bg-emerald-200">
      <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
    </Slider.Track>

    <Slider.Thumb
      className="block w-5 h-5 bg-white border-2
                             border-emerald-500 rounded-full
                             shadow-md cursor-pointer
                             focus:outline-none focus:ring-2
                             focus:ring-emerald-300"
    />
  </Slider>
</div>
```

---

## 7. Language Toggle

### Visual Design

```
Language
[ EN | JP ]
```

- **Type**: Segmented control / Toggle group
- **States**: Active (emerald fill), Inactive (white)
- **Animation**: Smooth background transition

### Implementation

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    {t('settings.language')}
  </label>

  <div className="inline-flex rounded-lg border-2 border-emerald-300 p-1">
    <button
      onClick={() => setLocale('en')}
      className={cn(
        'px-6 py-2 rounded-md font-medium transition-all',
        locale === 'en'
          ? 'bg-emerald-500 text-white'
          : 'text-emerald-600 hover:bg-emerald-50',
      )}
    >
      EN
    </button>

    <button
      onClick={() => setLocale('ja')}
      className={cn(
        'px-6 py-2 rounded-md font-medium transition-all',
        locale === 'ja'
          ? 'bg-emerald-500 text-white'
          : 'text-emerald-600 hover:bg-emerald-50',
      )}
    >
      JP
    </button>
  </div>
</div>
```

---

## 8. Notification Test Button

### Visual Design

```
Notifications
[Test Notification]
```

- **Type**: Secondary button
- **Purpose**: Trigger test notification + sound
- **Feedback**: Loading state during test

### Implementation

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    {t('settings.notifications')}
  </label>

  <Button
    onClick={handleTestNotification}
    variant="outline"
    className="w-full border-2 border-emerald-300
               text-emerald-600 hover:bg-emerald-50"
    disabled={isTesting}
  >
    {isTesting ? (
      <>
        <LoadingIcon className="animate-spin mr-2" />
        {t('settings.testing')}
      </>
    ) : (
      <>
        <BellIcon className="mr-2" />
        {t('settings.testNotification')}
      </>
    )}
  </Button>

  {/* Permission status */}
  <div className="text-xs text-gray-500 mt-1">
    {permissionStatus === 'granted' && (
      <span className="text-emerald-600">
        ✓ {t('notification.permission.granted')}
      </span>
    )}
    {permissionStatus === 'denied' && (
      <span className="text-amber-600">
        ⚠ {t('notification.permission.denied')}
      </span>
    )}
  </div>
</div>
```

---

## 9. Layout & Responsive Design

### Mobile (<640px)

```
┌──────────────────┐
│   [Settings ⚙]  │
│                  │
│   ┌────────┐     │
│   │ Timer  │     │
│   └────────┘     │
│                  │
│   [▶]  [↻]      │
│                  │
│   [Minutes][Sec] │
│                  │
│   [ EN | JP ]    │
└──────────────────┘
```

### Desktop (>1024px)

```
┌────────────────────────────┐
│         [Settings ⚙]       │
│                            │
│      ┌──────────┐          │
│      │          │          │
│      │  Timer   │          │
│      │          │          │
│      └──────────┘          │
│                            │
│       [▶]  [↻]            │
│                            │
│    [Minutes]  [Seconds]    │
│                            │
│       [ EN | JP ]          │
└────────────────────────────┘
```

### Breakpoints

```css
/* Mobile: Default (single column, full width) */
.container {
  @apply flex flex-col items-center gap-6 p-4;
}

/* Tablet: 640px+ (slightly wider) */
@media (min-width: 640px) {
  .container {
    @apply gap-8 p-8;
  }
}

/* Desktop: 1024px+ (max width, centered) */
@media (min-width: 1024px) {
  .container {
    @apply max-w-2xl mx-auto;
  }
}
```

---

## 10. Accessibility Checklist

### ARIA Labels

```tsx
// Timer display
<div role="timer" aria-live="polite" aria-label={t('timer.countdown')}>
  {formattedTime}
</div>

// Play/Pause button
<button aria-label={isRunning ? t('timer.pause') : t('timer.start')}>
  {isRunning ? <PauseIcon /> : <PlayIcon />}
</button>

// Volume slider
<Slider aria-label={t('settings.volume')} aria-valuemin={0} aria-valuemax={100}>
```

### Keyboard Navigation

- Tab: Move between controls
- Space/Enter: Activate buttons
- Arrow keys: Adjust slider values
- Esc: Close settings panel

### Focus Indicators

```css
.focus-visible {
  @apply ring-2 ring-emerald-300 ring-offset-2;
}
```

### Color Contrast

- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Emerald (#10B981) on white: ~3.8:1 (use darker for small text)

---

## 11. Animation Guidelines

### Timing Functions

```css
/* Smooth easing for UI transitions */
.transition-smooth {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Timer countdown (linear for accuracy) */
.timer-progress {
  transition-timing-function: linear;
}
```

### Durations

- Hover states: 150-200ms
- Panel open/close: 300ms
- Timer countdown: 1000ms (1 second)
- Button press: 100ms

### Reduced Motion

```tsx
// Respect user preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<div className={cn(
  'transition-all',
  prefersReducedMotion ? 'duration-0' : 'duration-300'
)}>
```

---

## Component Dependencies

### Required NPM Packages

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.0.0-rc",
    "typescript": "^5.x",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-slider": "latest",
    "@radix-ui/react-slot": "latest",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "framer-motion": "latest",
    "zustand": "latest",
    "next-intl": "latest"
  }
}
```

---

## Color Reference

### Primary Palette

```css
/* Green (Timer) */
--emerald-50: #ecfdf5;
--emerald-100: #d1fae5;
--emerald-200: #a7f3d0;
--emerald-300: #6ee7b7;
--emerald-500: #10b981; /* Primary */
--emerald-600: #059669; /* Hover */
--emerald-700: #047857;

/* Neutral (Background) */
--warm-white: #faf9f6;
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-700: #374151; /* Text */
--gray-500: #6b7280; /* Secondary text */

/* Accent */
--amber-500: #f59e0b; /* Pause state */
--red-500: #ef4444; /* Complete flash */
```

---

**Status**: Component designs complete and ready for implementation
**Next Steps**: Begin implementation following the roadmap in DESIGN.md
