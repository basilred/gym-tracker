## Why

Хук `useSubscriptions` работает с `localStorage` без обработки ошибок. Если данные повреждены — приложение падает с необработанным `SyntaxError`. Если хранилище переполнено — `QuotaExceededError` также крашит приложение. Нужна минимальная защита.

## What Changes

- Оборачиваем `JSON.parse` в try-catch: при ошибке возвращаем пустой массив и удаляем повреждённые данные из хранилища
- Оборачиваем `localStorage.setItem` в try-catch: при ошибке пишем предупреждение в консоль

## Capabilities

### Modified Capabilities
- `useSubscriptions`: обработка ошибок чтения и записи из localStorage

## Impact

- `src/hooks/useSubscriptions.js`: добавляются блоки try-catch для `JSON.parse` и `localStorage.setItem`
