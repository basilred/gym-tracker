## Context

Приложение Gym Tracker — React 19 SPA на Vite 7, размещённое на GitHub Pages через ручной деплой (`gh-pages` npm-пакет). На данный момент:
- Версия в `package.json` статична (`0.0.0`)
- Деплой выполняется вручную с локальной машины: `npm run deploy`
- Нет CHANGELOG, нет GitHub Releases
- Нет CI/CD пайплайна (папка `.github` отсутствует)
- Коммиты не следуют conventional commits

Цель — автоматизировать весь release-цикл и деплой без изменения кодовой базы приложения.

## Goals / Non-Goals

**Goals:**
- Автоматическое определение следующей версии на основе conventional commits (fix → patch, feat → minor, feat! → major)
- Автоматическое обновление версии в `package.json` при релизе
- Автоматическая генерация CHANGELOG.md в формате Keep a Changelog
- Автоматическое создание git-тега `vX.Y.Z` и GitHub Release при мерже release PR
- Автоматический деплой на GitHub Pages при публикации релиза
- Минимальная конфигурация, максимальное использование дефолтов release-please

**Non-Goals:**
- Проверка conventional commits в CI (пока оставляем на совести разработчика)
- Автоматическая публикация в npm registry
- Мульти-окружение (staging/production)
- Интеграция со сторонними сервисами уведомлений

## Decisions

### 1. Release-Please GitHub Action (не CLI)
**Выбор**: `googleapis/release-please-action` v4
**Альтернативы**: `release-please` CLI, `semantic-release`, `changesets`
**Обоснование**: Release-Please — официальный GitHub Action от Google, нативная интеграция с GitHub, минимальная конфигурация, поддержка conventional commits из коробки. Semantic-release требует Node.js runtime и плагины, changesets — ручное описание изменений.

### 2. Раздельные workflow: release.yml + deploy.yml
**Выбор**: Два workflow — `release.yml` (release-please) и `deploy.yml` (GitHub Pages)
**Альтернатива**: Один workflow с условными шагами
**Обоснование**: Разделение ответственности. Release-please работает на push в main и создаёт/обновляет release PR. Деплой срабатывает на событие `release: published`. Так каждый workflow проще для понимания и отладки.

### 3. Триггер деплоя — событие `release: published`
**Выбор**: `on: release: types: [published]`
**Альтернатива**: `on: push: tags: 'v*'`, ручной `workflow_dispatch`
**Обоснование**: Release создаётся release-please автоматически при мерже PR, событие `published` гарантирует, что деплой происходит только для финальных релизов (не черновиков). Tag push менее надёжен — тег может быть создан вручную в обход release-please.

### 4. GitHub Pages Deploy Action
**Выбор**: `actions/deploy-pages` (нативный)
**Альтернатива**: `peaceiris/actions-gh-pages`, `JamesIves/github-pages-deploy-action`
**Обоснование**: Нативный action от GitHub, не требует внешних зависимостей, поддерживает `GITHUB_TOKEN`. Peaceiris и JamesIves решают ту же задачу, но добавляют лишнюю зависимость. Шаг сборки (`vite build`) + `upload-pages-artifact` + `deploy-pages` даёт полный контроль над процессом.

### 5. Релизный бранч — main
**Выбор**: `release-please` настроен на `main` ветку
**Альтернатива**: Отдельная `release` ветка
**Обоснование**: Проект небольшой, один контрибьютор, нет необходимости в сложной стратегии ветвления. Conventional commits в `main` → release PR → merge в `main` → релиз.

### 6. Gitmoji не поддерживаются
**Выбор**: Только стандартные conventional commit типы (`fix:`, `feat:`, `docs:`, `chore:`, `build:`)
**Обоснование**: Release-Please из коробки не понимает gitmoji. Стандартные типы достаточны.

### 7. Версионирование package.json через release-please
**Выбор**: release-please обновляет `package.json` автоматически при релизе
**Альтернатива**: Ручное обновление, отдельный скрипт `npm version`
**Обоснование**: release-please из коробки умеет обновлять `version` в `package.json` и коммитить это в main при мерже release PR. Это даёт единый источник версии — и в репозитории, и в npm-манифесте.

## Risks / Trade-offs

- **[R] Release PR может конфликтовать при частых пушах в main** → Release-Please сам обновляет PR при новых коммитах, конфликты маловероятны при одном контрибьюторе
- **[R] Версия в `package.json` будет перезаписываться release-please** → Это ожидаемое поведение; единственный источник версии — release-please manifest
- **[R] GitHub Pages может не обновиться мгновенно** → Кэширование CDN — норма, обычно обновление занимает 1-2 минуты
- **[R] Требуется ручная настройка GitHub Pages source** → Задокументировано в README, настраивается один раз
