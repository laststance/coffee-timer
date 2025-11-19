# Coffee Timer

> A simple and relaxing timer application with web push notifications, customizable sounds, and bilingual support.

[![Production Ready](https://img.shields.io/badge/status-production-success)](https://github.com/laststance/coffee-timer)
[![CI Status](https://img.shields.io/badge/CI-passing-brightgreen)](https://github.com/laststance/coffee-timer/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Overview

Coffee Timer is a Progressive Web App (PWA) designed for simple, distraction-free time tracking. Built with modern web technologies, it offers a relaxing user experience with smooth animations, customizable sound presets, and reliable background notifications.

**Key Features:**

- ⏱️ Intuitive circular timer display with up to 24-hour sessions
- 🔔 Web Push notifications (works even when tab is closed)
- 🔊 9 customizable sound presets with volume control
- 🌍 Bilingual support (English/Japanese)
- 📱 Progressive Web App - installable on mobile and desktop
- ♿ WCAG 2.1 AA accessibility compliant
- 🎨 Calm, relaxing color scheme

For detailed design specifications, see [DESIGN.md](./DESIGN.md) and [UI_COMPONENTS.md](./UI_COMPONENTS.md).

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# → Open http://localhost:3009

# Build for production
pnpm build
pnpm start

# Run E2E tests
pnpm e2e
```

## Tech Stack

**Core Framework:**

- [Next.js](https://nextjs.org/) 16.0.3 (App Router)
- [React](https://react.dev/) 19.2.0
- [TypeScript](https://www.typescriptlang.org/) 5.9.3
- [Tailwind CSS](https://tailwindcss.com/) 4.1.17
- [Node.js](https://nodejs.org/) 22.21.1
- [pnpm](https://pnpm.io/) 10.20.0

**Key Dependencies:**

- [next-intl](https://next-intl.dev/) 4.5.3 - Internationalization
- [Zustand](https://github.com/pmndrs/zustand) 5.0.8 - State management with localStorage persistence
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components (Dialog, Select, Slider)
- [Framer Motion](https://www.framer.com/motion/) 12.23.24 - Smooth animations
- [Lucide React](https://lucide.dev/) 0.553.0 - Icon system

**Development & Testing:**

- [Playwright](https://playwright.dev/) 1.56.1 - E2E testing with axe-core accessibility checks
- [ESLint](https://eslint.org/) 9.39.1 - Code linting with zero-warning policy
- [Prettier](https://prettier.io/) 3.6.2 - Code formatting
- [Husky](https://typicode.github.io/husky/) 9.1.7 - Git hooks with lint-staged

## Features

**Timer Functionality:**

- Circular countdown timer with SVG progress visualization
- Color-coded states (green: running, amber: paused, red: complete)
- Smooth animations and pulse effects
- Precise time range from quick sessions to full 24-hour brews
- Start/Pause/Reset controls

**Audio System:**

- 9 professionally recorded sound presets
- Volume control (0-100%)
- Sound preview functionality
- "None" option for silent mode
- Persistent audio preferences

**Notifications:**

- Service Worker-based push notifications
- Background notification support (works when tab closed)
- Permission management with browser integration
- Test notification functionality
- Cross-browser compatible

**Internationalization:**

- English and Japanese language support
- Locale-based routing (`/en/`, `/ja/`)
- Static site generation for both locales
- Seamless language switching
- Complete UI translation coverage

**Progressive Web App:**

- Installable on mobile and desktop
- Offline capability with Service Worker
- App shortcuts (Start Timer, Settings)
- Multiple icon sizes with maskable variants
- Share target integration

**Accessibility:**

- WCAG 2.1 Level AA compliant
- 4.5:1 minimum color contrast ratios
- 44x44px minimum touch targets
- Full keyboard navigation support
- Screen reader optimized with ARIA labels
- Focus management with Radix UI

## Development

### Testing

```bash
# Run all E2E tests
pnpm e2e

# Platform-specific testing
pnpm e2e:desktop      # Desktop Chrome
pnpm e2e:tablet       # Tablet Safari
pnpm e2e:mobile       # Mobile Chrome

# Test suites
# - accessibility.spec.ts (WCAG 2.1 AA compliance)
# - timer-behavior.spec.ts (Core timer functionality)
# - sound.spec.ts (Audio system)
# - background-timer.spec.ts (Background execution)
```

### Code Quality

```bash
# Linting
pnpm lint              # Check for errors
pnpm lint:fix          # Auto-fix issues

# Type checking
pnpm typecheck         # TypeScript compilation check

# Formatting
pnpm prettier          # Format all files
```

### CI/CD

The project uses GitHub Actions with 6 automated workflows:

- **Build** - Next.js production build validation
- **Lint** - ESLint with zero-warning enforcement
- **Type Check** - TypeScript compilation verification
- **E2E Mobile** - Mobile Chrome automated testing
- **E2E Tablet** - Tablet Safari automated testing
- **E2E Desktop** - Desktop Chrome automated testing

**Current Status:** 🟢 All workflows passing (100% success rate)

## Design System

### Color Palette

```css
/* Primary Colors */
--color-primary-green: #059669; /* Main actions, timer active */
--color-bg-primary: #f8fafc; /* Primary background */
--color-bg-secondary: #ffffff; /* Secondary background */
--color-text-primary: #1e293b; /* Primary text */
--color-text-secondary: #64748b; /* Secondary text */
```

### Typography

- **Font Family:** System font stack (Inter, Plus Jakarta Sans fallback)
- **Timer Display:** 4-6rem, monospace-style for consistency
- **Body Text:** 1rem (16px) for optimal readability
- **Headings:** 1.5-2rem with appropriate line height

### Components

- **Radix UI Primitives** - Accessible, unstyled component foundation
- **Tailwind CSS** - Utility-first styling with custom theme
- **Framer Motion** - Smooth, performant animations
- **SVG Graphics** - Circular timer with precise rendering

## Technical Decisions

### 1. Next.js App Router

- Server Components by default for optimal performance
- React 19 with latest features and improvements
- File-system based routing with locale support
- Built-in optimization (images, fonts, scripts)

### 2. Service Worker + Web Push API

- Background notifications even when browser closed
- VAPID key authentication for secure push
- Cross-browser compatibility layer
- Graceful degradation for unsupported browsers

### 3. Zustand State Management

- Minimal bundle size (< 1KB)
- TypeScript-first with excellent type inference
- localStorage persistence middleware
- Simple, predictable state updates

### 4. next-intl for i18n

- Native App Router support with server components
- Type-safe translation keys
- Server-side rendering compatible
- Easy to add additional locales

## Documentation

### Project Documentation

- [DESIGN.md](./DESIGN.md) - Complete system design specifications
- [CLAUDE.md](./CLAUDE.md) - Development guidelines for AI assistance
- [UI_COMPONENTS.md](./UI_COMPONENTS.md) - UI component designs (if available)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Guide](https://next-intl.dev/docs/getting-started/app-router)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Web Push API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Playwright Testing](https://playwright.dev/)

### Tools

- [VAPID Key Generator](https://vapidkeys.com/) - For web push setup
- [PWA Icon Generator](https://www.pwabuilder.com/) - Icon asset creation

## Success Metrics

**Functional Requirements:** ✅

- Timer accurately counts down to zero
- Notifications reliably trigger in background
- Sound plays at completion with correct preset
- Settings persist across sessions
- Both languages function correctly

**Non-Functional Requirements:** ✅

- Page load < 2 seconds
- Lighthouse score > 90 (all metrics)
- WCAG 2.1 AA compliance verified
- Chrome, Safari, Firefox support (latest versions)
- Mobile responsive 320px - 1920px

## Project Status

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** November 2025
**Node Version:** 22.21.1
**Package Manager:** pnpm 10.20.0

---

**License:** MIT
**Repository:** [github.com/laststance/coffee-timer](https://github.com/laststance/coffee-timer)
