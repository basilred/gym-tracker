## Why

Логика inline-edit (textarea с авторазмером, управление режимами редактирования, обработка Enter/Escape) дублируется в двух компонентах — `SubscriptionCard` и `SubscriptionDetail`. Это ~40 строк идентичного кода с минимальными вариациями (BEM-классы, обёртка в Link). Дублирование усложняет поддержку и увеличивает риск расхождения при доработках.

## What Changes

- Создать хук `useInlineEdit` в `shared/hooks/`, инкапсулирующий общую логику редактирования
- Заменить дублированный код в `SubscriptionCard` и `SubscriptionDetail` на вызов хука
- Удалить дублированные состояния, ref, `autoResize`, `commitEdit`, `cancelEdit`, `handleKeyDown`, `useEffect(focus)`
- **Поведение не меняется** — только рефакторинг без изменения пользовательского опыта

## Capabilities

### New Capabilities
- *(none — чисто внутренний рефакторинг, новые пользовательские возможности не добавляются)*

### Modified Capabilities
- *(none — поведение не меняется, spec-файлы не требуются)*

## Impact

- `src/shared/hooks/` — новый сегмент FSD-слоя `shared`
- `src/shared/hooks/useInlineEdit.ts` — новый файл с хуком
- `src/widgets/subscription-card/ui/SubscriptionCard.tsx` — замена дублированного кода на хук
- `src/widgets/subscription-detail/ui/SubscriptionDetail.tsx` — замена дублированного кода на хук
- Никаких изменений в зависимостях, API, сборке или CI
