## Why

Десять дней назад GitHub объявил о депрекации Node.js 20 в Actions-раннерах (переход на Node.js 24 с 16 июня 2026). `googleapis/release-please-action@v4` работает на Node.js 20 и уже выдаёт warning-и. Кроме того, release-please не может создать PR из-за того, что в настройках репозитория не включено разрешение «Allow GitHub Actions to create and approve pull requests». Деплой-пайплайн сломан: релизы не создаются, приложение не деплоится.

## What Changes

- Обновить `googleapis/release-please-action` с `@v4` на `@v5` (замена Node.js 20 → 24)
- Убедиться, что workflow имеет `pull-requests: write` и `contents: write` permissions
- Задокументировать обязательную настройку репозитория: «Allow GitHub Actions to create and approve pull requests»

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `release-please-pipeline`: обновление версии release-please-action с v4 на v5, уточнение требований к permissions и настройкам репозитория

## Impact

- `.github/workflows/release.yml` — обновление версии action
- Настройки репозитория GitHub — требуется ручное включение «Allow GitHub Actions to create and approve pull requests»
- `github-pages-deploy` — без изменений, деплой-workflow не затрагивается
