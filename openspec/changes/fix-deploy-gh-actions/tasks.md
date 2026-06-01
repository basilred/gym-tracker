## 1. Fix release-please workflow

- [x] 1.1 Update `googleapis/release-please-action` from `@v4` to `@v5` in `.github/workflows/release.yml`

## 2. Repository configuration

- [x] 2.1 Enable «Allow GitHub Actions to create and approve pull requests» in repo Settings → Actions → General → Workflow permissions

## 3. Verification

- [ ] 3.1 Push a conventional commit (e.g. `fix: test release pipeline fix`) to `master` and verify release-please creates a release PR without Node.js 20 deprecation warning
