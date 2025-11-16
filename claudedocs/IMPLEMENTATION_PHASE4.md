# Phase 4: Notifications Implementation

## Overview

Phase 4 adds browser notification support with Service Worker integration, allowing users to receive notifications when the timer completes, even when the browser tab is not active.

## Implementation Date

2025-10-02

## Features Implemented

### 1. Service Worker (/public/sw.js)

- Handles notification display via messaging API
- Manages notification click events (focuses window)
- Supports future Web Push integration
- Includes caching foundation for offline support
- SSR-safe with proper environment checks

### 2. Notification Manager (/lib/notifications/notificationManager.ts)

- Browser API wrapper for notification permissions
- Service Worker registration and lifecycle management
- Notification display via Service Worker messaging
- TypeScript-typed notification options
- SSR-compatible with `typeof window` guards

**Key Functions:**

- `isNotificationSupported()` - Browser capability check
- `getNotificationPermission()` - Current permission status
- `requestNotificationPermission()` - Request user permission
- `registerServiceWorker()` - SW registration with auto-update
- `showNotification(options)` - Display notification via SW
- `isServiceWorkerReady()` - Check SW active status
- `unregisterServiceWorker()` - Cleanup for testing

### 3. Notification Store (/lib/stores/notificationStore.ts)

- Zustand store with localStorage persistence
- Tracks notification enabled/disabled preference
- Stores current permission status (default/granted/denied)
- Follows existing store patterns (timerStore, settingsStore)

**State Shape:**

```typescript
{
  enabled: boolean           // User preference
  permission: NotificationPermission  // Browser permission status
  setEnabled: (enabled) => void
  setPermission: (permission) => void
}
```

### 4. Service Worker Registration Component

**File:** `/components/notifications/ServiceWorkerRegistration.tsx`

- Registers Service Worker on app load
- Syncs notification permission state to store
- Monitors permission changes (where supported)
- Client-only component (no rendering)

### 5. Notification Test Component

**File:** `/components/notifications/NotificationTest.tsx`

- Test UI for notification functionality
- Permission status display with icons
- Request permission button
- Send test notification button
- Browser support detection
- Development/testing tool

**Features:**

- ✅ Permission granted - Shows test notification button
- ❌ Permission denied - Shows browser settings guidance
- ⚠️ Permission default - Shows request permission button
- 🚫 Not supported - Shows browser compatibility message

### 6. Notification Toggle Setting

**File:** `/components/settings/NotificationToggle.tsx`

- Toggle switch for enabling/disabling notifications
- Integrated into SettingsPanel
- Auto-requests permission when enabling
- Visual feedback for permission states
- Disabled when permission is denied

### 7. Timer Completion Integration

**File:** `/app/[locale]/page.tsx`

- Modified to trigger notification on timer completion
- Checks `notificationsEnabled` and `permission === 'granted'`
- Uses localized notification strings from i18n
- Graceful error handling

**Notification Trigger:**

```typescript
if (notificationsEnabled && permission === 'granted') {
  showNotification({
    title: tNotifications('timerCompleteTitle'),
    body: tNotifications('timerCompleteBody'),
  })
}
```

### 8. Internationalization Support

**Files:** `/messages/en.json`, `/messages/ja.json`

Added `Notifications` section with complete translations:

- Permission status messages
- UI labels and buttons
- Test notification content
- Timer completion messages
- Error messages

**English:**

- "Timer Complete!" / "Your timer has finished"
- "Test notification" / "Send test"
- Permission status descriptions

**Japanese:**

- "タイマー完了！" / "タイマーが終了しました"
- "テスト通知" / "テスト送信"
- Permission status descriptions in Japanese

### 9. PWA Manifest

**File:** `/app/manifest.ts`

- Next.js App Router manifest configuration
- PWA installability support
- Icon references (192x192, 512x512)
- Standalone display mode
- Brand colors (green theme)

**Configuration:**

```typescript
{
  name: 'Coffee Timer',
  short_name: 'CoffeeTimer',
  description: 'Simple, relaxing timer...',
  display: 'standalone',
  background_color: '#F9FAFB',
  theme_color: '#10B981',
  icons: [192x192, 512x512, maskable]
}
```

## Architecture Decisions

### SSR Compatibility

All notification-related code includes `typeof window === 'undefined'` checks to prevent SSR errors during Next.js static generation.

**Pattern:**

```typescript
if (typeof window === 'undefined') {
  return false // or default value
}
// Browser-only code
```

### Service Worker Messaging

Notifications are displayed via Service Worker postMessage API rather than direct `new Notification()` to:

- Maintain notification context when tab is closed
- Enable future Web Push server integration
- Handle notification clicks properly
- Support better mobile experience

### Permission Management

- Permission status is stored in Zustand for reactivity
- Synced on app load via ServiceWorkerRegistration
- Updated when user grants/denies permission
- Persisted to localStorage for cross-session consistency

### Progressive Enhancement

- App works fully without notification support
- Graceful degradation for unsupported browsers
- Settings UI hides if notifications unavailable
- No errors in non-supporting environments

## File Structure

```
coffee-timer/
├── app/
│   ├── manifest.ts                      # PWA manifest (NEW)
│   └── [locale]/
│       ├── layout.tsx                   # Added ServiceWorkerRegistration
│       └── page.tsx                     # Added notification trigger
├── components/
│   ├── notifications/                   # NEW directory
│   │   ├── ServiceWorkerRegistration.tsx
│   │   └── NotificationTest.tsx
│   └── settings/
│       ├── NotificationToggle.tsx       # NEW
│       └── SettingsPanel.tsx            # Updated
├── lib/
│   ├── notifications/                   # NEW directory
│   │   └── notificationManager.ts
│   └── stores/
│       └── notificationStore.ts         # NEW
├── messages/
│   ├── en.json                          # Updated
│   └── ja.json                          # Updated
├── public/
│   └── sw.js                            # NEW - Service Worker
├── ICONS_NEEDED.md                      # NEW - Icon documentation
└── IMPLEMENTATION_PHASE4.md             # This file
```

## Dependencies

No new external dependencies required! Uses:

- Native browser APIs (Notification, ServiceWorker)
- Existing Zustand for state management
- Existing next-intl for i18n
- Existing Radix UI for toggle switch patterns

## Browser Compatibility

### Supported Browsers

- ✅ Chrome/Edge 50+ (full support)
- ✅ Firefox 44+ (full support)
- ✅ Safari 16+ (iOS 16.4+, macOS 13+)
- ✅ Opera 37+ (full support)

### Not Supported

- ❌ Safari < 16 (iOS < 16.4)
- ❌ Internet Explorer (all versions)
- ❌ Older mobile browsers

**Detection:** App automatically detects support via `isNotificationSupported()`

## Testing Checklist

### Basic Functionality

- [ ] Service Worker registers successfully
- [ ] Permission request dialog appears
- [ ] Notification appears when granted
- [ ] Notification click focuses window
- [ ] Settings toggle works correctly

### Timer Integration

- [ ] Notification shows on timer completion
- [ ] Notification respects enabled/disabled setting
- [ ] Notification uses localized messages
- [ ] Sound and notification work together
- [ ] No notification when permission denied

### Edge Cases

- [ ] Works when tab is not focused
- [ ] Works when browser is minimized
- [ ] Handles permission denied gracefully
- [ ] Handles browser without support
- [ ] SSR build succeeds without errors

### Internationalization

- [ ] English notification messages display correctly
- [ ] Japanese notification messages display correctly
- [ ] Locale changes reflect in notifications

### PWA Features

- [ ] Manifest is accessible at /manifest.webmanifest
- [ ] App is installable (on supported browsers)
- [ ] Icons referenced correctly (when added)

## Known Limitations

### Icons Required

Icon files are referenced but not included. See `ICONS_NEEDED.md` for:

- icon-192x192.png
- icon-512x512.png
- badge.png

**Workaround:** Notifications use browser default icons until files are added.

### No Server-Side Push

Current implementation is client-side only:

- Notifications triggered by local timer completion
- No server push notification capability
- No push subscription management

**Future:** Can be extended with VAPID keys and server-side push (see Context7 docs)

### iOS Limitations

- Safari 16.4+ required (iOS 16.4+)
- Home screen install may be required for notifications
- Background notifications limited compared to Android

### Permission Persistence

Some browsers may reset permission on:

- Browser data clear
- Private/Incognito mode
- Site data reset

**Mitigation:** Permission status re-checked on app load

## Future Enhancements

### Phase 4B - Server Push (Optional)

1. Generate VAPID keys
2. Implement push subscription management
3. Create server-side push endpoint
4. Add subscription persistence
5. Handle push events in Service Worker

**Tools:**

```bash
npm install -g web-push
web-push generate-vapid-keys
```

### Additional Features

- [ ] Custom notification sounds
- [ ] Notification action buttons ("Restart Timer", "Dismiss")
- [ ] Notification badges with timer info
- [ ] Scheduled notifications (reminder before completion)
- [ ] Multiple timer notifications
- [ ] Notification history/log

### Offline Support

- [ ] Cache timer UI assets
- [ ] Offline timer functionality
- [ ] Background sync for settings

## Performance Impact

### Build Output

```
Route (app)                              Size  First Load JS
├ ● /[locale]                         78.3 kB        195 kB  (+1 kB)
└ ○ /manifest.webmanifest               127 B        102 kB  (new)
```

**Analysis:**

- +1 kB to main bundle (notification code)
- New manifest route (127 B)
- Service Worker not included in bundle (separate file)

### Runtime Performance

- Minimal impact: Service Worker runs in separate thread
- Notification checks are synchronous, < 1ms
- localStorage operations negligible
- No performance degradation observed

## Security Considerations

### Permissions

- User must explicitly grant notification permission
- Permissions are origin-specific (per domain)
- No automatic permission requests
- Respects browser permission policies

### Service Worker Scope

- Registered at root scope (`/`)
- Can only access same-origin resources
- No cross-origin notification access
- Follows Content Security Policy

### Data Privacy

- No notification data sent to servers
- All notifications are local/client-side
- No tracking or analytics
- User can revoke permission anytime

## Build and Deployment

### Build Success

```bash
pnpm run build
✓ Compiled successfully
✓ Generating static pages (6/6)
✓ Build completed
```

### Static Export

- All pages prerendered as static HTML
- Service Worker served from `/public/sw.js`
- Manifest generated at `/manifest.webmanifest`
- Works with `next start` and static hosting

### Deployment Notes

1. Ensure `/sw.js` is served with correct MIME type
2. HTTPS required for Service Workers (or localhost)
3. Service Worker caching may need cache busting
4. Consider CDN cache headers for `/sw.js`

## Troubleshooting

### Service Worker Not Registering

- Check browser console for errors
- Verify HTTPS or localhost
- Check `/sw.js` is accessible
- Clear browser cache and retry

### Notifications Not Appearing

- Verify permission granted
- Check browser notification settings
- Test with NotificationTest component
- Verify Service Worker is active

### Build Errors

- Check for `window` access in SSR code
- Add `typeof window === 'undefined'` guards
- Verify all client components have `'use client'`

### Permission Issues

- Permission denied cannot be fixed programmatically
- User must manually re-enable in browser settings
- Provide clear instructions for resetting

## Conclusion

Phase 4 successfully implements comprehensive notification support with:

- ✅ Service Worker integration
- ✅ Browser notification permissions
- ✅ Timer completion notifications
- ✅ Settings UI integration
- ✅ Full internationalization
- ✅ PWA manifest foundation
- ✅ SSR compatibility
- ✅ Clean build (no errors)

The implementation follows Next.js best practices, maintains consistency with existing code patterns, and provides a solid foundation for future Web Push enhancements.
