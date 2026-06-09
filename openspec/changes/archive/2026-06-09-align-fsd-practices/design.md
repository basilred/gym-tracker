## Context

Проект реорганизован в FSD-light в рамках предыдущего изменения (archive/2026-06-05-reorganize-project-structure). Анализ текущей структуры показал расхождения с каноничным FSD: в `entities/subscription/lib/` смешаны model-логика (`useSubscriptions`) и чистые утилиты (`calcProgress`); features (`NewSubscriptionForm`, `MarkVisitButton`) получают данные через props от pages, а не импортируют entities напрямую; отсутствует `shared/lib/` для общих утилит; нет автоматической проверки границ слоёв.

## Goals / Non-Goals

**Goals:**
- Разделить `entities/subscription/lib/` на `model/` (useSubscriptions, types) и `lib/` (calcProgress)
- Перевести features на прямой импорт entities вместо props-прокидывания
- Создать `shared/lib/` с formatDate, pluralize, cn-helper
- Настроить `eslint-plugin-boundaries` для автоматической проверки правил слоёв
- Обновить все import-пути и barrel-файлы
- Все тесты остаются зелёными (рефакторинг без изменения поведения)

**Non-Goals:**
- Изменение бизнес-логики useSubscriptions, компонентов или стилей
- Рефакторинг горизонтальных импортов между widgets (осознанное отклонение, зафиксировано в design.md archive)
- Добавление новых сущностей (workout, exercise) — только реструктуризация существующих
- Изменение схемы данных или API (localStorage)

## Decisions

### Decision 1: model/ vs lib/ в entities

**Решение:** `entities/subscription/` получает сегмент `model/`:

```
entities/subscription/
├── model/
│   ├── useSubscriptions.ts    ← React-хук (стейт + CRUD)
│   └── types.ts               ← Subscription, Visit, SubscriptionStorage
├── lib/
│   └── calcProgress.ts        ← чистая функция
└── index.ts                   ← barrel
```

**Почему не model + lib внутри одного сегмента:** Смешение model и lib в FSD — антипаттерн. `useSubscriptions` содержит состояние, сайд-эффекты, бизнес-логику — это не утилита. Разделение даёт предсказуемую навигацию: знаешь, где искать стейт (model), а где — чистые функции (lib).

### Decision 2: Features импортируют entities напрямую

**Решение:** `NewSubscriptionForm` и `MarkVisitButton` вызывают `useSubscriptions()` внутри себя вместо получения колбэков через props.

```tsx
// Было
interface Props { onAdd: (name, total, date) => void }

// Стало
import { useSubscriptions } from 'entities/subscription';
export default function NewSubscriptionForm() {
  const { addSubscription } = useSubscriptions();
  // ...
}
```

**Почему не DI через props:** FSD-философия — feature владеет своим сценарием. Если feature не знает о сущностях, он не является самодостаточным модулем. Pages становятся «толстыми» дирижёрами. Прямой импорт делает features тестируемыми изолированно и позволяет читать карту возможностей из `features/`.

**Альтернатива, которую отклонили:** DI-контейнер с инверсией зависимостей — overkill для проекта с 2 features и 1 entity.

### Decision 3: Состав shared/lib/

**Решение:** Создать три файла:

- `shared/lib/formatDate.ts` — форматирование дат в русской локали
- `shared/lib/pluralize.ts` — склонение числительных (8 занятий, 1 занятие)
- `shared/lib/cn.ts` — обёртка над `@bem-react/classname` (если понадобится)

**Почему не выносить всё:** Только то, что реально переиспользуется в 2+ модулях. `getTodayLocal()` в NewSubscriptionForm — одноразовый, не выносится.

### Decision 4: @feature-sliced/eslint-config

**Решение:** Установить официальный `@feature-sliced/eslint-config` (core-команда FSD), который под капотом использует `eslint-plugin-boundaries` + `eslint-plugin-import`. Это даёт три правила:
- `layers-slices` — проверка иерархии слоёв (boundaries)
- `public-api` — импорт только через barrel-файлы (import)
- `import-order` — сортировка импортов (import)

**Почему @feature-sliced/eslint-config, а не ручная конфигурация boundaries:** Официальный конфиг содержит выверенные настройки для FSD, поддерживается core-командой, и при обновлении методологии правила будут эволюционировать вместе с ней. Для FSD-light достаточно будет ослабить `layers-slices`, разрешив горизонтальные импорты виджетов.

**Альтернатива Steiger:** FSD также рекомендует [steiger](https://github.com/feature-sliced/steiger) — отдельный линтер архитектуры. Но для проекта, где уже есть ESLint, проще добавить конфиг, чем второй линтер в пайплайн.

## Risks / Trade-offs

- **Risk: Изменение API features (пропали пропсы) → сломаются тесты** → Все тесты используют features с пропсами. Нужно обновить тесты: либо замокать `useSubscriptions`, либо использовать реальный хук с тестовым хранилищем
- **Risk: @feature-sliced/eslint-config может давать false positives на алиас @/** → В `@feature-sliced/eslint-config` можно передать alias в настройках плагина
- **Trade-off: Прямой импорт entities усложняет юнит-тестирование features (нужен mock useSubscriptions)** → Компенсируется тем, что features тестируются как пользователь (интеграционные тесты), а не изолированно
- **Risk: Рефакторинг импортов может затронуть все файлы проекта** → План: по одному коммиту на каждый слой, запуск тестов после каждого коммита
