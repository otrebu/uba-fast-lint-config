# [1.1.0](https://github.com/otrebu/uba-fast-lint-config/compare/v1.0.0...v1.1.0) (2026-02-11)


### Features

* **migration:** add script and rewrite guide with expectations ([2511b56](https://github.com/otrebu/uba-fast-lint-config/commit/2511b56e3247fa97b584622643fdfa0e3e90e769))

# 1.0.0 (2026-02-11)


* feat!: migrate uba-eslint-config to Biome + oxlint + slim ESLint ([2727d5a](https://github.com/otrebu/uba-fast-lint-config/commit/2727d5a303382606c5e26a4fd5bc2c185b0bf882))


### Bug Fixes

* **ci:** pass NPM_TOKEN to semantic-release ([2af9f60](https://github.com/otrebu/uba-fast-lint-config/commit/2af9f60817c233c672cbc9ac5132312547619ced))
* **ci:** use pnpm exec for biome/oxlint/eslint binaries ([ba97982](https://github.com/otrebu/uba-fast-lint-config/commit/ba97982aed28015527004c23e2fe4fe65a5b2a97))


### BREAKING CHANGES

* New package replaces uba-eslint-config. Consumers must
install Biome, oxlint, and update their config imports.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
