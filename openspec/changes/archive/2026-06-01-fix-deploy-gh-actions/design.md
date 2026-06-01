## Context

Сейчас в CI/CD используется связка `googleapis/release-please-action@v4` + `actions/deploy-pages@v4`.
10 дней назад GitHub объявил о депрекации Node.js 20 в раннерах (форсированный переход на Node.js 24 с 16.06.2026).
`release-please-action@v4` работает на Node.js 20 и уже выдаёт warning-и при каждом запуске.

Дополнительно, release-please не может создать PR: ошибка «GitHub Actions is not permitted to create or approve pull requests».
Это настройка уровня репозитория, которую нужно включить вручную.

## Goals / Non-Goals

**Goals:**
- Устранить warning о депрекации Node.js 20 в Actions
- Восстановить автоматическое создание release PR и публикацию релизов
- Задокументировать обязательную ручную настройку репозитория

**Non-Goals:**
- Изменение deploy workflow (`.github/workflows/deploy.yml`) — он работает корректно
- Изменение логики сборки или конфигурации Vite
- Миграция на другой release-инструмент

## Decisions

### Decision 1: Обновить release-please-action с v4 на v5

**Альтернативы:**
- `googleapis/release-please-action@v4` + `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` — временный костыль, не решает проблему
- Переход на `semantic-release` — требует полной перестройки пайплайна, неоправданно для текущего масштаба
- Ручное версионирование — теряем автоматизацию, увеличиваем риск ошибок

**Выбор:** `googleapis/release-please-action@v5`. Это нативный способ решить проблему Node.js 20. Release workflow менять не нужно — только версию action в единственной строке `release.yml`.

### Decision 2: Рабочий процесс (workflow) требует ручной настройки репозитория

**Проблема:** `release-please` не может создать PR, несмотря на `pull-requests: write` в workflow. Это происходит потому, что в настройках репозитория GitHub Actions по умолчанию запрещено создавать PR.

**Решение:** Включить чекбокс «Allow GitHub Actions to create and approve pull requests» в Settings → Actions → General → Workflow permissions. Добавить этот шаг в README или документацию пайплайна.

**Почему не автоматизировать:** Это настройка уровня репозитория, недоступная через workflow-файлы. Требуется ручное вмешательство один раз.

## Risks / Trade-offs

- **v5 breaking changes:** Между v4 и v5 release-please-action есть изменения в API конфигурации. Нужно проверить совместимость с текущим `release-please-config.json`. Судя по [документации v5](https://github.com/googleapis/release-please-action), конфигурационные файлы обратно совместимы — риск низкий.
- **После включения разрешения PR будут создаваться:** Если в master попадут коммиты без conventional format, release-please проигнорирует их, но может создать пустой PR. Это нормальное поведение, не баг.
