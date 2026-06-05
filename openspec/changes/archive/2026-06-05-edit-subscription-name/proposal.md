## Why

Пользователи не могут изменить название абонемента после создания. Единственный способ — удалить и создать заново, что приводит к потере истории посещений.

## What Changes

- Добавить метод `updateSubscription(id, { name })` в хук `useSubscriptions`
- Сделать имя абонемента редактируемым инлайн (клик по имени → textarea) в карточке списка и на детальной странице
- Enter (без Shift)/blur → сохранение, Escape → отмена
- Пустое имя при сохранении → дефолтное (как при создании)
- textarea с авторастяжением, перенос строк в карточке

## Capabilities

### New Capabilities

- *(none)*

### Modified Capabilities

- `use-subscriptions`: новый метод `updateSubscription(id, updates)` для частичного обновления полей абонемента

## Impact

- `src/entities/subscription/lib/useSubscriptions.ts` — новый метод `updateSubscription`
- `src/entities/subscription/lib/useSubscriptions.test.ts` — тесты нового метода
- `src/widgets/subscription-card/ui/SubscriptionCard.tsx` — инлайн-редактирование имени
- `src/widgets/subscription-card/ui/SubscriptionCard.test.tsx` — тесты редактирования
- `src/widgets/subscription-detail/ui/SubscriptionDetail.tsx` — инлайн-редактирование имени
- `src/widgets/subscription-detail/ui/SubscriptionDetail.test.tsx` — тесты редактирования
- `src/pages/home/ui/Home.tsx` — прокинуть `updateSubscription`
- `src/pages/subscription-page/ui/SubscriptionPage.tsx` — прокинуть `updateSubscription`
- Новые CSS-стили для инлайн-редактирования
