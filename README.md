# uba-fast-lint-config

A fast ESLint + Prettier replacement using **Biome** (formatter), **oxlint** (bulk linting), and a **slim ESLint** layer for gap plugins.

Drop-in replacement for [uba-eslint-config](https://github.com/otrebu/uba-eslint-config) with the same rule coverage and a compatible API.

## How It Works

Three tools, each doing what it does best:

```
biome format .     →  formatting only (replaces Prettier)        ~40x faster
oxlint .           →  ~200 lint rules in Rust                    ~50-100x faster
eslint .           →  ~80 gap rules (plugins oxlint can't run)   same speed, way fewer rules
```

`eslint-plugin-oxlint` sits between oxlint and ESLint — it auto-disables any ESLint rule that oxlint already covers, so nothing runs twice.

| Layer | Tool | What it does |
|-------|------|--------------|
| Formatting | **Biome** | Replaces Prettier — formats JS/TS/JSON/CSS/HTML |
| Bulk linting | **oxlint** | ~200 rules from eslint core, typescript-eslint, react, jsx-a11y, unicorn, promise, import, vitest |
| Gap plugins | **ESLint** (slim) | Plugins with no oxlint equivalent: perfectionist, canonical, check-file, function-name, cypress, graphql, storybook, tanstack-query, tanstack-router, tailwindcss, chai-friendly, + gap rules from react/unicorn/import/typescript/vitest/promise that oxlint hasn't implemented |
| Dedup | **eslint-plugin-oxlint** | Auto-disables ESLint rules oxlint already covers (must be last in config) |

## Installation

```bash
pnpm add -D uba-fast-lint-config
```

This installs Biome, oxlint, ESLint, and all gap plugins as transitive dependencies.

## Setup

### 1. Copy the config files

Your project needs three config files. Copy them from this package or generate them:

**biome.json** — copy from `node_modules/uba-fast-lint-config/biome.json`, or generate:

```js
import { generateFormatterConfig } from "uba-fast-lint-config";
const { config, gaps } = generateFormatterConfig({ appType: "fullstack" });
// Write `config` to biome.json
// `gaps` lists Prettier plugins with no Biome equivalent + workarounds
```

**.oxlintrc.json** — copy from `node_modules/uba-fast-lint-config/.oxlintrc.json`:

```bash
cp node_modules/uba-fast-lint-config/.oxlintrc.json .
```

**eslint.config.js** — import the gap config:

```js
// eslint.config.js
import { ubaFastLintConfig } from "uba-fast-lint-config";

export default [...ubaFastLintConfig];
```

### 2. Add scripts to package.json

```jsonc
{
  "scripts": {
    // --- Two-tier lint commands ---
    "lint:fast": "oxlint .",                          // ~200 rules, instant
    "lint:full": "oxlint . && eslint .",              // ~280 rules, slightly slower
    "lint:fast:fix": "oxlint --fix .",
    "lint:full:fix": "oxlint --fix . && eslint --fix .",

    // --- Formatting ---
    "format": "biome format --write .",
    "format:check": "biome format .",

    // --- All-in-one ---
    "fix": "biome format --write . && oxlint --fix . && eslint --fix .",
    "check": "biome format . && oxlint . && eslint ."
  }
}
```

### 3. (Optional) Pre-commit hook

```bash
# .husky/pre-commit
npx sort-package-json          # replaces prettier-plugin-packagejson
biome format --write .
oxlint .
eslint .
git add -u
```

## Two Speed Tiers

The key insight: you don't always need every rule.

### Fast tier: `oxlint` + `biome` only

```bash
biome format --write . && oxlint .
```

- **~200 lint rules** from eslint core, typescript, react, jsx-a11y, unicorn, promise, import, vitest
- Catches the vast majority of bugs, security issues, and style violations
- Runs in **milliseconds** on most codebases
- Use this for: **pre-commit hooks, watch mode, quick iteration, editor on-save**

### Full tier: `oxlint` + `eslint` + `biome`

```bash
biome format --write . && oxlint . && eslint .
```

- **~280 rules** — everything from the fast tier, plus ~80 gap rules from ESLint plugins
- Adds: perfectionist sorting, import resolution/cycle detection, canonical import aliases, filename conventions, function naming, React gap rules (boolean-prop-naming, function-component-definition, etc.), unicorn gap rules (prevent-abbreviations, etc.), vitest gap rules, promise/no-return-in-finally, GraphQL, Cypress, Storybook, TanStack, Tailwind class ordering
- Runs in **seconds** (ESLint is the bottleneck, but it's running ~60% fewer rules than a full ESLint setup)
- Use this for: **CI, pre-push, PR checks**

### Choosing which tier to use where

| Context | Recommended | Why |
|---------|-------------|-----|
| Editor on-save | Fast | Instant feedback, no lag |
| Pre-commit hook | Fast or Full | Fast for speed; Full if you want CI parity locally |
| CI pipeline | Full | Catch everything before merge |
| Watch mode / TDD | Fast | Don't break flow |
| Pre-push hook | Full | Last chance before CI |

## Usage Patterns

### Fullstack (default)

```js
// eslint.config.js
import { ubaFastLintConfig } from "uba-fast-lint-config";

export default [...ubaFastLintConfig];
```

Enables: React, TypeScript, Cypress, TanStack Query/Router, Tailwind, Perfectionist, Canonical, etc.

### Backend only

```js
import { generateLintConfig } from "uba-fast-lint-config";

const { eslintConfig } = generateLintConfig({ appType: "backendOnly" });

export default eslintConfig;
```

Disables: React, Cypress, GraphQL, TanStack, Tailwind, Storybook.

### Fine-grained control

```js
import { generateLintConfigByFeatures } from "uba-fast-lint-config";

const { eslintConfig } = generateLintConfigByFeatures({
  appType: "fullstack",
  shouldEnableTypescript: true,
  shouldEnableReact: true,
  shouldEnableCypress: false,
  shouldEnableGraphql: true,
  shouldEnableStorybook: false,
  shouldEnableQuery: true,
  shouldEnableRouter: false,
  shouldEnableTailwind: true,
});

export default eslintConfig;
```

### Storybook (opt-in)

Storybook requires optional peer deps:

```bash
pnpm add -D eslint-plugin-storybook storybook
```

```js
const { eslintConfig } = generateLintConfig({
  appType: "fullstack",
  shouldEnableStorybook: true,
});
```

## CI Pipeline Example

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile

      # Fast tier — fails fast on obvious issues
      - run: biome format .
      - run: oxlint .

      # Full tier — catches everything
      - run: eslint .
        env:
          CI: "true"  # enables import/no-cycle (expensive, CI-only)
```

## Exports

| Export | Description |
|--------|-------------|
| `ubaFastLintConfig` | Default fullstack ESLint gap config array (spread into `eslint.config.js`) |
| `generateLintConfig({ appType, shouldEnableStorybook, shouldEnableTypescript })` | Returns `{ eslintConfig, oxlintConfig, biomeFormatterConfig }` |
| `generateLintConfigByFeatures({ ... })` | Same bundle with per-feature flags |
| `generateFormatterConfig({ appType })` | Returns `{ config, gaps }` for Biome formatter |
| `getScripts()` | Returns recommended `package.json` scripts |

## Migrating from uba-eslint-config

See [docs/MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) for step-by-step instructions.

## Known Gaps

See [docs/KNOWN_GAPS.md](docs/KNOWN_GAPS.md) for the full list. Summary:

- **27 type-aware TS rules** (await-thenable, no-floating-promises, etc.) — waiting on oxlint to stabilize `--type-aware` flag
- **~8 low-risk rules** — engine-checked, empty config, or formatter-handled
- **Prettier plugin gaps** — `prettier-plugin-packagejson` (workaround: sort-package-json), `prettier-plugin-tailwindcss` (workaround: eslint-plugin-tailwindcss), embedded language formatting (no workaround)

## License

MIT
