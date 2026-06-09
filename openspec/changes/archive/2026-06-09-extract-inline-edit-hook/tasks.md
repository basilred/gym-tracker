## 1. Хук useInlineEdit

- [x] 1.1 Создать `shared/hooks/useInlineEdit.ts` с сигнатурой `(originalValue, onSave)` → `{ editing, editValue, textareaRef, startEditing, commitEdit, cancelEdit, handleKeyDown, autoResize }`
- [x] 1.2 Написать тесты для хука `shared/hooks/useInlineEdit.test.ts`

## 2. Интеграция в SubscriptionCard

- [x] 2.1 Заменить дублированные состояния/эффекты/колбэки на вызов `useInlineEdit(sub.name, (name) => updateSubscription(sub.id, { name }))`
- [x] 2.2 Адаптировать `startEditing` для передачи `e.preventDefault/stopPropagation` (обёртка вокруг `startEditing` из хука)
- [x] 2.3 Удалить `useRef<HTMLTextAreaElement>`, `useState` для editing/editValue, `autoResize`, `commitEdit`, `cancelEdit`, `handleKeyDown`, `useEffect(focus)`

## 3. Интеграция в SubscriptionDetail

- [x] 3.1 Заменить дублированные состояния/эффекты/колбэки на вызов `useInlineEdit(sub.name, (name) => updateSubscription(sub.id, { name }))`
- [x] 3.2 Удалить `useRef<HTMLTextAreaElement>`, `useState` для editing/editValue, `autoResize`, `commitEdit`, `cancelEdit`, `handleKeyDown`, `useEffect(focus)`
- [x] 3.3 Сохранить `handleTitleKeyDown` — он не дублируется, это a11y-специфика SubscriptionDetail

## 4. Проверка

- [x] 4.1 Убедиться, что `npm test` проходит
- [x] 4.2 Убедиться, что `npm run lint` проходит
- [x] 4.3 Убедиться, что `npm run build` проходит
- [x] 4.4 Удалить spec-заглушку (`specs/refactoring/`) если она больше не нужна
