## Why

Тесты дат падают на системе с не-американской локалью. `new Date().toLocaleDateString()` без аргумента возвращает формат, зависимый от системы — на `ru-RU` это `15.01.2026`, а тесты ожидают `1/15/2026`. Это делает тесты недетерминированными и ломает CI на машинах с разными локалями.

## What Changes

- Добавить мок `Date.prototype.toLocaleDateString` в `src/app/test-setup.ts`, фиксирующий локаль `en-US`
- Поправить 8 падающих тестов в 3 файлах: даты ожидают формат, соответствующий зафиксированной локали

## Capabilities

### New Capabilities

Нет новых capabilities — это изменение тестовой инфраструктуры.

### Modified Capabilities

Нет изменений в существующих spec-файлах.

## Impact

- `src/app/test-setup.ts` — одна строка с моком
- `src/widgets/subscription-card/ui/SubscriptionCard.test.tsx` — 1 тест
- `src/widgets/subscription-detail/ui/SubscriptionDetail.test.tsx` — 2 теста
- `src/widgets/visit-timeline/ui/VisitTimeline.test.tsx` — 5 тестов
