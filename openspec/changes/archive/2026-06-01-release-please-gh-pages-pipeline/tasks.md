## 1. Release-Please Configuration

- [x] 1.1 Create `release-please-config.json` with main branch target, default changelog format, `package.json` as versioned file, and standard conventional commit type mapping
- [x] 1.2 Create `.release-please-manifest.json` with current version `0.0.0`

## 2. GitHub Actions Workflows

- [x] 2.1 Create `.github/workflows/release.yml` — Release-Please workflow triggered on push to main, with `contents: write` and `pull-requests: write` permissions
- [x] 2.2 Create `.github/workflows/deploy.yml` — Deploy workflow triggered on `release: published`, with checkout → setup-node → build → upload-pages-artifact → deploy-pages steps

## 3. Project Cleanup

- [x] 3.1 Remove `predeploy` and `deploy` scripts from `package.json` (automated by CI)
- [x] 3.2 Remove `gh-pages` from `devDependencies` in `package.json` (no longer needed)

## 4. Documentation

- [x] 4.1 Update `README.md` — replace manual deploy section with automated CI/CD description and instructions for enabling GitHub Pages source in repo settings
