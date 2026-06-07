## Context

В проекте 10 CSS-файлов, 9 TSX-компонентов используют `@bem-react/classname`. BEM-спецификация определена в `openspec/specs/bem-styling/spec.md`. На практике найдено 6 отклонений от единого стандарта, описанных в proposal.

## Goals / Non-Goals

**Goals:**
- Каждый компонент имеет собственное BEM-пространство (блок) и CSS-файл
- Все CSS-импорты централизованы в main.tsx
- Все кнопки используют суффикс `Btn` в имени BEM-элемента
- Состояния открытости/закрытости используют BEM-модификаторы вместо условного рендеринга
- Элементы, присутствующие в разметке, имеют CSS-правила (даже минимальные)
- Спецификация BEM обновлена с явными правилами

**Non-Goals:**
- Выделение shared-компонентов (inline-edit) — это отдельная задача из roadmap
- Устранение дублирования CSS между SubscriptionCard и SubscriptionDetail (EditInput, ProgressBar)
- Добавление новых модификаторов, кроме необходимых (_expanded)

## Decisions

### 1. MarkVisitButton — новый блок `MarkVisitButton`

**Решение**: Создать отдельный CSS-файл с блоком `MarkVisitButton`. Компонент получает собственный `cn('MarkVisitButton')`. Стили Actions и MarkBtn копируются из SubscriptionDetail.css в MarkVisitButton.css, после чего удаляются из SubscriptionDetail.css.

**Альтернативы**:
- Оставить как есть (нарушает изоляцию)
- Сделать shared-компонентом (избыточно для одной кнопки)

### 2. SwipeableVisit — отдельный компонент и блок

**Решение**: Выделить `SwipeableVisit` из VisitTimeline.tsx в отдельный файл `src/widgets/visit-timeline/ui/SwipeableVisit.tsx` со своим `SwipeableVisit.css`. VisitTimeline.css остаётся только с классом `VisitTimeline`.

**Альтернативы**:
- Перенести SwipeableVisit в shared (компонент специфичен для таймлайна)
- Оставить два блока в одном файле (нарушает принцип)

### 3. ErrorBoundary — импорт через main.tsx

**Решение**: Убрать `import './ErrorBoundary.css'` из ErrorBoundary.tsx. Добавить импорт ErrorBoundary.css в main.tsx.

### 4. TitleEditTrigger — CSS-правила

**Решение**: Добавить минимальные CSS-правила для `.SubscriptionCard-TitleEditTrigger` и `.SubscriptionDetail-TitleEditTrigger` (сброс стилей кнопки, cursor: pointer).

### 5. Стандарт нейминга кнопок

**Решение**: Все элементы, семантически являющиеся кнопками, используют суффикс `Btn`. Переименовать:
- `MenuToggle` → не меняем (семантически не кнопка, а область)
- `MenuDelete` → `MenuDeleteBtn`
- `HoverDelete` → `HoverDeleteBtn`
- `BackLink` → не меняем (семантически ссылка)

### 6. MenuDropdown — модификатор _expanded

**Решение**: Заменить условный рендеринг `{menuOpen && <MenuDropdown/>}` на всегда отображаемый div с модификатором `_expanded`. Управлять видимостью через CSS (`display: none` по умолчанию, `display: block` при `_expanded`).

## Risks / Trade-offs

- **MenuDropdown меняет DOM-структуру**: сейчас элемент отсутствует в DOM при закрытом меню, после изменения будет всегда. Это может повлиять на скриншотные тесты, если они есть. → Mitigation: unit-тесты не затрагиваются, визуально поведение идентично
- **Переименование BEM-классов**: может затронуть тесты, если они используют className-селекторы. → Mitigation: проверить тесты после изменений
