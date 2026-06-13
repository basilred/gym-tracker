## Why

Хук `useInlineEdit` вынесен, но JSX-разметка (textarea + view-mode trigger + обработчики) остаётся идентичной в `SubscriptionCard` и `SubscriptionDetail`. Различаются только теги (h3 vs h2), тип триггера (button vs span) и BEM-классы стилей. Дублирование ~15 строк разметки и ~25 строк CSS. Изменение поведения inline-edit требует правки в двух местах.

## What Changes

- Создать UI-компонент `InlineEdit` в `src/shared/ui/InlineEdit/` с собственным BEM-блоком и базовым CSS
- Компонент принимает пропсы из хука + опции (`as`, `trigger`, `className`)
- Заменить дублированную JSX-разметку в `SubscriptionCard` и `SubscriptionDetail` на `<InlineEdit>`
- Через BEM mix (`className={card()}`) дать потребителям оверрайдить стили
- Написать тесты компонента
- **Поведение не меняется** — только рефакторинг

## Capabilities

### New Capabilities
- `inline-edit-component`: Переиспользуемый UI-компонент `InlineEdit` в `shared/ui/`

### Modified Capabilities
- *(none — поведение не меняется)*

## Impact

- `src/shared/ui/InlineEdit/` — новый компонент (tsx, css, test, index)
- `src/widgets/subscription-card/ui/SubscriptionCard.tsx` — замена разметки на `<InlineEdit>`
- `src/widgets/subscription-detail/ui/SubscriptionDetail.tsx` — замена разметки на `<InlineEdit>`
- `src/widgets/subscription-card/ui/SubscriptionCard.css` — удаление `.SubscriptionCard-EditInput` и `.SubscriptionCard-TitleEditTrigger`
- `src/widgets/subscription-detail/ui/SubscriptionDetail.css` — удаление `.SubscriptionDetail-EditInput` и `.SubscriptionDetail-TitleEditTrigger`
- Тесты обоих виджетов остаются без изменений (проверяют поведение, не детали реализации)
