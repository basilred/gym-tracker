## 1. Setup

- [x] 1.1 Install `@feature-sliced/eslint-config`, `eslint-plugin-import`, and `eslint-plugin-boundaries` as dev dependencies
- [x] 1.2 Create `shared/lib/` directory
- [x] 1.3 Create `entities/subscription/model/` directory

## 2. Entity model segment

- [x] 2.1 Move `entities/subscription/lib/useSubscriptions.ts` → `entities/subscription/model/useSubscriptions.ts`
- [x] 2.2 Move `entities/subscription/types.ts` → `entities/subscription/model/types.ts`
- [x] 2.3 Move `entities/subscription/lib/useSubscriptions.test.ts` → `entities/subscription/model/useSubscriptions.test.ts`
- [x] 2.4 Keep `entities/subscription/lib/calcProgress.ts` in place
- [x] 2.5 Update `entities/subscription/index.ts` barrel to export from `model/` and `lib/`

## 3. Shared utility library

- [x] 3.1 Implement `shared/lib/formatDate.ts` with Russian-locale date formatting
- [x] 3.2 Implement `shared/lib/pluralize.ts` with Russian noun declension
- [x] 3.3 Add barrel `shared/lib/index.ts`
- [x] 3.4 Write tests for `formatDate` and `pluralize`

## 4. Feature-entity integration

- [x] 4.1 Refactor `NewSubscriptionForm` to call `useSubscriptions()` internally, remove `onAdd` prop
- [x] 4.2 Refactor `MarkVisitButton` to call `useSubscriptions()` internally, remove `onAddVisit` and `remaining` props; accept only `subId`
- [x] 4.3 Update `features/create-subscription/index.ts` barrel if needed
- [x] 4.4 Update `features/mark-visit/index.ts` barrel if needed
- [x] 4.5 Update `NewSubscriptionForm.test.ts` — mount without `onAdd` prop, use mock `useSubscriptions` or localStorage
- [x] 4.6 Update `MarkVisitButton.test.ts` — mount without `onAddVisit` prop, use mock `useSubscriptions` or localStorage

## 5. Page simplification

- [x] 5.1 Update `pages/home/ui/Home.tsx` — stop passing `onAdd` to `NewSubscriptionForm`, stop passing `addSubscription` callbacks to `SubscriptionList`
- [x] 5.2 Update `pages/subscription-page/ui/SubscriptionPage.tsx` — stop passing `onAddVisit`, `onDeleteVisit`, `onEditVisit` to `SubscriptionDetail`
- [x] 5.3 Update `Home.test.tsx` if needed
- [x] 5.4 Update `SubscriptionPage.test.tsx` if needed

## 6. Widget import updates (if needed)

- [x] 6.1 Audit imports in all widgets for changed entity paths (useSubscriptions, types)
- [x] 6.2 Update barrel files if entity export paths changed

## 7. @feature-sliced/eslint-config setup

- [x] 7.1 Add `@feature-sliced/eslint-config` to `eslint.config.js` in flat config format
- [x] 7.2 Configure layer elements mapping (app → src/app, pages → src/pages, etc.)
- [x] 7.3 Allow horizontal widget imports (configure `layers-slices` rule to permit widgets→widgets)
- [x] 7.4 Handle `@/` alias in plugin settings
- [x] 7.5 Run `npx eslint src/` and fix any violations

## 8. Integration cleanup

- [x] 8.1 Remove empty `entities/subscription/lib/` directory (if only calcProgress remains, it may stay)
- [x] 8.2 Verify all imports across the project resolve correctly
- [x] 8.3 Run full test suite: `npm test`
- [x] 8.4 Run full lint: `npm run lint`
- [x] 8.5 Run build: `npm run build`
