## Why

Gym Tracker has no accessibility considerations despite having a fully Russian UI. The app fails basic WCAG AA compliance: wrong document language, missing form labels, insufficient color contrast, no keyboard navigation for menus, no semantic landmarks, and no screen reader feedback for dynamic changes. These issues affect users with visual impairments, motor disabilities, and anyone using keyboard navigation.

## What Changes

- Set `<html lang="ru">` and add `<meta name="description">`
- Add `<label>` for the subscription name field in NewSubscriptionForm
- Fix color contrast in design tokens to pass WCAG AA (text-secondary, text-muted, disabled)
- Add keyboard navigation: Escape to close menus, return focus management
- Fix focus-visible indicators removed via `outline: none`
- Add semantic landmarks (`<main>`, `<header>`, `<nav>`) across pages
- Convert `<div>` lists to semantic `<ul>`/`<ol>` in SubscriptionList and VisitTimeline
- Add `aria-live` regions for dynamic feedback (create/delete/visit)
- Decouple nested interactive elements (button inside link) in SubscriptionCard
- Make swipe-to-delete button keyboard accessible in SwipeableVisit
- Add visual affordance for swipe gesture
- Add Russian translations for `aria-label` attributes
- Add `aria-hidden="true"` to decorative SVG icons
- Manage focus after ErrorBoundary retry
- Add automated accessibility tests with vitest-axe

## Capabilities

### New Capabilities
- `color-contrast`: Update design tokens to pass WCAG AA contrast thresholds for all text variants in both themes
- `semantic-html`: Add landmarks, semantic lists, and correct document language
- `keyboard-navigation`: Ensure all interactive elements are keyboard accessible with proper focus management
- `screen-reader`: Add labels, aria-live regions, and accessible names for screen reader users
- `a11y-testing`: Automated accessibility regression tests using vitest-axe

### Modified Capabilities

None. Existing specs are architecture-level and unchanged by these additions.

## Impact

- `src/shared/styles/tokens.css`: color token values change (visual shift, minor)
- `index.html`: lang attribute + meta description
- Every component touched gets accessibility improvements; tests updated or added
- New devDependency: `vitest-axe`
- No breaking API changes; all existing functionality preserved
