## 1. Design Tokens

- [x] 1.1 Add `--color-on-primary`, `--color-on-danger`, `--color-input-bg` tokens to `:root` in `src/styles/tokens.css`
- [x] 1.2 Add same tokens with dark-appropriate values to `@media (prefers-color-scheme: dark)` block

## 2. Button Text Contrast Fixes

- [x] 2.1 Replace `color: var(--color-surface)` with `color: var(--color-on-primary)` in `SubscriptionDetail-MarkBtn` (`src/components/SubscriptionDetail.css`)
- [x] 2.2 Replace `color: var(--color-surface)` with `color: var(--color-on-primary)` in `NewSubscriptionForm-SubmitBtn` (`src/components/NewSubscriptionForm.css`)
- [x] 2.3 Replace `color: var(--color-surface)` with `color: var(--color-on-danger)` in `SwipeableVisit-DeleteBtn` (`src/components/VisitTimeline.css`)

## 3. Input Background Fixes

- [x] 3.1 Add `background-color: var(--color-input-bg)` to `NewSubscriptionForm-Input` and `NewSubscriptionForm-Select` (`src/components/NewSubscriptionForm.css`)
- [x] 3.2 Add `background-color: var(--color-input-bg)` to `SwipeableVisit-DateInput` (`src/components/VisitTimeline.css`)

## 4. ErrorBoundary Styling

- [x] 4.1 Create `src/components/ErrorBoundary.css` with БЭМ-classes for fallback UI (container, message, retry button)
- [x] 4.2 Add className attributes to ErrorBoundary render in `src/components/ErrorBoundary.tsx`
- [x] 4.3 Import `ErrorBoundary.css` in `src/components/ErrorBoundary.tsx`

## 5. Verification

- [x] 5.1 Run `npm run lint` and fix any issues
- [x] 5.2 Run `npm test` and ensure all tests pass
- [x] 5.3 Visually verify components in dark theme via devtools (prefers-color-scheme: dark)
