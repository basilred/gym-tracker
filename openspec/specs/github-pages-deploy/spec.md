## ADDED Requirements

### Requirement: Automatic deployment on release
При публикации GitHub Release система SHALL автоматически собирать
приложение и деплоить его на GitHub Pages.

#### Scenario: Release triggers build and deploy
- **WHEN** публикуется GitHub Release (например, `v1.2.0`)
- **THEN** workflow собирает приложение через `vite build`, загружает артефакты через `upload-pages-artifact` и деплоит через `deploy-pages`

#### Scenario: Build failure blocks deployment
- **WHEN** сборка `vite build` завершается с ошибкой
- **THEN** деплой не выполняется, workflow помечается как failed

#### Scenario: Successful deployment makes app available at GitHub Pages URL
- **WHEN** деплой завершается успешно
- **THEN** приложение доступно по URL `https://<owner>.github.io/gym-tracker` с новой версией

### Requirement: GitHub Pages permissions
Workflow деплоя SHALL иметь необходимые permissions для публикации на GitHub Pages.

#### Scenario: Workflow has pages write permission
- **WHEN** запускается deploy workflow
- **THEN** workflow имеет `contents: read` (для checkout) и `pages: write` / `id-token: write` (для деплоя и OIDC аутентификации)

#### Scenario: Deploy uses GitHub Actions environment
- **WHEN** деплой выполняется через `deploy-pages`
- **THEN** используется окружение `github-pages` с защитой от параллельных деплоев (`concurrency: pages`)

### Requirement: 404 fallback page for SPA routing
Собранное приложение SHALL включать `404.html` (копию `index.html`)
для поддержки клиентского роутинга на GitHub Pages.

#### Scenario: Build outputs 404.html alongside index.html
- **WHEN** выполняется сборка через `vite build`
- **THEN** в папке `dist/` присутствуют `index.html` и `404.html` с одинаковым содержимым
