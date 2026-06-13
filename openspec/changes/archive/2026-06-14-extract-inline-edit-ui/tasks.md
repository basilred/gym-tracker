## 1. Компонент InlineEdit

- [x] 1.1 Создать `shared/ui/InlineEdit/InlineEdit.tsx` — компонент с BEM `cn('InlineEdit')`, пропсами `{ hook: ReturnType<typeof useInlineEdit>, value, as?, className?, onTriggerKeyDown? }`
- [x] 1.2 Создать `shared/ui/InlineEdit/InlineEdit.css` — базовые стили для .InlineEdit-EditInput и .InlineEdit-EditTrigger (общие правила из Card и Detail)
- [x] 1.3 Создать `shared/ui/InlineEdit/index.ts` — re-export компонента
- [x] 1.4 Написать тесты `shared/ui/InlineEdit/InlineEdit.test.tsx` — view mode, edit mode, клик по триггеру, ввод текста, Enter/Escape

## 2. Интеграция в SubscriptionCard

- [x] 2.1 Заменить дублированную JSX-разметку на `<InlineEdit hook={...} value={sub.name} as="h3" className={card()} />`
- [x] 2.2 Удалить `.SubscriptionCard-EditInput` и `.SubscriptionCard-TitleEditTrigger` из CSS
- [x] 2.3 Удалить неиспользуемый импорт `useRef` (если остался только от inline-edit) — `useRef` всё ещё используется, не удаляем
- [x] 2.4 Добавить оверрайд в `SubscriptionCard.css` для `.SubscriptionCard .InlineEdit-EditInput { font-size: 1.125rem }`

## 3. Интеграция в SubscriptionDetail

- [x] 3.1 Заменить дублированную JSX-разметку на `<InlineEdit hook={...} value={sub.name} as="h2" className={detail()} />`
- [x] 3.2 Удалить `handleTitleKeyDown` — кнопка обрабатывает Enter/Space нативно
- [x] 3.3 Удалить `.SubscriptionDetail-EditInput` и `.SubscriptionDetail-TitleEditTrigger` из CSS
- [x] 3.4 Добавить оверрайд в `SubscriptionDetail.css` для `.SubscriptionDetail .InlineEdit-EditInput { font-size: 1.25rem; text-align: center }`

## 4. Проверка

- [x] 4.1 Убедиться, что `npm test` проходит (128 passed, 16 files)
- [x] 4.2 Убедиться, что `npm run lint` проходит (0 errors)
- [x] 4.3 Убедиться, что `npm run build` проходит (tsc + vite build ok)
- [x] 4.4 Запустить `vitest run --reporter=verbose` для проверки coverage inline-edit компонента (11 tests passed)
