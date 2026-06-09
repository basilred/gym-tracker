## Why

Проект использует FSD-light, но при сравнении с каноничным FSD обнаружены diverge-точки: model-логика (useSubscriptions) лежит в lib/, features не импортируют entities напрямую, отсутствует shared/lib/. Пока проект мал, эти расхождения не критичны, но с ростом кодовой базы они приведут к путанице в навигации, циклическим зависимостям и бессистемному росту слоёв.

## What Changes

- `entities/subscription/lib/` разделить на `model/` (useSubscriptions) и `lib/` (calcProgress)
- `entities/subscription/types.ts` перенести в `model/types.ts` (каноничное расположение)
- Features (`NewSubscriptionForm`, `MarkVisitButton`) перевести на прямой импорт entities вместо получения колбэков через props
- Добавить `shared/lib/formatDate.ts`, `shared/lib/pluralize.ts`, `shared/lib/cn.ts` — вынести дублирующиеся inline-форматирования
- Обновить импорты во всех файлах проекта
- Настроить eslint-plugin-boundaries для автоматической проверки правил слоёв

## Capabilities

### New Capabilities
- `entity-model-segment`: Стандартизация структуры entities: `model/` для стейта/бизнес-логики, `lib/` для чистых утилит
- `feature-entity-integration`: Features импортируют entities напрямую (useSubscriptions, типы) вместо получения данных через props
- `shared-utility-library`: shared/lib/ с переиспользуемыми утилитами (formatDate, pluralize, cn)
- `fsd-eslint-rules`: ESLint-конфигурация для автоматической проверки границ слоёв

### Modified Capabilities
Нет (предыдущий `fsd-layout` spec в архиве, не активен)

## Impact

- `src/entities/subscription/` — реструктуризация сегментов (model/, lib/)
- `src/features/create-subscription/` — замена props на прямой импорт entities
- `src/features/mark-visit/` — замена props на прямой импорт entities
- `src/pages/home/` — перестанет прокидывать колбэки в features (станет тоньше)
- `src/pages/subscription-page/` — перестанет прокидывать колбэки в features
- `src/shared/` — новая директория lib/
- `eslint.config.js` — добавление @feature-sliced/eslint-config (официальный конфиг FSD)
- Все тесты остаются зелёными (рефакторинг без изменения поведения)
