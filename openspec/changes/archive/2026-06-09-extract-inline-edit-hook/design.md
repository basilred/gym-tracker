## Context

Сейчас inline-edit названия абонемента реализован в двух компонентах:

- `widgets/subscription-card/` — редактирование из списка (карточка)
- `widgets/subscription-detail/` — редактирование на детальной странице

Оба содержат идентичный набор состояний, ref, колбэков и эффектов:
`useState` для `editing`/`editValue`, `useRef<HTMLTextAreaElement>`, `autoResize()`, `commitEdit()`, `cancelEdit()`, `handleKeyDown()`, `useEffect(focus)`.

Слой `shared` не имеет сегмента `hooks/`. Новый хук станет его первым обитателем.

## Goals / Non-Goals

**Goals:**
- Устранить дублирование логики inline-edit между двумя компонентами
- Создать хук `useInlineEdit` в `shared/hooks/` (первый хук в shared-слое)
- Сохранить поведение 1:1 — никаких изменений UX
- Сохранить BEM-классы каждого компонента (они разные — `card('EditInput')` vs `detail('EditInput')`)

**Non-Goals:**
- Не создавать UI-компонент `InlineEdit` (рендер остаётся в каждом компоненте)
- Не рефакторить другие дублирования (menu, progress-bar)
- Не менять CSS или HTML-структуру
- Не добавлять новые возможности

## Decisions

### Decision 1: Хук, а не render-prop компонент

**Выбран:** хук `useInlineEdit`

**Отвергнуто:** UI-компонент `InlineEdit` с render-prop для trigger-части

**Rationale:** JSX-часть достаточно различается:
- SubscriptionCard оборачивает контент в `<Link>` и `<h3>`, имеет `onClick(e).preventDefault()` на textarea
- SubscriptionDetail использует `<h2>` и дополнительный `handleTitleKeyDown` для a11y
- BEM-классы разные (`card()` vs `detail()`)
- Рендер-проп усложнит API без существенной выгоды для двух потребителей

Хук даёт всю пользу (единая логика) без оверхеда абстракции рендера.

### Decision 2: Сигнатура хука

```ts
useInlineEdit(originalValue: string, onSave: (value: string) => void): {
  editing: boolean;
  editValue: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  startEditing: () => void;
  commitEdit: () => void;
  cancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  autoResize: () => void;
}
```

Параметр `originalValue` — текущее значение (при изменении извне сброс не происходит, синхронизация только при `cancelEdit`).
Параметр `onSave` — колбэк сохранения, вызывается только при реальном изменении значения.

Хук не вызывает `setEditing(false)` при изменении `originalValue` извне — это позволяет редактировать без прерывания. Синхронизация с внешним миром только через `commitEdit` → `onSave` и `cancelEdit` → восстановление `editValue`.

### Decision 3: Отказ от specs

Поскольку это чистый рефакторинг без изменения пользовательского поведения, spec-файлы не требуются. Ни одна существующая capability не меняет своих требований. Пропускаем шаг создания specs.

## Risks / Trade-offs

- **[Low] Несоответствие default value при асинхронном обновлении**: Если `originalValue` изменится во время редактирования, `commitEdit` может перезаписать новое значение старым. **Mitigation**: в текущей архитектуре `originalValue` (sub.name) не меняется без участия этого же хука.
- **[Low] Единственный пользователь хука**: Сейчас всего два потребителя. Если появится третий, возможно, понадобится UI-компонент. **Mitigation**: хук — правильный первый шаг, миграция на компонент будет обратно совместимой.
- **[Note] autoResize вызывается вне хука**: В SubscriptionCard `autoResize()` вызывается в `onChange` textarea. Это нормально — функция стабильная (useCallback в хуке).
