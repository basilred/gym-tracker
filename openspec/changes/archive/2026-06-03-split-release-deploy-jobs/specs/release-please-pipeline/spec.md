## MODIFIED Requirements

### Requirement: Automatic deployment after release creation
При создании GitHub Release (output `release_created == true`) workflow SHALL автоматически
собрать приложение и задеплоить его на GitHub Pages в **отдельном job'е** `deploy`,
который запускается только при `release_created == true`.

#### Scenario: Release triggers deploy job
- **WHEN** release-please публикует GitHub Release (output `release_created == true`)
- **THEN** job `deploy` запускается, собирает приложение и деплоит на GitHub Pages

#### Scenario: Non-release push skips deploy job
- **WHEN** push в master не приводит к созданию релиза (output `release_created == false`)
- **THEN** job `deploy` пропускается, никаких deployment entries не создаётся

#### Scenario: Build failure blocks deployment
- **WHEN** сборка `vite build` завершается с ошибкой в job'е `deploy`
- **THEN** деплой не выполняется, job помечается как failed

### Requirement: Release workflow permissions
Workflow `release.yml` SHALL иметь два job'а: `release-please` (без `environment`)
и `deploy` (с `environment: github-pages`), разделяя permissions на уровне workflow.

#### Scenario: Release-please job has no environment
- **WHEN** запускается job `release-please`
- **THEN** job не имеет `environment`, не создаёт deployment entry на странице Deployments

#### Scenario: Deploy job uses github-pages environment
- **WHEN** запускается job `deploy`
- **THEN** job использует `environment: github-pages` и создаёт deployment entry
