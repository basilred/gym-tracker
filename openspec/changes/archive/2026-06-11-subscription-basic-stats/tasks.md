## 1. Вычисления

- [x] 1.1 Создать `src/shared/lib/calcSubscriptionStats.ts` с чистой функцией `calcSubscriptionStats(subscription): SubscriptionStats`
- [x] 1.2 Реализовать расчёт частоты: `visits.length / weeksSinceStart`
- [x] 1.3 Реализовать расчёт дней с последнего визита
- [x] 1.4 Реализовать расчёт прогноза даты окончания (при `visits.length >= 2`)
- [x] 1.5 Реализовать расчёт максимального перерыва между визитами
- [x] 1.6 Написать unit-тесты на `calcSubscriptionStats`

## 2. Виджет

- [x] 2.1 Создать `src/widgets/subscription-stats/` со структурой: `ui/SubscriptionStats.tsx`, `index.ts`, BEM-стили
- [x] 2.2 Реализовать компонент `SubscriptionStats`, принимающий `Subscription` и рендерящий блок статистики
- [x] 2.3 Встроить `SubscriptionStats` в `SubscriptionDetail` под `VisitTimeline`

## 3. Финальная проверка

- [x] 3.1 Проверить, что линтер не выдаёт ошибок (`npm run lint`)
- [x] 3.2 Проверить, что TypeScript не выдаёт ошибок (`npm run typecheck`)
- [x] 3.3 Запустить тесты (`npm run test`)
