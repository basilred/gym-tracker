## 1. Setup

- [x] 1.1 Install `@bem-react/classname` dependency
- [x] 1.2 Create `src/styles/tokens.css` with design tokens (colors, radii, shadows, transitions)
- [x] 1.3 Update `src/index.css` — remove Tailwind imports and `@apply`, add `@import './styles/tokens.css'`, set base body styles

## 2. Migrate simple components (no dynamic logic)

- [x] 2.1 Create `src/pages/Home.css` and migrate `Home.jsx` to BEM classes
- [x] 2.2 Create `src/pages/SubscriptionPage.css` and migrate `SubscriptionPage.jsx` to BEM classes
- [x] 2.3 Create `src/components/SubscriptionList.css` and migrate `SubscriptionList.jsx` to BEM classes
- [x] 2.4 Create `src/components/NewSubscriptionForm.css` and migrate `NewSubscriptionForm.jsx` to BEM classes

## 3. Migrate components with dynamic styles

- [x] 3.1 Create `src/components/SubscriptionDetail.css` — migrate `SubscriptionDetail.jsx` to BEM classes, use `:disabled` pseudo-class, CSS custom property for progress bar width
- [x] 3.2 Create `src/components/SubscriptionCard.css` — migrate `SubscriptionCard.jsx` to BEM classes, use `_expanded` modifier for menu dropdown, CSS custom property for progress bar width
- [x] 3.3 Create `src/components/VisitTimeline.css` — migrate `VisitTimeline.jsx` to BEM classes, use `ref.setProperty` for swipe offset, `_dragging`/`_snapped` modifiers for transition states

## 4. Remove Tailwind

- [x] 4.1 Uninstall tailwind dependencies: `tailwindcss`, `@tailwindcss/vite`, `autoprefixer`, `postcss`
- [x] 4.2 Remove `tailwindcss()` plugin from `vite.config.js`
- [x] 4.3 Delete `tailwind.config.js`
- [x] 4.4 Delete `src/App.css` (unused boilerplate)

## 5. Verify

- [x] 5.1 Run `npm run build` — ensure build succeeds without errors
- [x] 5.2 Run `npm run lint` — ensure ESLint passes without new issues
- [x] 5.3 Run `npm run dev` and visually verify all components render correctly
- [x] 5.4 Verify no `tailwindcss` references remain in the project
