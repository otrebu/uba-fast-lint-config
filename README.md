# uba-fast-lint-config

A fast ESLint + Prettier replacement using **Biome** (formatter), **oxlint** (bulk linting), and a **slim ESLint** layer for gap plugins.

Drop-in replacement for [uba-eslint-config](https://github.com/otrebu/uba-eslint-config) with the same rule coverage and a compatible API.

## Architecture

| Layer | Tool | Role |
|-------|------|------|
| Formatting | **Biome** | Replaces Prettier — formats JS/TS/JSON/CSS/HTML |
| Bulk linting | **oxlint** | Handles ~200 rules from eslint core, typescript-eslint, react, jsx-a11y, unicorn, promise, import, vitest |
| Gap plugins | **ESLint** (slim) | Runs only plugins with no oxlint/Biome equivalent: perfectionist, canonical, check-file, function-name, cypress, graphql, storybook, tanstack-query, tanstack-router, tailwindcss, chai-friendly |
| Dedup layer | **eslint-plugin-oxlint** | Auto-disables ESLint rules that oxlint already covers |

## Features

- **TypeScript** support with type-aware linting (ESLint gap layer)
- **React** with hooks and accessibility rules (oxlint)
- **Testing**: Vitest (oxlint) and Cypress (ESLint gap)
- **Code Quality**: Unicorn, Promise, Import (oxlint) + Perfectionist, Canonical (ESLint gap)
- **Sorting & Formatting**: Perfectionist for code organization, Biome for formatting
- **GraphQL**, **TanStack Query**, **TanStack Router**, and optional **Storybook** support (ESLint gap)
- **Tailwind CSS** class ordering (ESLint gap — replaces prettier-plugin-tailwindcss)

## Installation

```bash
pnpm add -D uba-fast-lint-config
```

## Usage

### Basic Usage (ESLint only)

For projects that only need the ESLint gap config (oxlint + Biome configured separately):

```js
// eslint.config.js
import { ubaFastLintConfig } from "uba-fast-lint-config";

export default [...ubaFastLintConfig];
```

### Full Config Bundle

`generateLintConfig` returns configs for all three tools:

```js
import { generateLintConfig } from "uba-fast-lint-config";

const { oxlintConfig, eslintConfig, biomeFormatterConfig } = generateLintConfig({
  appType: "fullstack", // or "backendOnly"
  shouldEnableStorybook: false,
  shouldEnableTypescript: true,
});

// eslint.config.js — use eslintConfig
export default eslintConfig;

// oxlintConfig  — write to .oxlintrc.json or reference programmatically
// biomeFormatterConfig — write to biome.json or reference programmatically
```

### Fine-grained Control

```js
import { generateLintConfigByFeatures } from "uba-fast-lint-config";

const { oxlintConfig, eslintConfig, biomeFormatterConfig } = generateLintConfigByFeatures({
  appType: "fullstack",
  shouldEnableTypescript: true,
  shouldEnableCypress: false,
  shouldEnableGraphql: false,
  shouldEnableStorybook: false,
  shouldEnableQuery: true,
  shouldEnableRouter: true,
  shouldEnableTailwind: true,
});

export default eslintConfig;
```

### Formatter Configuration

Biome replaces Prettier. The `biome.json` in this package provides the default settings.

To generate a Biome config programmatically:

```js
import { generateFormatterConfig } from "uba-fast-lint-config";

const { config, gaps } = generateFormatterConfig({ appType: "fullstack" });
// config: Biome-compatible formatter settings
// gaps: array of Prettier plugins with no Biome equivalent + workarounds
```

### Recommended Scripts

```js
import { getScripts } from "uba-fast-lint-config";

console.log(getScripts());
// {
//   lint:          "oxlint . && eslint .",
//   "lint:fix":    "oxlint --fix . && eslint --fix .",
//   format:        "biome format --write .",
//   "format:check": "biome format .",
//   check:         "biome check .",
//   fix:           "biome format --write . && oxlint --fix . && eslint --fix .",
// }
```

### Running

```bash
# Format (Biome)
biome format --write .

# Lint (oxlint + ESLint)
oxlint .
eslint .

# Or use the package scripts:
pnpm run format      # biome format --write .
pnpm run lint        # oxlint . && eslint .
pnpm run fix         # biome format --write . && oxlint --fix . && eslint --fix .
```

## Exports

| Export | Description |
|--------|-------------|
| `ubaFastLintConfig` | Default ESLint gap config array (spread into `eslint.config.js`) |
| `generateLintConfig()` | Returns `{ oxlintConfig, eslintConfig, biomeFormatterConfig }` |
| `generateLintConfigByFeatures()` | Same bundle with fine-grained feature flags |
| `generateFormatterConfig()` | Returns `{ config, gaps }` for Biome formatter |
| `getScripts()` | Returns recommended `package.json` scripts |

## Migrating from uba-eslint-config

See [docs/MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) for step-by-step instructions.

## Known Gaps

~75 rules (~15%) from the original config have no oxlint/Biome equivalent. See [docs/KNOWN_GAPS.md](docs/KNOWN_GAPS.md) for the full list with severity ratings.

## Peer Dependencies

- `eslint-plugin-storybook@^10.2.8` (if enabling Storybook lint rules)
- `storybook@^10.2.8` (if enabling Storybook lint rules)

## License

MIT
