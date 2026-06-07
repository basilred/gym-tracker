## Why

BEM-нейминг в проекте в целом следует спецификации, но на практике накопились отклонения: компоненты используют чужие BEM-пространства, два блока живут в одном CSS-файле, нарушен единый импорт CSS, нейминг кнопок непоследователен, а модификаторы почти не используются (1 из ~100 классов). Roadmap признаёт это задачей №1 по рефакторингу.

## What Changes

- MarkVisitButton получит собственное BEM-пространство и CSS-файл (сейчас паразитирует на `SubscriptionDetail`)
- SwipeableVisit будет вынесен в отдельный компонент с собственным CSS-файлом (сейчас два блока в VisitTimeline.css)
- ErrorBoundary перестанет импортировать CSS напрямую — импорт пойдёт через main.tsx
- Элементы `TitleEditTrigger` получат CSS-правила (сейчас есть в разметке, нет в CSS)
- Нейминг кнопок будет приведён к единому стандарту: суффикс `Btn` для всех кнопок
- `MenuDropdown` в SubscriptionCard будет использовать BEM-модификатор `_expanded` вместо условного рендеринга
- Спецификация BEM будет дополнена явными правилами по неймингу кнопок, одному блоку на файл, изоляции BEM-пространств

## Capabilities

### New Capabilities

- `mark-visit-button`: BEM-пространство и стили для кнопки отметки посещения
- `swipeable-visit`: BEM-пространство и стили для свайпабельного визита (выделение из VisitTimeline)

### Modified Capabilities

- `bem-styling`: требования к неймингу кнопок (суффикс `Btn`), правилу «один блок = один CSS-файл», изоляции BEM-пространств, централизованному импорту CSS

## Impact

- 3 CSS-файла будут изменены (SubscriptionDetail.css, VisitTimeline.css, ErrorBoundary.css)
- 2 новых CSS-файла (MarkVisitButton.css, SwipeableVisit.css)
- 4 TSX-файла будут модифицированы (MarkVisitButton.tsx, VisitTimeline.tsx, ErrorBoundary.tsx, SubscriptionCard.tsx)
- 1 файл импортов (main.tsx) — добавить/убрать импорты CSS
- Спецификация bem-styling будет дополнена
