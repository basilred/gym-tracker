## Why

В форме создания абонемента (`NewSubscriptionForm`) `<select>` визуально меньше текстовых `<input>` по высоте из-за разного рендеринга браузером внутреннего Shadow DOM. Это нарушает визуальную согласованность формы.

## What Changes

- Добавить `appearance: none` / `-webkit-appearance: none` в глобальный CSS reset для `input, select, button, textarea`
- Добавить кастомную SVG-стрелку для `<select>` в `NewSubscriptionForm`
- Выровнять `line-height` для всех form элементов через глобальные стили

## Capabilities

### New Capabilities
- `form-element-styling`: Единообразное отображение всех нативных form элементов (`input`, `select`, `textarea`, `button`) в рамках проекта, без браузерных различий

### Modified Capabilities

<!-- Нет изменений в существующих spec -- form elements не описаны ни в одной из существующих spec -->

## Impact

- `src/app/index.css` — глобальный reset для form элементов
- `src/features/create-subscription/ui/NewSubscriptionForm.css` — кастомная стрелка для `<select>`
