# PWA Testing Checklist

Use this checklist to validate PWA installation and accessibility after deploying to production.

## Prerequisites

- [ ] Application deployed to HTTPS domain
- [ ] DNS configured and propagated
- [ ] Service Worker registered successfully

## Desktop Testing (Chrome/Edge)

### PWA Installation

- [ ] Navigate to application URL
- [ ] Install prompt appears in address bar
- [ ] Click install and verify installation
- [ ] App opens in standalone window (no browser UI)
- [ ] Theme color (#10B981) shows in title bar
- [ ] App icon displays in taskbar/dock
- [ ] App can be launched from OS (not just browser)

### Icons & Branding

- [ ] Favicon shows in browser tab
- [ ] App icon in OS launcher is clear and recognizable
- [ ] About/Info shows correct app name "Coffee Timer"

### Functionality

- [ ] Timer works correctly (start, pause, reset)
- [ ] Settings panel opens and closes
- [ ] Sound selection and volume work
- [ ] Notification permission can be requested
- [ ] Test notification works
- [ ] Language toggle switches between en/ja

### Accessibility (Desktop)

- [ ] Tab key navigates through all controls in logical order
- [ ] Enter/Space activate buttons
- [ ] Escape closes settings dialog
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader reads timer time (test with built-in reader)

## Mobile Testing (iOS Safari)

### PWA Installation

- [ ] Navigate to application URL in Safari
- [ ] Tap Share button (square with arrow)
- [ ] Tap "Add to Home Screen"
- [ ] Edit name if desired, tap "Add"
- [ ] App icon appears on home screen
- [ ] Tap icon to launch app
- [ ] App opens in fullscreen (no Safari UI)
- [ ] Status bar style is correct

### Icons & Appearance

- [ ] Apple touch icon (180x180) displays correctly
- [ ] App icon is sharp and clear on Retina displays
- [ ] No generic Safari icon placeholder
- [ ] Splash screen shows during launch (if supported)

### Functionality

- [ ] All timer functions work
- [ ] Touch targets are easy to tap (44x44px minimum)
- [ ] Settings dialog works on mobile
- [ ] Notifications work (if iOS 16.4+)
- [ ] App persists when switching apps
- [ ] App reopens to last state

### Accessibility (iOS)

- [ ] VoiceOver reads timer state
- [ ] All buttons have proper labels
- [ ] Double-tap activates controls
- [ ] Swipe navigation works through all elements

## Mobile Testing (Android Chrome)

### PWA Installation

- [ ] Navigate to application URL
- [ ] Install banner appears at bottom
- [ ] Tap "Install" or use menu > "Install app"
- [ ] App installs to home screen
- [ ] Tap icon to launch
- [ ] App opens in standalone mode
- [ ] Adaptive icon looks good (maskable icon)

### Icons & Appearance

- [ ] Maskable icon (192x192) adapts to device theme
- [ ] Icon has proper safe zone (no cropping)
- [ ] Theme color shows in status bar
- [ ] App shows in app drawer
- [ ] Recent apps shows correct icon and name

### Functionality

- [ ] All features work correctly
- [ ] Touch targets appropriately sized
- [ ] Notification badge icon displays (monochrome)
- [ ] Push notifications work
- [ ] Orientation locks to portrait (if applicable)

### Accessibility (Android)

- [ ] TalkBack announces timer state
- [ ] All interactive elements accessible
- [ ] Touch exploration works
- [ ] Gestures perform expected actions

## Automated Testing

### Lighthouse Audit

```bash
lighthouse https://your-domain.com --view
```

**Target Scores:**

- [ ] PWA: 100
- [ ] Accessibility: 95+
- [ ] Performance: 90+
- [ ] Best Practices: 100
- [ ] SEO: 100

**PWA Checklist:**

- [ ] Installable
- [ ] PWA optimized
- [ ] Works offline (via Service Worker)
- [ ] Configured for splash screen
- [ ] Themed address bar

### Playwright Accessibility Tests

```bash
pnpm test:a11y
```

- [ ] All tests pass (0 violations)
- [ ] WCAG 2.1 AA compliance verified
- [ ] Color contrast meets standards
- [ ] No automated accessibility issues

## Cross-Browser Validation

### Chrome/Edge (Chromium)

- [ ] Full PWA support
- [ ] Installation works
- [ ] Service Worker registers
- [ ] Notifications work

### Firefox

- [ ] Basic PWA support
- [ ] Service Worker works
- [ ] Manifest loads correctly
- [ ] Limited installation (desktop only)

### Safari (macOS)

- [ ] PWA support (16.4+)
- [ ] Add to Dock works
- [ ] Notifications work (16.4+)
- [ ] Theme color applies

### Safari (iOS)

- [ ] Add to Home Screen works
- [ ] Fullscreen mode
- [ ] Status bar styling
- [ ] Limited notification support

## Offline Functionality

### Service Worker

- [ ] Service Worker activates
- [ ] App loads offline (after first visit)
- [ ] Cached assets serve correctly
- [ ] Update prompts work (if implemented)

### Network Resilience

- [ ] App loads on slow 3G
- [ ] Timer continues if connection lost
- [ ] Graceful degradation for missing features

## App Store Readiness (Future)

### Screenshots Needed

- [ ] Desktop screenshot (1280x720 or similar)
- [ ] Mobile screenshot (portrait, 1170x2532 or similar)
- [ ] Tablet screenshot (if applicable)

### Metadata

- [ ] App description written
- [ ] Category selected (productivity/utilities/lifestyle)
- [ ] Privacy policy available (if collecting data)
- [ ] Terms of service (if applicable)

## Issues to Watch For

### Common PWA Issues

- ⚠️ Install prompt blocked by user (can't force)
- ⚠️ HTTPS required for Service Worker
- ⚠️ iOS Safari limitations (no Web Push on older versions)
- ⚠️ Manifest errors in DevTools console
- ⚠️ Icon size mismatches

### Accessibility Warnings

- ⚠️ Low color contrast on timer states
- ⚠️ Missing focus indicators
- ⚠️ Screen reader not announcing changes
- ⚠️ Keyboard traps in dialogs
- ⚠️ Touch targets too small (<44px)

## Troubleshooting

### Installation Not Appearing

1. Check HTTPS is working
2. Verify manifest.webmanifest loads
3. Check console for errors
4. Ensure Service Worker registers
5. Try incognito/private mode

### Icons Not Displaying

1. Verify icon paths in manifest
2. Check file sizes match manifest
3. Clear browser cache
4. Verify MIME types (image/png)
5. Test different icon sizes

### Accessibility Issues

1. Run automated tests first
2. Test with real screen readers
3. Verify ARIA labels present
4. Check focus order
5. Test keyboard navigation

## Sign-off

### Tested By

- Name: **\*\***\_\_\_**\*\***
- Date: **\*\***\_\_\_**\*\***
- Browser/Device: **\*\***\_\_\_**\*\***

### Results

- Installation: ✅ / ❌
- Functionality: ✅ / ❌
- Accessibility: ✅ / ❌
- Performance: ✅ / ❌

### Notes

---

---

---

## Resources

### Testing Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Documentation

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### Browser Support

- [Can I Use: PWA](https://caniuse.com/web-app-manifest)
- [Can I Use: Service Worker](https://caniuse.com/serviceworkers)
- [Safari PWA Support](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
