## Why

Проект использует Tailwind CSS, что противоречит принятой конвенции (CLAUDE.md: «Никогда не используй Tailwind»). Миграция на БЭМ-методологию приведёт стилизацию к единому стандарту, улучшит читаемость CSS и упростит поддержку.

## What Changes

- Удаление Tailwind CSS и связанных зависимостей (`tailwindcss`, `@tailwindcss/vite`, `autoprefixer`, `postcss`)
- Внедрение `@bem-react/classname` для программного конструирования БЭМ-имён классов
- Создание дизайн-токенов в `src/styles/tokens.css`
- Замена всех Tailwind-классов на БЭМ-классы с React-неймингом (`BlockName-ElemName_modName_modValue`)
- Вынос инлайн-стилей в CSS (статических — в классы, динамических — через CSS custom properties и ref.setProperty)
- Использование нативных CSS-псевдоклассов (`:disabled`, `:hover`, `:focus-visible`) вместо модификаторов для стандартных состояний
- Удаление мёртвого кода (`src/App.css`)

## Capabilities

### New Capabilities
- `bem-styling`: Система стилизации на основе БЭМ-методологии с дизайн-токенами, заменяющая Tailwind CSS

### Modified Capabilities
<!-- Нет существующих спецификаций для изменения -->

## Impact

- **Файлы**: 8 новых CSS-файлов, 8 изменённых JSX-файлов, удаление `tailwind.config.js`, `src/App.css`
- **Зависимости**: удаление 4 пакетов (`tailwindcss`, `@tailwindcss/vite`, `autoprefixer`, `postcss`), добавление 1 (`@bem-react/classname`)
- **Vite**: удаление `tailwindcss()` плагина из `vite.config.js`
- **Визуальное поведение**: без изменений (pixel-perfect миграция)
- **PWA**: без изменений
