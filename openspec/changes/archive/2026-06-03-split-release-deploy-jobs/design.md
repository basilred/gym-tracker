## Context

Текущий `release.yml` содержит один job с `environment: github-pages`. GitHub Actions создаёт deployment entry для каждого запуска job'а с environment, даже если деплой-шаги пропущены. Это засоряет `/deployments` страницу репозитория.

## Goals / Non-Goals

**Goals:**
- Deployment entries только для реальных деплоев
- Сохранить conditional deploy логику через `release_created`

**Non-Goals:**
- Изменение логики деплоя или сборки

## Decisions

### Decision: Два job'а с job output

```yaml
jobs:
  release-please:
    outputs:
      release_created: ${{ steps.release.outputs.release_created }}
    steps:
      - release-please-action

  deploy:
    needs: release-please
    if: ${{ needs.release-please.outputs.release_created == 'true' }}
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - checkout, setup-node, npm ci, build, upload, deploy
```

`release-please` job не имеет `environment` — не создаёт deployment entries.
`deploy` job имеет `environment` и `if:` — запускается и создаёт entry только при реальном деплое.

## Risks / Trade-offs

- **Job output формат**: `release_created` — строка `'true'`/`'false'`, сравнение `== 'true'` надёжно
