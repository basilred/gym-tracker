## Context

В проекте form elements (`input`, `select`, `textarea`, `button`) стилизуются частично через глобальный `index.css` (`font-family: inherit`, `font-size: 100%`, `line-height: inherit`) и частично через компонентные BEM-классы.

Проблема: `<select>` — replaced element с внутренним Shadow DOM. Браузер игнорирует наследуемый `line-height` и использует свой UA `line-height` (~1.2). При одинаковом `padding: 0.5rem` с `<input>` (который использует `line-height: 1.5`), select визуально ниже.

```
Текущее состояние (Chrome, font-size: 16px):

<input>                        <select>
┌──────────────────────┐      ┌──────────────────┐
│  padding: 8px        │      │  padding: 8px    │
│  line-height: 24px   │      │  line-height: 19px│ ← UA default
│  Итого: 42px         │      │  Итого: 37px     │
└──────────────────────┘      └──────────────────┘
```

## Goals / Non-Goals

**Goals:**
- `<select>` и `<input>` в одной форме имеют одинаковую визуальную высоту
- Единообразный `line-height` для всех form элементов
- Сохранение кастомного внешнего вида (цвета, радиусы, отступы)

**Non-Goals:**
- Не меняем существующие цвета, шрифты, border-radius, тени
- Не создаём кастомный `<select>` на div/JS
- Не затрагиваем inline-редакторы (`SubscriptionCard-EditInput`, `SubscriptionDetail-EditInput`) — они используют `border: none; padding: 0;` и не имеют проблемы

## Decisions

### Decision 1: `appearance: none` в глобальном reset

Добавить в `src/app/index.css` для `input, select, button, textarea`:
```css
appearance: none;
-webkit-appearance: none;
```

**Почему, а не explicit `height`:**
- `height: 2.5rem` фиксирует высоту, но не гарантирует вертикальное выравнивание текста внутри select
- При изменении font-size высоту придётся пересчитывать
- `appearance: none` решает проблему на уровне браузерного рендеринга — элемент перестаёт быть "чёрным ящиком" и начинает подчиняться CSS

**Почему глобально, а не только для NewSubscriptionForm:**
- Принцип единого источника истины — все form элементы должны вести себя одинаково
- Если в будущем появится другой `<select>` или `<textarea>`, проблема не возникнет

### Decision 2: Кастомная стрелка для `<select>` через SVG `background-image`

```css
.NewSubscriptionForm-Select {
  appearance: none;
  background-image: url("data:image/svg+xml,...");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25em;
  padding-right: 2rem;
}
```

**Почему inline SVG, а не отдельный файл или псевдоэлемент:**
- Inline data URI не требует дополнительных HTTP-запросов
- Псевдоэлементы не работают на replaced elements (`<select>`)

## Risks / Trade-offs

- [Loss of native arrow animation] → Кастомная SVG-стрелка не имеет анимации при открытии, но это несущественно для UX формы
- [Firefox appearance quirk] → Firefox может требовать `-moz-appearance: none` отдельно. Добавить все префиксы.
- [Select padding-right] → Нужно убедиться, что `padding-right` достаточно большой, чтобы текст не наезжал на стрелку. Проверить с самой длинной опцией ("16 занятий").

## Open Questions

- Нужно ли добавить `appearance: none` для `<button>`? В `NewSubscriptionForm` кнопка уже кастомная (`border: none`), но для консистентности стоит добавить.
