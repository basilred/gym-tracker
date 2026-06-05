## Context

Сейчас имя абонемента задаётся только при создании через `NewSubscriptionForm` и впоследствии нередактируемо. Хук `useSubscriptions` не предоставляет методов для обновления полей существующего абонемента. UI показывает имя в карточке (`SubscriptionCard`) и на детальной странице (`SubscriptionDetail`) как простой текст.

## Goals / Non-Goals

**Goals:**
- Добавить `updateSubscription` в `useSubscriptions` для частичного обновления полей
- Инлайн-редактирование имени в `SubscriptionCard` (список)
- Инлайн-редактирование имени в `SubscriptionDetail` (детальная страница)
- Поддержка многострочного ввода (textaria с авторастяжением)
- Корректная обработка пустого имени (дефолтное)

**Non-Goals:**
- Редактирование других полей (`totalSessions`, `startDate`) — в этом issue не требуется
- Drag-n-drop, swipe-to-edit и прочие жесты — только клик
- Валидация длины имени — неограничено

## Decisions

1. **updateSubscription(id, updates) vs renameSubscription(id, name)**
   - Выбран `updateSubscription(id, updates: Partial<Pick<Subscription, 'name'>>)` — универсальный метод, не привязанный к одному полю. В будущем можно расширить без ломающих изменений.

2. **textarea vs input[type=text]**
   - textarea, т.к. имя может быть многострочным. Авторастяжение через CSS (`field-sizing: content` или JS-аналог).

3. **Сохранение и отмена**
   - Enter (без Shift) / blur → save
   - Escape → cancel (возврат к исходному значению)
   - Enter + Shift → новая строка (стандартное поведение textarea)
   - Пустое значение при save → подставляется дефолтное `Абонемент ${new Date().toLocaleDateString()}`

4. **Состояние редактирования**
   - Локальное `useState<boolean>` в каждом компоненте (`SubscriptionCard`, `SubscriptionDetail`)
   - Не выносится в стор — редактирование изолировано

5. **Перенос строк в карточке**
   - CSS: `white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;`
   - textarea с `rows={1}` и авторастяжением

## Risks / Trade-offs

- **Перенос строк в карточке может сломать grid** → `line-clamp` или ограничение высоты не применяем, карточка растягивается контентом (сетка grid это поддерживает)
- **Случайный blur при переключении вкладок** → обработчик только на кликах внутри документа, не на visibilitychange
- **Конфликт с Link в SubscriptionCard** → клик по имени не должен триггерить навигацию (e.stopPropagation / e.preventDefault)
