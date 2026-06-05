## 1. Create new directory structure

- [x] 1.1 Create directories
- [x] 1.2 Create barrel files (index.ts) for every module directory

## 2. Migrate shared layer

- [x] 2.1 Move `src/components/ErrorBoundary.tsx` + `.css` + `.test.tsx` to `shared/ui/ErrorBoundary/` with barrel file
- [x] 2.2 Move `src/styles/tokens.css` to `shared/styles/tokens.css`

## 3. Migrate entity layer

- [x] 3.1 Move `src/types.ts` to `entities/subscription/types.ts` with barrel file
- [x] 3.2 Move `src/utils.ts` (calcProgress) to `entities/subscription/lib/calcProgress.ts`
- [x] 3.3 Move `src/hooks/useSubscriptions.ts` + test to `entities/subscription/lib/useSubscriptions.ts`

## 4. Migrate features

- [x] 4.1 Move `src/components/NewSubscriptionForm.tsx` + `.css` + `.test.tsx` to `features/create-subscription/`
- [x] 4.2 Extract mark-visit button from `SubscriptionDetail` into `features/mark-visit/ui/MarkVisitButton.tsx`

## 5. Migrate widgets

- [x] 5.1 Move `src/components/SubscriptionCard.tsx` + `.css` + `.test.tsx` to `widgets/subscription-card/`
- [x] 5.2 Move `src/components/VisitTimeline.tsx` + `.css` + `.test.tsx` to `widgets/visit-timeline/`
- [x] 5.3 Move `src/components/SubscriptionDetail.tsx` + `.css` + `.test.tsx` to `widgets/subscription-detail/`, refactor to use `MarkVisitButton` from features
- [x] 5.4 Move `src/components/SubscriptionList.tsx` + `.css` + `.test.tsx` to `widgets/subscription-list/` (decided as own widget, not in subscription-card)

## 6. Migrate pages and app

- [x] 6.1 Move `src/pages/Home.tsx` + `.css` + `.test.tsx` to `pages/home/`
- [x] 6.2 Move `src/pages/SubscriptionPage.tsx` + `.css` + `.test.tsx` to `pages/subscription-page/`
- [x] 6.3 Move `src/App.tsx` + test, `src/main.tsx`, `src/index.css`, `src/test-setup.ts` to `app/`

## 7. Clean up legacy structure

- [x] 7.1 Remove empty legacy directories
- [x] 7.2 Remove root-level `src/types.ts` and `src/utils.ts`
- [x] 7.3 Verify no stale import paths remain

## 8. Verify

- [x] 8.1 Run `npm test` — all tests pass (0 import/module errors; 8 pre-existing locale failures unchanged)
- [x] 8.2 Run `npm run build` — compiles without errors
- [x] 8.3 Run `npm run lint` — no lint errors
