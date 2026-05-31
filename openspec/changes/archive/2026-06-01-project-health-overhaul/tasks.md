## 1. Setup & Dependencies

- [x] 1.1 Remove unused `sharp` dependency from devDependencies
- [x] 1.2 Add vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @vitest/coverage-v8 to devDependencies
- [x] 1.3 Add typescript, @tsconfig/strictest to devDependencies
- [x] 1.4 Add @typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-plugin-jsx-a11y to devDependencies
- [x] 1.5 Update outdated packages (react, react-dom, react-router-dom, @types/react, @types/react-dom)
- [x] 1.6 Run `npm install` to apply all dependency changes

## 2. Test Infrastructure

- [x] 2.1 Create `tsconfig.json` with `strict: true`, JSX support, path aliases (needed before tests can typecheck)
- [x] 2.2 Configure Vitest in `vite.config.js` (test block with jsdom environment, globals, include patterns)
- [x] 2.3 Add `"test"` and `"test:coverage"` scripts to `package.json`
- [x] 2.4 Add `vitest` types to `tsconfig.json` `compilerOptions.types`
- [x] 2.5 Create `src/test-setup.ts` with `@testing-library/jest-dom` import (setup file for vitest)
- [x] 2.6 Write `src/hooks/useSubscriptions.test.ts` — test all CRUD operations, localStorage error handling, edge cases
- [x] 2.7 Write `src/components/NewSubscriptionForm.test.tsx` — test form rendering, validation, submit
- [x] 2.8 Write `src/components/SubscriptionCard.test.tsx` — test rendering, progress bar, menu toggle, delete trigger
- [x] 2.9 Write `src/components/SubscriptionList.test.tsx` — test empty state, list rendering
- [x] 2.10 Write `src/components/SubscriptionDetail.test.tsx` — test detail rendering, add visit, remaining counter
- [x] 2.11 Write `src/components/VisitTimeline.test.tsx` — test visit list, delete visit, empty state
- [x] 2.12 Write `src/components/ErrorBoundary.test.tsx` — test error catch, fallback UI, recovery
- [x] 2.13 Verify `npm run test:coverage` passes with >=80% branches and functions

## 3. TypeScript Migration

- [x] 3.1 Create `src/types.ts` with `Subscription` and `Visit` interfaces, export shared types
- [x] 3.2 Rename `src/hooks/useSubscriptions.js` → `useSubscriptions.ts`, add type annotations, add `_schemaVersion` to storage format, add data structure validation
- [x] 3.3 Rename `src/components/VisitTimeline.jsx` → `VisitTimeline.tsx`, add typed props
- [x] 3.4 Rename `src/components/SubscriptionCard.jsx` → `SubscriptionCard.tsx`, add typed props
- [x] 3.5 Rename `src/components/SubscriptionList.jsx` → `SubscriptionList.tsx`, add typed props
- [x] 3.6 Rename `src/components/SubscriptionDetail.jsx` → `SubscriptionDetail.tsx`, add typed props
- [x] 3.7 Rename `src/components/NewSubscriptionForm.jsx` → `NewSubscriptionForm.tsx`, add typed props
- [x] 3.8 Rename `src/pages/Home.jsx` → `Home.tsx`
- [x] 3.9 Rename `src/pages/SubscriptionPage.jsx` → `SubscriptionPage.tsx`
- [x] 3.10 Rename `src/App.jsx` → `App.tsx`, update imports for renamed files
- [x] 3.11 Rename `src/main.jsx` → `main.tsx`, update imports for renamed files
- [x] 3.12 Update `index.html` script src from `/src/main.jsx` to `/src/main.tsx`
- [x] 3.13 Update ESLint config for TypeScript: add @typescript-eslint parser/plugin, jsx-a11y plugin, TypeScript-specific rules
- [x] 3.14 Update `build` script in `package.json` to run `tsc --noEmit` before `vite build`
- [x] 3.15 Run `npx tsc --noEmit` and fix all type errors

## 4. Bug Fixes

- [x] 4.1 Fix UTC date bug in `NewSubscriptionForm`: replace `new Date().toISOString().split("T")[0]` with manual construction from `getFullYear()` / `getMonth() + 1` / `getDate()`
- [x] 4.2 Fix division by zero in `SubscriptionCard` progress calculation: guard `totalSessions` with `Math.max(totalSessions, 1)`
- [x] 4.3 Fix division by zero in `SubscriptionDetail` progress calculation: guard `totalSessions` with `Math.max(totalSessions, 1)`
- [x] 4.4 Fix `<button>` inside `<Link>` in `SubscriptionCard`: restructure to sibling elements with absolute positioning for menu button
- [x] 4.5 Extract duplicate progress calculation logic into shared `src/utils.ts` (function `calcProgress`) and use in both components

## 5. Accessibility

- [x] 5.1 Add `aria-label` to menu toggle button in `SubscriptionCard`
- [x] 5.2 Add `aria-label` to delete buttons in `VisitTimeline` (both swipe-delete and hover-delete)
- [x] 5.3 Add `aria-label` to close/back buttons where present
- [x] 5.4 Add `htmlFor`/`id` associations to all form labels and inputs in `NewSubscriptionForm`
- [x] 5.5 Add `:focus-visible` styles to all interactive elements (buttons, links, inputs, selects) in all CSS files
- [x] 5.6 Add keyboard support to `VisitTimeline` swipe-to-delete: `onKeyDown` for `Delete`/`Backspace` to trigger delete, `Escape` to cancel
- [x] 5.7 Add `tabIndex={0}` and `role="button"` to swipeable visit items in `VisitTimeline` for keyboard accessibility

## 6. Error Boundary

- [x] 6.1 Create `src/components/ErrorBoundary.tsx` class component with `componentDidCatch` and fallback UI
- [x] 6.2 Wrap `<Routes>` in `App.tsx` with `ErrorBoundary` component
- [x] 6.3 Add 404 catch-all route (`path="*"`) to `App.tsx` routes

## 7. BEM Styling (Dark Mode & Responsive)

- [x] 7.1 Add dark mode token overrides in `tokens.css` via `@media (prefers-color-scheme: dark)` for background, text, border, card colors
- [x] 7.2 Verify all component CSS uses design tokens (no hardcoded colors that would break in dark mode)
- [x] 7.3 Add responsive breakpoint at 640px in `SubscriptionList.css` for 2-column grid layout
- [x] 7.4 Add responsive breakpoint at 640px in `Home.css` for max-width container
- [x] 7.5 Add responsive breakpoint at 640px in `SubscriptionDetail.css` for wider layout
- [x] 7.6 Add responsive breakpoint at 640px in `NewSubscriptionForm.css` for wider form layout

## 8. PWA Configuration

- [x] 8.1 Complete PWA manifest in `vite.config.js`: add `start_url`, `display`, `background_color`, `orientation`, `scope`
- [x] 8.2 Add `"purpose": "any maskable"` to all icon entries in PWA manifest
- [x] 8.3 Add Workbox runtime caching with `StaleWhileRevalidate` for navigation and `CacheFirst` for static assets
- [x] 8.4 Remove duplicate `public/manifest.json` (PWA plugin generates `manifest.webmanifest` from vite config)
- [x] 8.5 Remove dead file `src/assets/react.svg`

## 9. Cleanup & Verification

- [x] 9.1 Run `npm run lint` and fix all ESLint errors/warnings
- [x] 9.2 Run `npx tsc --noEmit` and verify zero type errors
- [x] 9.3 Run `npm run test:coverage` and verify >=80% branches and functions
- [x] 9.4 Run `npm run build` and verify clean build with no warnings
- [x] 9.5 Run `npm run preview` and manually test: create subscription, add visits, delete visits, swipe-to-delete keyboard, dark mode, responsive layout, error boundary
- [x] 9.6 Verify PWA: check `manifest.webmanifest` in build output, test offline mode in browser DevTools
