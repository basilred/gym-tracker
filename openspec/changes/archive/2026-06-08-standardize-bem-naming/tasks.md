## 1. Спецификация BEM

- [x] 1.1 Обновить `openspec/specs/bem-styling/spec.md` — добавить новые REQUIREMENTS (один блок на CSS-файл, нейминг кнопок `Btn`, модификаторы видимости, элементы обязаны иметь CSS-правила)
- [x] 1.2 Обновить `openspec/specs/bem-styling/spec.md` — модифицировать REQUIREMENT "CSS file per component" (убрать "that requires styling", добавить запрет на import в компонентах)

## 2. MarkVisitButton — своё BEM-пространство

- [x] 2.1 Создать `src/features/mark-visit/ui/MarkVisitButton.css` с блоком `MarkVisitButton` и элементами `Actions`, `MarkBtn`
- [x] 2.2 Переименовать `cn('SubscriptionDetail')` на `cn('MarkVisitButton')` в MarkVisitButton.tsx
- [x] 2.3 Удалить `.SubscriptionDetail-Actions` и `.SubscriptionDetail-MarkBtn` из SubscriptionDetail.css
- [x] 2.4 Добавить импорт `MarkVisitButton.css` в main.tsx

## 3. SwipeableVisit — отдельный компонент

- [x] 3.1 Создать `src/widgets/visit-timeline/ui/SwipeableVisit.css` — перенести все `.SwipeableVisit-*` правила из VisitTimeline.css
- [x] 3.2 Создать `src/widgets/visit-timeline/ui/SwipeableVisit.tsx` — вынести компонент `SwipeableVisit` из VisitTimeline.tsx в отдельный файл
- [x] 3.3 Обновить VisitTimeline.tsx — импортировать SwipeableVisit из нового файла, удалить внутреннее объявление
- [x] 3.4 Удалить `.SwipeableVisit-*` правила из VisitTimeline.css
- [x] 3.5 Добавить импорт `SwipeableVisit.css` в main.tsx

## 4. ErrorBoundary — централизованный импорт CSS

- [x] 4.1 Убрать `import './ErrorBoundary.css'` из ErrorBoundary.tsx
- [x] 4.2 Добавить импорт `ErrorBoundary.css` в main.tsx

## 5. TitleEditTrigger — CSS-правила

- [x] 5.1 Добавить `.SubscriptionCard-TitleEditTrigger { }` в SubscriptionCard.css
- [x] 5.2 Добавить `.SubscriptionDetail-TitleEditTrigger { }` в SubscriptionDetail.css

## 6. Стандарт нейминга кнопок

- [x] 6.1 Переименовать `MenuDelete` → `MenuDeleteBtn` в SubscriptionCard.tsx и SubscriptionCard.css
- [x] 6.2 Переименовать `HoverDelete` → `HoverDeleteBtn` в SwipeableVisit.tsx и VisitTimeline.css (потом в SwipeableVisit.css)

## 7. MenuDropdown — модификатор _expanded

- [x] 7.1 Заменить условный рендеринг `{menuOpen && <MenuDropdown/>}` на `<div>` с модификатором `_expanded` в SubscriptionCard.tsx
- [x] 7.2 Добавить CSS-правила для `.SubscriptionCard-MenuDropdown` (display: none) и `.SubscriptionCard-MenuDropdown_expanded` (display: block) в SubscriptionCard.css

## 8. Проверка

- [x] 8.1 Запустить тесты и убедиться, что всё проходит
- [x] 8.2 Запустить сборку и проверить отсутствие ошибок
