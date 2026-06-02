## Why

Сейчас `environment: github-pages` объявлен на уровне job'а `release-please`, и каждый push в master создаёт запись в разделе Deployments репозитория — даже когда деплой-шаги пропущены по условию `release_created`. Нужно вынести деплой в отдельный job, чтобы environment создавался только при реальном деплое.

## What Changes

- Разделить единственный job в `release.yml` на два: `release-please` (только release-please-action) и `deploy` (сборка + деплой, запускается только при `release_created == true`)
- `environment: github-pages` перенести в job `deploy`

## Capabilities

### Modified Capabilities
- `release-please-pipeline`: workflow разделён на два job'а, environment объявляется только в деплойном job'е

## Impact

- `.github/workflows/release.yml` — рефакторинг структуры job'ов
