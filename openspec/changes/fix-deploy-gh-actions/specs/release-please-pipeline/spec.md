## ADDED Requirements

### Requirement: Release-please action version
Система SHALL использовать `googleapis/release-please-action@v5` или новее,
работающую на Node.js 24, для совместимости с актуальной версией GitHub Actions раннера.

#### Scenario: Workflow uses v5 action
- **WHEN** запускается release workflow
- **THEN** используется `googleapis/release-please-action@v5`, и GitHub Actions раннер не выдаёт warning о депрекации Node.js 20

#### Scenario: Existing configuration remains compatible
- **WHEN** release-please-action v5 запускается с существующим `release-please-config.json`
- **THEN** конфигурация применяется без ошибок, release PR создаётся с корректной версией

### Requirement: Repository workflow permissions for pull request creation
Репозиторий SHALL иметь включённую настройку «Allow GitHub Actions to create and approve pull requests»
для автоматического создания release PR.

#### Scenario: Repo setting enabled allows PR creation
- **WHEN** в настройках репозитория включено «Allow GitHub Actions to create and approve pull requests»
- **THEN** release-please workflow успешно создаёт release PR при пуше в master

#### Scenario: Repo setting disabled blocks PR creation
- **WHEN** настройка «Allow GitHub Actions to create and approve pull requests» выключена
- **THEN** release-please workflow завершается с ошибкой «GitHub Actions is not permitted to create or approve pull requests»
