## Why

Деплой на GitHub Pages не срабатывает: release-please создаёт релиз через `GITHUB_TOKEN`, а GitHub Actions не триггерит другие workflow от событий, созданных `GITHUB_TOKEN` (защита от рекурсии). Нужно объединить релиз и деплой в один workflow.

## What Changes

- Объединить `release.yml` и `deploy.yml` в единый workflow, использующий `release_created` output от release-please для условного запуска деплоя
- Удалить `deploy.yml`

## Capabilities

### Modified Capabilities
- `release-please-pipeline`: workflow теперь выполняет и релиз, и деплой в одном job'е через conditional-шаги
- `github-pages-deploy`: deploy-логика переносится в `release-please-pipeline`, отдельный workflow удаляется

## Impact

- `.github/workflows/release.yml` — дополнен: шаги сборки и деплоя после release-please
- `.github/workflows/deploy.yml` — удалён
