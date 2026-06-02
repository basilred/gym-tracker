## Context

Сейчас два workflow-файла:
- `release.yml` — release-please@v5 на push в master
- `deploy.yml` — сборка и деплой на GitHub Pages по событию `release: published`

`deploy.yml` не срабатывает, потому что release-please создаёт релиз через `GITHUB_TOKEN`, а GitHub Actions не триггерит новые workflow от событий `GITHUB_TOKEN`.

## Goals / Non-Goals

**Goals:**
- Объединить релиз и деплой в один workflow-файл (`release.yml`) без внешних зависимостей (PAT)
- Удалить `deploy.yml`

**Non-Goals:**
- Изменение формата тегов — остаётся `gym-tracker-vX.Y.Z` (стандартное поведение v5)
- Изменение процесса сборки (`npm run build`, `404.html`)
- Переход на другой release-инструмент

## Decisions

### Decision 1: Единый workflow с `release_created` output

**Альтернативы:**
- PAT вместо `GITHUB_TOKEN` — требует создания и ротации токена
- `workflow_run` trigger — всё ещё зависит от `GITHUB_TOKEN` chaining
- `workflow_dispatch` — ручной шаг, теряем автоматизацию

**Выбор:** `release-please-action@v5` экспортирует output `release_created` (`true/false`). После action-шага добавляем conditional-шаги:
```yaml
- uses: googleapis/release-please-action@v5
  id: release
  ...
- if: ${{ steps.release.outputs.release_created }}
  # checkout, build, deploy
```

## Risks / Trade-offs

- **Деплой может не сработать при первом запуске** → при ошибке в conditional-шагах деплой пропускается, но релиз уже создан. Придётся чинить workflow и делать повторный push
