## Why

Сейчас деплой на GitHub Pages происходит вручную через `npm run deploy` с локальной машины. Нет автоматического версионирования, CHANGELOG не ведётся, релизы не создаются. Release-Please автоматизирует весь release-цикл (версионирование, CHANGELOG, GitHub Releases), а GitHub Actions — деплой на GitHub Pages при каждом релизе.

## What Changes

- Добавление GitHub Actions workflow для Release-Please — автоматическое создание release PR при пуше в main с conventional commits, генерация CHANGELOG, создание GitHub Release с git-тегом `vX.Y.Z` и обновление версии в `package.json`
- Добавление GitHub Actions workflow для автоматического деплоя на GitHub Pages при создании нового релиза
- Настройка `release-please` конфигурации (`release-please-config.json`, `.release-please-manifest.json`)
- Обновление `package.json` — удаление `"deploy"` и `"predeploy"` скриптов (деплой автоматизирован)
- Обновление `README.md` — актуализация раздела «Деплой»

## Capabilities

### New Capabilities

- `release-please-pipeline`: Автоматическое версионирование (semver по conventional commits), обновление `package.json`, генерация CHANGELOG, создание git-тега `vX.Y.Z` и GitHub Release через release-please GitHub Action
- `github-pages-deploy`: Автоматический деплой собранного приложения на GitHub Pages при публикации нового релиза через GitHub Actions

### Modified Capabilities

<!-- Нет существующих спецификаций, чьи требования меняются -->

## Impact

- Новые файлы в `.github/workflows/` (2 workflow-файла)
- Новые конфигурационные файлы: `release-please-config.json`, `.release-please-manifest.json`
- Изменения в `package.json`: удаление `predeploy`/`deploy` скриптов
- Изменения в `README.md`: обновление раздела о деплое
- Требуется настройка GitHub Pages source на ветку `gh-pages` в настройках репозитория
- Требуется разрешение `contents: write` и `pull-requests: write` для Release-Please, `contents: write` и `pages: write` для деплоя
