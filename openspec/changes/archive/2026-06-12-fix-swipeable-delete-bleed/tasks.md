## 1. Root Cause Investigation

- [x] 1.1 Identify that `::after` gradient with `transparent` causes red bleed-through
- [x] 1.2 Identify that DeleteBg's border-radius at `right: 0` coincides with wrapper's clip boundary, causing anti-aliasing artifacts

## 2. CSS Fix

- [x] 2.1 Remove `::after` pseudo-element with gradient from `.SwipeableVisit-Content`
- [x] 2.2 Add `background-color: var(--color-surface)` to `.SwipeableVisit-Wrapper` as safety net
- [x] 2.3 Change `right: 0` to `right: 1px` on `.SwipeableVisit-DeleteBg` to move its border-radius away from clip boundary

## 3. Verification

- [x] 3.1 Run linter (`npm run lint`)
- [x] 3.2 Run typecheck (`npx tsc --noEmit`)
- [x] 3.3 Visual verification — no red artifacts at rest state, swipe-to-delete works correctly
