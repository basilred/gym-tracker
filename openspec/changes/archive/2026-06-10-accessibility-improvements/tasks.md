## 1. Infrastructure Setup

- [x] 1.1 Install vitest-axe devDependency
- [x] 1.2 Add vitest-axe setup/extend-expect in test setup file
- [x] 1.3 Set `lang="ru"` and add `<meta name="description">` in index.html

## 2. Color Contrast

- [x] 2.1 Update `--color-text-secondary` in light and dark themes in tokens.css
- [x] 2.2 Update `--color-text-muted` in light and dark themes in tokens.css
- [x] 2.3 Update `--color-disabled` in light and dark themes in tokens.css

## 3. Semantic HTML

- [x] 3.1 Wrap Home page content in `<main>` and `<header>` landmarks
- [x] 3.2 Wrap SubscriptionPage content in `<main>` and `<header>` landmarks
- [x] 3.3 Convert SubscriptionList `<div>` to `<ul>` with `<li>` children
- [x] 3.4 Convert VisitTimeline `<div>` list to `<ol>` with `<li>` children
- [x] 3.5 Update CSS selectors in SubscriptionList and VisitTimeline for semantic elements if needed

## 4. Screen Reader Support

- [x] 4.1 Add `<label>` for subscription name field in NewSubscriptionForm
- [x] 4.2 Update `aria-label="Options"` to Russian in SubscriptionCard
- [x] 4.3 Add `aria-hidden="true"` to decorative SVG icon in SubscriptionCard
- [x] 4.4 Add `aria-live="polite"` region in App for dynamic feedback
- [x] 4.5 Wire aria-live announcements for subscription creation, deletion, and visit marking

## 5. Keyboard Navigation & Focus Management

- [x] 5.1 Add Escape handler to close menu in SubscriptionCard with focus return to toggle
- [x] 5.2 Fix focus-visible indicator (outline) on SubscriptionCard EditInput
- [x] 5.3 Make delete button in SwipeableVisit keyboard accessible (visible on focus, not only hover)
- [x] 5.4 Add visual swipe affordance in SwipeableVisit
- [x] 5.5 Decouple nested button-inside-link in SubscriptionCard (refactor interactive elements)
- [x] 5.6 Move focus after ErrorBoundary retry click

## 6. Accessibility Tests

- [x] 6.1 Add axe test for Home page
- [x] 6.2 Add axe test for SubscriptionPage
- [x] 6.3 Add axe test for NewSubscriptionForm
- [x] 6.4 Add axe test for SubscriptionCard
- [x] 6.5 Add axe test for VisitTimeline
- [x] 6.6 Add targeted assertion: label associated with input in NewSubscriptionForm
- [x] 6.7 Add targeted assertions: semantic lists (role="list", role="listitem") in SubscriptionList and VisitTimeline
- [x] 6.8 Add targeted assertion: menu closes on Escape in SubscriptionCard
- [x] 6.9 Update existing tests broken by semantic HTML changes (selectors, roles)

## 7. Verification

- [x] 7.1 Run full test suite: `npm test`
- [x] 7.2 Run linter: `npm run lint`
- [x] 7.3 Run build: `npm run build`
- [x] 7.4 Manual verification: check light and dark theme visually
