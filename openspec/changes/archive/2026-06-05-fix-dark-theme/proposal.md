## Why

Тёмная тема в приложении имеет критический контрастный баг: токен `--color-surface` используется одновременно как цвет фона карточек и как цвет текста на кнопках. В тёмной теме `--color-surface = #16213e` — тёмно-синий текст на синих/красных кнопках даёт контраст 2.6:1 при минимуме WCAG AA 4.5:1. Дополнительно поля ввода не имеют собственного фона и сливаются с поверхностью формы. ErrorBoundary не имеет стилей вообще.

## What Changes

- **Новые токены**: `--color-on-primary`, `--color-on-danger`, `--color-input-bg` — семантически корректные токены для цвета текста на цветных фонах и фона полей ввода
- **Исправление button text**: `SubscriptionDetail-MarkBtn`, `NewSubscriptionForm-SubmitBtn` — замена `color: var(--color-surface)` на `color: var(--color-on-primary)`
- **Исправление danger text**: `SwipeableVisit-DeleteBtn` — замена `color: var(--color-surface)` на `color: var(--color-on-danger)`
- **Исправление input background**: `NewSubscriptionForm-Input`, `NewSubscriptionForm-Select`, `SwipeableVisit-DateInput` — добавление `background-color: var(--color-input-bg)`
- **Стилизация ErrorBoundary**: добавление CSS-классов для fallback UI (div, p, button)

## Capabilities

### New Capabilities

- `design-tokens`: система цветовых токенов с корректной темой light/dark, включающая семантические токены для текста на цветных фонах и фона полей ввода

### Modified Capabilities

<!-- No existing capabilities change their requirements -->

## Impact

- `src/styles/tokens.css` — добавлены 3 новых токена в `:root` и `@media (prefers-color-scheme: dark)`
- `src/components/SubscriptionDetail.css` — `MarkBtn` и `MarkBtn:disabled`
- `src/components/NewSubscriptionForm.css` — `SubmitBtn`, `Input`, `Select`
- `src/components/VisitTimeline.css` — `DeleteBtn`, `DateInput`
- `src/components/ErrorBoundary.tsx` — добавлены className, рефакторинг на функциональный компонент
- `src/components/ErrorBoundary.css` — новый файл стилей
