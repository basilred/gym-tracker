## Context

Сейчас данные хранятся в localStorage через `useSubscriptions`. Service Worker не имеет доступа к localStorage, что блокирует шаг 2 (уведомления когда PWA закрыто). На первом шаге мигрируем на IndexedDB, добавляем систему уведомлений через Notification API, проверяемых при открытии PWA.

## Goals / Non-Goals

**Goals:**
- Замена `useSubscriptions` на хранение в IndexedDB (библиотека `idb`)
- Автоматическая миграция данных из localStorage в IndexedDB при первом запуске
- Notification API: 4 типа уведомлений при открытии PWA
- React-хук `useNotifications` с проверками при mount и подпиской на изменения
- Страница/блок настроек уведомлений
- Тесты: `fake-indexeddb` для модуля хранилища

**Non-Goals:**
- Кастомный Service Worker
- Periodic Background Sync (шаг 2)
- Уведомления когда PWA закрыто (шаг 2)
- Бэкенд или Push API
- Графики или календарь активности
- E2E-тесты

## Decisions

### 1. Хранилище: idb вместо нативного IndexedDB

Нативный IndexedDB требует много шаблонного кода (транзакции, курсоры, обработка ошибок). `idb` — минимальная обёртка (0 зависимостей, 1.6kB), дающая промис-интерфейс, автозакрытие транзакций, тайпскрипт-типы.

```
// нативный IndexedDB
const tx = db.transaction('subscriptions', 'readwrite');
const store = tx.objectStore('subscriptions');
store.put(sub);
tx.oncomplete = () => resolve();

// c idb
await db.put('subscriptions', sub);
```

**Альтернатива**: `idb-keyval` (ещё проще, но только key-value, без query). Отклонён — нужна возможность итерировать и фильтровать.

### 2. Схема IndexedDB

```
┌─────────────────────────────────────────────────────────────┐
│                    IndexedDB: gym-tracker                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Object Store: subscriptions                                 │
│  ┌──────┬─────────┬───────────────┬────────┬──────────────┐ │
│  │  id  │  name   │ totalSessions │ start  │    visits    │ │
│  │      │         │               │  Date  │              │ │
│  ├──────┼─────────┼───────────────┼────────┼──────────────┤ │
│  │ uuid │ "ТР 12" │      12       │  ...   │  [{...},...] │ │
│  └──────┴─────────┴───────────────┴────────┴──────────────┘ │
│  Key path: id                                                │
│  Schema version: 2                                           │
│                                                             │
│  Object Store: meta                                          │
│  ┌──────────────────┬──────────────────────────────────────┐ │
│  │     key          │              value                   │ │
│  ├──────────────────┼──────────────────────────────────────┤ │
│  │ "schemaVersion"  │  2                                  │ │
│  │ "migrated"       │  true                               │ │
│  └──────────────────┴──────────────────────────────────────┘ │
│  Key path: key                                               │
└─────────────────────────────────────────────────────────────┘
```

### 3. Миграция при первом запуске

```
useSubscriptions mount
       │
       ▼
┌──────────────────┐
│ Открыть IndexedDB │
│ версия 2          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ meta.migrated == │──yes──→ читать из IndexedDB
│ true?             │
└────────┬─────────┘
         │ no
         ▼
┌──────────────────┐
│ localStorage     │
│ gym_subscriptions│──exists?──→ прочитать, скопировать,
│ есть?            │              записать migrated = true,
└────────┬─────────┘              очистить localStorage
         │ no
         ▼
┌──────────────────┐
│ пустой IndexedDB │
│ (начать с нуля)  │
└──────────────────┘
```

Миграция идемпотентна: если `migrated = true` — пропускаем. Очистка localStorage после успешной записи в IndexedDB. На случай ошибки при записи — данные остаются в localStorage.

### 4. Архитектура уведомлений

```
┌──────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM                            │
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐     ┌────────────────┐   │
│   │ useSubscrip- │───▶│ useNotific-  │────▶│ Notification   │   │
│   │ tions (IDB)  │    │ ations (hook)│     │ API            │   │
│   └──────────────┘    │              │     └────────────────┘   │
│                       │  Проверяет:  │                          │
│   ┌──────────────┐    │  • stale     │    ┌────────────────┐   │
│   │ Notification │───▶│  • expired   │───▶│ Settings UI    │   │
│   │ Settings      │    │  • almost    │    │ (вкл/выкл)     │   │
│   │ (IDB meta)   │    │  • milestone │    └────────────────┘   │
│   └──────────────┘    └──────────────┘                          │
│                                                                  │
│   Хук срабатывает:                                               │
│   • при mount компонента                                         │
│   • при изменении subscriptions (addVisit, deleteSubscription)   │
│   • максимум 1 раз в N минут (дедупликация)                     │
└──────────────────────────────────────────────────────────────────┘
```

### 5. Логика проверок

```typescript
interface NotificationSettings {
  enabled: boolean;
  staleDaysThreshold: number; // по умолчанию 7
  showExpired: boolean;       // true
  showAlmost: boolean;        // true
  showMilestone: boolean;     // true
  lastNotificationShown: string | null; // ISO date
}

// проверки возвращают массив "причин" для уведомления
function checkNotifications(subs: Subscription[], settings: NotificationSettings): NotificationReason[] {
  const reasons: NotificationReason[] = [];
  const COOLDOWN_HOURS = 6;

  if (settings.lastNotificationShown &&
      hoursSince(settings.lastNotificationShown) < COOLDOWN_HOURS) {
    return []; // дедупликация
  }

  for (const sub of subs) {
    if (isSubscriptionStale(sub, settings.staleDaysThreshold)) {
      reasons.push({ type: 'stale', sub });
    }
    if (settings.showExpired && isExpired(sub)) {
      reasons.push({ type: 'expired', sub });
    }
    if (settings.showAlmost && isAlmostFinished(sub)) {
      reasons.push({ type: 'almost-finished', sub });
    }
    if (settings.showMilestone && hasMilestone(sub)) {
      reasons.push({ type: 'milestone', sub });
    }
  }
  return reasons;
}
```

### 6. UI настроек

Новый блок на главной странице (Home) или отдельная кнопка в хедере → модалка. Выбран вариант с модалкой, чтобы не загружать главную:

```
┌────────────────────────────────────┐
│ ⚙ Настройки уведомлений            │
│                                    │
│ 🔘 Уведомления включены            │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Напоминать если не был(а)      │ │
│ │ более [ 7 ] дней              │ │
│ └────────────────────────────────┘ │
│                                    │
│ ☑ Абонемент закончен               │
│ ☑ Скоро закончится (≤ 2 занятий)   │
│ ☑ Прогресс (50%, 100%)            │
│                                    │
│                  [ Закрыть ]       │
└────────────────────────────────────┘
```

### 7. Модульная структура

```
src/
└── features/
    └── notifications/
        ├── index.ts
        ├── lib/
        │   ├── checkNotifications.ts   ← чистая функция
        │   └── checkNotifications.test.ts
        ├── model/
        │   ├── useNotifications.ts      ← React-хук
        │   ├── useNotifications.test.ts
        │   └── types.ts                 ← NotificationSettings, NotificationReason
        └── ui/
            ├── NotificationSettings.tsx
            ├── NotificationSettings.css
            └── NotificationSettings.test.tsx
```

### 8. Тесты

- `fake-indexeddb` — заглушка IndexedDB для vitest (jsdom)
- Тесты хранилища: миграция, CRUD, schema version upgrade
- Тесты `checkNotifications`: граничные случаи (дедупликация, threshold, пустой список)
- Тесты `useNotifications`: мок Notification API, проверка при mount, при изменениях
- Тесты UI: OpenSettings → toggle → save

## Risks / Trade-offs

- **iOS Safari**: Notification API работает, но SW не живёт в фоне — уведомления только при открытом PWA. Это ок для шага 1, в шаге 2 решаем.
- **Android Chrome**: PeriodicBG Sync для шага 2 потребует кастомный SW и дополнительное разрешение пользователя (может отказаться).
- **Permission rejected**: Если пользователь запретил уведомления в браузере — `Notification.requestPermission()` возвращает `denied`. Нужно показывать пояснение, а не просто молчать.
- **Миграция данных**: Если пользователь откроет приложение в двух вкладках одновременно — обе попытаются мигрировать. Нужна защита через `meta.migrated` проверку на уровне открытия IDB. После первой успешной миграции вторая просто прочитает `migrated = true`.
- **Schema version upgrade**: При изменении схемы в будущем — обновляем номер версии в `openDB`, блок `upgrade` обрабатывает миграцию.
