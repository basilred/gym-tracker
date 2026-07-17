## 1. Хранилище (IndexedDB)

- [x] 1.1 Установить зависимости: `idb`, `fake-indexeddb` (dev)
- [x] 1.2 Создать `src/shared/lib/storage.ts` с функциями `openDb`, `getSubscriptions`, `saveSubscription`, `deleteSubscription`, `migrateFromLocalStorage`
- [x] 1.3 Создать `src/shared/lib/storage.test.ts` с тестами на CRUD, миграцию, schema version, `fake-indexeddb` setup
- [x] 1.4 Переписать `useSubscriptions` — заменить localStorage на вызовы `storage.ts`
- [ ] 1.5 Обновить существующие тесты `useSubscriptions.test.ts` — перевести с localStorage на `fake-indexeddb`

## 2. Логика уведомлений

- [ ] 2.1 Создать `src/features/notifications/lib/checkNotifications.ts` с чистой функцией, реализующей все 4 детектора: stale, expired, almost-finished, milestone
- [ ] 2.2 Создать `src/features/notifications/lib/checkNotifications.test.ts` с тестами на граничные случаи и дедупликацию
- [ ] 2.3 Создать `src/features/notifications/model/types.ts` с `NotificationSettings`, `NotificationReason`, `NotificationType`
- [ ] 2.4 Создать `src/features/notifications/model/useNotifications.ts` — хук, проверяющий при mount и при изменениях subscriptions, с дедупликацией и вызовом `Notification API`
- [ ] 2.5 Создать `src/features/notifications/model/useNotifications.test.ts` с тестами на моках `Notification`

## 3. UI настроек

- [ ] 3.1 Создать `src/features/notifications/ui/NotificationSettings.tsx` с формой: вкл/выкл, threshold (input), toggles для каждого типа
- [ ] 3.2 Создать `src/features/notifications/ui/NotificationSettings.css` (BEM)
- [ ] 3.3 Создать `src/features/notifications/ui/NotificationSettings.test.tsx` с тестами рендера и взаимодействия
- [ ] 3.4 Создать `src/features/notifications/index.ts` (экспорт)
- [ ] 3.5 Встроить кнопку настроек на главную страницу (Home), открывающую NotificationSettings как модалку
- [ ] 3.6 Импортировать CSS в `main.tsx`

## 4. Интеграция уведомлений в App

- [ ] 4.1 Подключить `useNotifications` в `App.tsx` (достаточно один раз на уровне App, не внутри роутов)

## 5. Финальная проверка

- [ ] 5.1 Проверить, что линтер не выдаёт ошибок (`npm run lint`)
- [ ] 5.2 Проверить, что тесты проходят (`npm run test`)
- [ ] 5.3 Проверить сборку (`npm run build`)
