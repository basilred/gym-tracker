## Why

Аудит кодовой базы выявил 38 проблем — от критических багов и нулевого тестового покрытия до нарушений accessibility и неполной PWA-конфигурации. Проект работает, но фундаментально хрупок: нет защиты от регрессий, нет типизации, экранные читалки не работают, а клавиатурная навигация «вслепую». Закрываем всё одним чейнджем, пока кодовая база ещё компактна.

## What Changes

- **Тестовая инфраструктура**: Vitest + React Testing Library, покрытие всех хуков и компонентов
- **Миграция на TypeScript**: все `.jsx`/`.js` → `.tsx`/`.ts`, strict mode
- **Accessibility**: aria-лейблы, `:focus-visible`, клавиатурное управление свайпом, валидный HTML
- **Error Boundary**: защита от белого экрана при исключениях
- **Валидация форм**: проверка ввода при создании абонемента
- **PWA-доработки**: полный манифест, стратегии кеширования, промпт обновлений
- **Баги**: UTC-дата, деление на ноль, `<button>` внутри `<Link>`
- **BEM-стили**: тёмная тема, адаптивные брейкпойнты
- **Зависимости**: удаление `sharp`, обновление устаревших пакетов

## Capabilities

### New Capabilities
- `test-infrastructure`: настройка Vitest, тесты для хуков и компонентов
- `typescript-migration`: конвертация кодовой базы на TypeScript со strict mode
- `accessibility`: соответствие WCAG 2.1 AA — клавиатура, скринридеры, семантика
- `error-boundary`: React Error Boundary с fallback UI

### Modified Capabilities
- `bem-styling`: добавление требований к `:focus-visible`, тёмной теме (`prefers-color-scheme`) и адаптивным брейкпойнтам
- `use-subscriptions`: добавление валидации структуры данных и версионирования схемы localStorage

## Impact

- Все файлы в `src/` (JSX → TSX, JS → TS)
- `package.json` (новые devDependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom; удаление sharp)
- `vite.config.js` (PWA-конфигурация, test-конфигурация)
- `eslint.config.js` (добавление typescript-eslint, jsx-a11y)
- `tsconfig.json` (новый файл)
- `src/components/` — все компоненты, добавляются тесты, aria-атрибуты, типы
- `src/hooks/` — типизация, тесты, валидация данных
- `src/styles/` — тёмная тема, брейкпойнты
- `public/manifest.json` — может быть удалён (дубликат с PWA-плагином)
