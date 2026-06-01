## ADDED Requirements

### Requirement: Release PR creation on push to main
При пуше в ветку `main` система SHALL запускать release-please workflow,
который анализирует conventional commits с последнего релиза и создаёт или
обновляет release PR с предлагаемой версией, CHANGELOG и обновлённым manifest.

#### Scenario: First conventional commit triggers release PR
- **WHEN** разработчик пушит коммит с сообщением `feat: add new exercise tracker` в main
- **THEN** release-please создаёт PR с предложением версии `1.0.0` (или следующей minor), включает запись в CHANGELOG и обновляет `.release-please-manifest.json`

#### Scenario: Fix commit updates existing release PR
- **WHEN** открыт release PR, и разработчик пушит коммит `fix: correct visit count` в main
- **THEN** release-please обновляет существующий release PR, добавляя `fix` запись в CHANGELOG и пересчитывая версию

#### Scenario: Non-conventional commit does not trigger release
- **WHEN** разработчик пушит коммит без conventional commit формата (например, `update stuff`) в main
- **THEN** release-please игнорирует коммит, не создаёт и не обновляет release PR

### Requirement: Git tag and GitHub Release creation on release PR merge
При мерже release PR в `main` система SHALL автоматически создать
git-тег формата `vX.Y.Z`, опубликовать GitHub Release и обновить версию в `package.json`.

#### Scenario: Release PR merge creates git tag and GitHub Release
- **WHEN** release PR с версией `1.2.0` мержится в main
- **THEN** release-please создаёт git-тег `v1.2.0` и публикует GitHub Release с CHANGELOG

#### Scenario: Package.json version is updated on release
- **WHEN** release PR с версией `1.2.0` мержится в main
- **THEN** версия в `package.json` обновляется до `1.2.0`

#### Scenario: Changelog contains all changes since last release
- **WHEN** release `v1.2.0` создаётся после `v1.1.0`
- **THEN** CHANGELOG включает все `fix:`, `feat:`, и breaking changes между `v1.1.0` и `v1.2.0`

#### Scenario: Tags follow semver with v-prefix
- **WHEN** создаётся любой релиз
- **THEN** git-тег имеет формат `v<major>.<minor>.<patch>` (например, `v1.2.0`, `v2.0.0`)

### Requirement: Release-please configuration
Система SHALL использовать конфигурационные файлы `release-please-config.json`
и `.release-please-manifest.json` для управления поведением release-please.

#### Scenario: Configuration defines release branches and changelog sections
- **WHEN** release-please workflow запускается
- **THEN** конфигурация определяет `main` как целевую ветвь, формат CHANGELOG как `default`, и стандартный маппинг типов коммитов на секции CHANGELOG

#### Scenario: Manifest tracks current version
- **WHEN** release-please создаёт или обновляет release PR
- **THEN** `.release-please-manifest.json` содержит актуальную версию проекта (например, `{".": "1.2.0"}`)

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
