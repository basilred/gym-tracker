## REMOVED Requirements

### Requirement: Automatic deployment on release
**Reason**: Деплой-логика перенесена в `release-please-pipeline` workflow. Отдельный `deploy.yml` больше не нужен.
**Migration**: Весь деплой теперь происходит в `release.yml` при `release_created == true`.

### Requirement: GitHub Pages permissions
**Reason**: Permissions для GitHub Pages теперь часть `release-please-pipeline` workflow.
**Migration**: Permissions `pages: write` и `id-token: write` добавлены в `release.yml`.

### Requirement: 404 fallback page for SPA routing
**Reason**: Логика сборки (включая копирование `404.html`) не изменилась, остаётся в `npm run build`.
**Migration**: Не требуется — `npm run build` не меняется.
