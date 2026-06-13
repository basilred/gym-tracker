## Context

Сейчас после выделения хука `useInlineEdit` осталось дублирование JSX-разметки и CSS между `SubscriptionCard` и `SubscriptionDetail`:

```
SubscriptionCard.tsx                 SubscriptionDetail.tsx
─────────────────────                ─────────────────────
{editing ? (                         {editing ? (
  <textarea                            <textarea    ← идентично
    ref, onChange, onBlur,               ref, onChange, onBlur,
    onKeyDown, rows={1}                  onKeyDown, rows={1}
  />                                   />
) : (                                 ) : (
  <h3>             vs        <h2>     ← разный тег
    <button>        vs        <span    ← разный элемент
      {sub.name}                role="button"
    </button>                 </span>
  </h3>                           </h2>
)}                                 )}
```

CSS: общие правила (`border: none`, `background: transparent`, `resize: none`, `font-family: inherit`, `cursor: pointer` и т.д.) дублируются. Различия — только `font-size` и `text-align`.

## Goals / Non-Goals

**Goals:**
- Создать `shared/ui/InlineEdit/` — переиспользуемый UI-компонент с собственным BEM-блоком и CSS
- Убрать дублирование JSX-разметки между Card и Detail
- Убрать дублирование CSS-правил (оставить только различия)
- Сохранить 1:1 поведение и внешний вид
- Написать тесты компонента

**Non-Goals:**
- Не менять API хука `useInlineEdit`
- Не менять тесты Card и Detail (проверяют поведение, не детали)
- Не добавлять новые возможности (чистый рефакторинг)
- Не выносить ничего за пределы inline-edit

## Decisions

### Decision 1: Компонент владеет BEM-блоком + mix-класс для оверрайдов

**Выбран:** Вариант 3 из обсуждения

Компонент использует `cn('InlineEdit')` и рендерит свои элементы с классами `.InlineEdit-EditInput`, `.InlineEdit-EditTrigger`, `.InlineEdit-Title`. Карточка и деталка передают `className={card()}` / `className={detail()}` для BEM mix, что позволяет оверрайдить стили через каскад.

```tsx
// В компоненте
const input = cn('InlineEdit', 'EditInput')
// → InlineEdit-EditInput

// В карточке
<InlineEdit className={card()} ... />
// В CSS карточки: .SubscriptionCard .InlineEdit-EditInput { font-size: 1.125rem }
```

**Rationale:**
- Компонент предоставляет базовую стилизацию (общие правила)
- Widget-specific отличия живут в CSS своего виджета через BEM mix
- Не нужно угадывать все будущие варианты — `className` покрывает любые отклонения
- Соответствует ФСД-слою shared (готовый переиспользуемый компонент)

### Decision 2: Унификация триггера на `<button>`

Оба потребителя переходят на `<button>`:

- SubscriptionCard уже использует `<button>` — без изменений
- SubscriptionDetail переходит с `<span role="button" tabIndex={0}>` на `<button>` — это улучшение a11y (нативная фокусировка, клавиатурная навигация)

**Rationale:** Различие в типе триггера не было осознанным — в деталке использовали `<span>` без причины. `<button>` внутри `<h2>` валиден по HTML5. Убираем `triggerAs` из пропсов, упрощая API.

### Decision 3: Один пропс `as` для тега заголовка

Различие h3/h2 — единственное осознанное. Добавляем пропс `as`:

```tsx
as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
// По умолчанию h2
```

### Decision 4: Компонент не принимает стейт по частям, а принимает объект из хука

```tsx
interface InlineEditProps {
  hook: ReturnType<typeof useInlineEdit>
  value: string
  as?: HeadingTag
  className?: string
  onTriggerKeyDown?: (e: React.KeyboardEvent) => void
}
```

**Rationale:** 9 пропсов из хука (editing, editValue, setEditValue, textareaRef, startEditing, commitEdit, handleKeyDown, autoResize) всегда передаются вместе. Оборачивать их в объект `hook` улучшает читаемость и упрощает миграцию.

Альтернатива — принимать 9 отдельных пропсов. Отвергнута: загромождает JSX, не даёт преимуществ.

## Risks / Trade-offs

- **[Low] Карточка передаёт `e.preventDefault()` в `startEditing`**: нужно будет передать отдельный колбэк `onTriggerClick` или добавить `e.preventDefault()` внутрь компонента. **Mitigation:** компонент сам вызывает `e.preventDefault()` на клике по триггеру, это безопасно (не влияет на поведение).
- **[Low] Потеря `handleTitleKeyDown` из SubscriptionDetail**: сейчас деталка проверяет Enter/Space отдельно на триггере. С переходом на `<button>` это не нужно — кнопка обрабатывает Enter/Space нативно. **Mitigation:** проверяем и удаляем `handleTitleKeyDown` при интеграции.
- **[Note] Компонент пока не используется вне Card и Detail**: единственный потребитель inline-edit — название абонемента. Если появится третий вариант, API может расшириться. **Mitigation:** текущий API покрывает все известные сценарии.
