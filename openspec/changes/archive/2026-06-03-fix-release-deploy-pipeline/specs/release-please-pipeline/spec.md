## MODIFIED Requirements

### Requirement: Release workflow permissions
Workflow `release.yml` SHALL иметь permissions, достаточные как для создания release PR и GitHub Release,
так и для деплоя на GitHub Pages.

#### Scenario: Workflow has combined permissions
- **WHEN** запускается release workflow
- **THEN** workflow имеет `contents: write` (release-please), `pull-requests: write` (release PR),
  `pages: write` (загрузка артефакта) и `id-token: write` (OIDC для деплоя)

## ADDED Requirements

### Requirement: Automatic deployment after release creation
При создании GitHub Release (output `release_created == true`) workflow SHALL автоматически
собрать приложение и задеплоить его на GitHub Pages в том же job'е.

#### Scenario: Release triggers build and deploy in same workflow
- **WHEN** release-please публикует GitHub Release (output `release_created == true`)
- **THEN** workflow собирает приложение через `vite build`, загружает артефакты через `upload-pages-artifact` и деплоит через `deploy-pages`

#### Scenario: Build failure blocks deployment
- **WHEN** сборка `vite build` завершается с ошибкой на шаге деплоя
- **THEN** деплой не выполняется, workflow помечается как failed

#### Scenario: Non-release push does not trigger deploy
- **WHEN** push в master не приводит к созданию релиза (output `release_created == false`)
- **THEN** шаги деплоя пропускаются, workflow завершается успешно без деплоя
