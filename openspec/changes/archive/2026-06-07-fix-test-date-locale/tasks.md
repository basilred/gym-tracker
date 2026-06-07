## 1. Test infrastructure

- [x] 1.1 Add mock for `Date.prototype.toLocaleDateString` in `src/app/test-setup.ts` фиксирующий локаль `en-US`
- [x] 1.2 Update coverage thresholds if needed and run `npm run test:coverage` для верификации

## 2. Fix failing tests

- [x] 2.1 Fix `src/widgets/subscription-card/ui/SubscriptionCard.test.tsx` — тест `renders start date` (строка 39)
- [x] 2.2 Fix `src/widgets/subscription-detail/ui/SubscriptionDetail.test.tsx` — тесты `renders start date` (строка 36) и `renders VisitTimeline` (строка 76)
- [x] 2.3 Fix `src/widgets/visit-timeline/ui/VisitTimeline.test.tsx` — тесты `renders visit dates` (строка 35), `enters edit mode` (строка 74), `calls onEditVisit` (строка 87), `exits edit mode on blur` (строка 100), `respects min and max date bounds` (строка 113)
