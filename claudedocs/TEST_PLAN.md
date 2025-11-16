# Coffee Timer Test Plan

_Last updated: 2025-10-08_

## 1. Objectives

- Validate that the Coffee Timer PWA delivers reliable countdown, notification, and audio playback functionality across supported browsers and devices.
- Ensure the newly sourced notification sounds are unique, normalized, and selectable within the app.
- Provide a repeatable cadence for regression and release testing, including automated and manual coverage.

## 2. Scope

### In Scope

- Timer countdown lifecycle (start / pause / resume / reset).
- Time input validation (1–99 minutes, numeric constraints).
- Sound selector, audio playback, and volume control (including new presets).
- Web notifications (permission flow, background firing, service worker registration).
- Settings panel behavior and persistence via Zustand/localStorage.
- Internationalization (en, ja) and locale routing.
- PWA installability, offline caching, and shortcut actions.
- Accessibility (WCAG 2.1 AA focus, screen reader announcements, keyboard support).
- Responsive layouts (mobile, tablet, desktop breakpoints).

### Out of Scope

- Native mobile application stores or standalone mobile builds.
- Backend push gateway infrastructure beyond the mock notification flow shipped in the repo.
- Third-party analytics integrations (none currently configured).

## 3. Test Strategy

| Test Type               | Goals                                                                                       | Primary Owner | Automation Tooling                  |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------------- | ----------------------------------- |
| Unit                    | Validate isolated logic (stores, hooks, utilities).                                         | Dev           | Vitest (add), React Testing Library |
| Component / Integration | Ensure components integrate with Zustand, AudioManager, notification APIs.                  | Dev / QA      | Vitest + RTL, MSW mocks             |
| End-to-End              | Validate full user flows in real browsers (timer lifecycle, notifications, settings, i18n). | QA            | Playwright (existing e2e specs)     |
| Accessibility           | Confirm keyboard navigation, aria roles, and screen reader text.                            | QA            | Axe DevTools, Manual VoiceOver/NVDA |
| Performance / PWA       | Lighthouse audits, service worker cache verification, offline smoke.                        | QA            | Lighthouse CLI, Chrome DevTools     |

## 4. Test Environments

| Tier       | Browser(s)                                         | OS                       | Notes                                          |
| ---------- | -------------------------------------------------- | ------------------------ | ---------------------------------------------- |
| Primary    | Chrome (latest), Safari (latest), Firefox (latest) | macOS Sonoma, Windows 11 | Desktop focus                                  |
| Secondary  | Edge (latest)                                      | Windows 11               | Quick sanity after primary pass                |
| Mobile Web | Safari iOS 17, Chrome Android 15                   | iPhone 14, Pixel 8       | Validate responsive layout, PWA install banner |

Additional devices: iPad mini (landscape/portrait), macOS VoiceOver environment.

### Test Data

- Timer presets: 1 min, 5 min, 15 min, 45 min, 99 min edge.
- Sound presets: all 14 options (`gentle-bell` … `melodic-bells`).
- Locales: `en`, `ja` via `/en` and `/ja` routes.

## 5. Manual Test Suites

### 5.1 Smoke Checklist

| ID     | Area              | Steps                                | Expected                                                  |
| ------ | ----------------- | ------------------------------------ | --------------------------------------------------------- |
| SMK-01 | Launch            | Navigate to `/`                      | Landing page renders without console errors               |
| SMK-02 | Timer Start       | Set 1 minute, start timer            | Countdown animates, remaining time decrements             |
| SMK-03 | Settings Drawer   | Open settings (gear icon)            | Drawer appears, focus trapped within                      |
| SMK-04 | Sound Preview     | Select `classic-tone`, click preview | Audio plays instantly; volume obeys slider                |
| SMK-05 | Notification Test | Click "Send test notification"       | Browser permission prompt shows or notification delivered |

### 5.2 Functional Test Cases

| ID      | Scenario                | Steps                                                 | Expected                                                                       |
| ------- | ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| FUNC-01 | Time input validation   | Attempt to enter 0, 100, letters                      | Input rejects invalid values, clamps to 1–99                                   |
| FUNC-02 | Pause / Resume          | Start timer, pause mid-countdown, resume              | Remaining time preserved; resume continues countdown                           |
| FUNC-03 | Reset Behavior          | Start timer, click reset                              | Timer resets to last configured duration; audio stops                          |
| FUNC-04 | Auto completion         | Start 1 min timer, wait for completion                | Timer resets; selected sound plays once; notification dispatched               |
| FUNC-05 | Volume persistence      | Set volume to 30, refresh page                        | Volume slider retains value, playback uses stored setting                      |
| FUNC-06 | Sound persistence       | Choose `double-ping`, reload                          | Sound selector shows `double-ping`; preview uses correct file                  |
| FUNC-07 | Multi-tab sync          | Start timer in tab A, open tab B                      | Tab B reflects running state through Zustand persist (expected manual refresh) |
| FUNC-08 | Background notification | Start short timer, switch tabs / lock screen (mobile) | Notification arrives with correct title/message, sound plays if unmuted        |
| FUNC-09 | Sound uniqueness        | Preview all presets sequentially                      | No duplicated audio; each clip lasts 0.7–4.0s as documented                    |
| FUNC-10 | Gear shortcut           | Use keyboard to open settings (Shift+S per spec)      | Drawer opens; focus moves to close button                                      |

### 5.3 Accessibility Checks

| ID      | Scenario             | Steps                                   | Expected                                              |
| ------- | -------------------- | --------------------------------------- | ----------------------------------------------------- |
| A11Y-01 | Keyboard navigation  | Navigate entire app using Tab/Shift+Tab | Focus ring visible, logical order, ESC closes dialogs |
| A11Y-02 | Screen reader labels | Inspect controls in VoiceOver/NVDA      | Buttons, sliders, toggles announce descriptive labels |
| A11Y-03 | Color contrast       | Run Axe and manual contrast check       | No WCAG AA contrast violations                        |
| A11Y-04 | Motion reduction     | Enable prefers-reduced-motion           | Timer animations respect reduced motion setting       |

### 5.4 Localization

| ID      | Scenario      | Steps                 | Expected                                          |
| ------- | ------------- | --------------------- | ------------------------------------------------- |
| L10N-01 | Locale switch | Toggle language       | All UI strings change; numeric formats unaffected |
| L10N-02 | Deep link     | Open `/ja` directly   | Japanese copy loads; notification text localized  |
| L10N-03 | Persistence   | Switch to JA, refresh | Locale selection persists                         |

### 5.5 PWA & Offline

| ID     | Scenario             | Steps                                          | Expected                                                   |
| ------ | -------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| PWA-01 | Install prompt       | Chrome: check `chrome://apps` after "Install"  | App installs with icon and correct name                    |
| PWA-02 | Offline availability | In DevTools, go offline after first load       | App shell loads; timer works offline; notifications queued |
| PWA-03 | Shortcut actions     | Use `/shortcuts/start` & `/shortcuts/settings` | Intent launches correct pre-filled flows                   |

### 5.6 Regression Guardrails

- Run full smoke checklist on each PR touching timer, audio, notification, or store logic.
- Execute accessibility and localization suites for release candidates.
- Maintain screenshot diffs (Playwright trace viewer artifacts already stored under `playwright-report/`).

## 6. Automation Coverage

Existing Playwright specs:

- `e2e/accessibility.spec.ts`
- `e2e/sound.spec.ts`
- `e2e/timer-behavior.spec.ts`

Action items:

1. Extend `e2e/sound.spec.ts` to iterate over all 14 presets and assert that audio sources resolve (no 404) and filenames match the new list.
2. Add new test for notification pop audio playback at completion (mock timers + AudioManager spy).
3. Parameterize locale coverage by running e2e smoke in both `en` and `ja` contexts.
4. Integrate Playwright CI job into release pipeline (GitHub Actions or pnpm script).

Unit/integration backlog:

- Add Vitest suite for `lib/audio/audioManager.ts` (load, play, stop).
- Add store tests for `useSettingsStore` covering persistence and bounds.
- Introduce MSW-based tests for notification API routes.

## 7. Performance & Monitoring

- Run Lighthouse (Desktop & Mobile) aiming for PWA score ≥ 90.
- Measure first input delay after install (<100 ms).
- Monitor console/network logs for service worker registration issues.

## 8. Test Schedule

| Phase             | Purpose                                   | Frequency                         |
| ----------------- | ----------------------------------------- | --------------------------------- |
| PR Validation     | Run Playwright smoke + lint               | On every PR                       |
| Nightly           | Run full Playwright suite + Lighthouse    | Daily while in active development |
| Release Candidate | Full manual regression (Sections 5.2–5.5) | Prior to tagged release           |
| Post-Release      | PWA install + notification sanity         | Within 24h of deploy              |

## 9. Entry / Exit Criteria

**Entry**

- Feature flagged or merged into `main`.
- All blockers from previous cycle resolved.

**Exit**

- All high/critical defects closed or deferred with approval.
- Smoke, localization, and accessibility suites pass.
- PWA install verified on at least one desktop and one mobile device.
- Documentation (SOUND_FILES_NEEDED.md, README) updated for new assets.

## 10. Risks & Mitigations

| Risk                                      | Impact                         | Mitigation                                                                     |
| ----------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| Browser autoplay restrictions mute sounds | Completion notification silent | Ensure user interaction before playback; document enabling sound in onboarding |
| Push notifications blocked by user        | Timer completes silently       | Provide in-app banner to enable notifications; rely on audio as fallback       |
| Service worker caching stale assets       | Old sounds served              | Version assets via Next.js build hashes; run cache busting on release          |
| Localization regressions                  | Mixed-language UI              | Automated locale smoke + double QA sign-off                                    |

## 11. Reporting

- Track defects in GitHub issues with labels: `bug`, `area:timer`, `area:audio`, `priority:P0-P2`.
- Summarize test execution in release notes (pass/fail rate, outstanding issues).
- Store Playwright artifacts in `playwright-report/` for trace review.

## 12. Checklist Before Release

- [ ] Playwright suite passes in CI (Chrome + WebKit + Firefox targets).
- [ ] Manual regression suite complete (Sections 5.2–5.5).
- [ ] Lighthouse desktop & mobile ≥ 90 across categories.
- [ ] PWA install tested on macOS + iOS.
- [ ] Notification permission flow validated.
- [ ] Audio preview and completion playback verified for all 14 presets.
- [ ] `SOUND_FILES_NEEDED.md` and `public/sounds/README.md` reflect latest sources.
