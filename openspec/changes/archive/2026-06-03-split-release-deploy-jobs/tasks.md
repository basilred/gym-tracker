## 1. Refactor workflow

- [x] 1.1 Split `release.yml` into two jobs: `release-please` (outputs release_created) + `deploy` (conditional, with environment)

## 2. Verification

- [x] 2.1 Push to master, verify: regular push creates no deployment entry; release PR merge creates deployment entry
