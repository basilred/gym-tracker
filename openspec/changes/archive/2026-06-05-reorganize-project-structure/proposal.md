## Why

Файлы в `src/` организованы по техническому признаку (components/, hooks/, pages/), что не отражает связанность кода по доменам. По мере роста проекта это усложняет навигацию: чтобы понять, какие типы и утилиты относятся к абонементам, нужно открывать три разных каталога. Реорганизация в feature-first структуру сделает код самодокументируемым и упростит добавление новых фич.

## What Changes

- Внедрение FSD-light (Feature-Sliced Design) — группировка кода по доменам вместо технических слоёв
- Перенос `types.ts` в `entities/subscription/types.ts`
- Перенос `utils.ts` (calcProgress) в `entities/subscription/lib/calcProgress.ts`
- Перенос `useSubscriptions` в `entities/subscription/lib/useSubscriptions.ts`
- `NewSubscriptionForm` — в `features/create-subscription/`
- Выделение кнопки отметки посещения из `SubscriptionDetail` в отдельный feature `features/mark-visit/`
- `SubscriptionCard` — в `widgets/subscription-card/`
- `SubscriptionDetail` — в `widgets/subscription-detail/`
- `VisitTimeline` — в `widgets/visit-timeline/`
- `ErrorBoundary` — в `shared/ui/ErrorBoundary/`
- `tokens.css` — в `shared/styles/tokens.css`
- `Home` — в `pages/home/`
- `SubscriptionPage` — в `pages/subscription-page/`
- `App.tsx` и `main.tsx` — в `app/`
- Создание barrel-файлов (index.ts) для всех модулей
- Актуализация всех import-путей
- Никаких изменений в логике компонентов, только перегруппировка файлов

## Capabilities

### New Capabilities
- `fsd-layout`: Целевая структура проекта по методологии FSD-light с правилами зависимостей между слоями

### Modified Capabilities
<!-- No existing specs change — это pure рефакторинг структуры, поведение не меняется -->

## Impact

- `src/` — полная перегруппировка всех файлов
- Тесты — обновление import-путей, без изменения тестовой логики
