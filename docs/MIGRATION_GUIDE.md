# Migration Guide: uba-eslint-config → uba-fast-lint-config

~95% rule parity, 10–100x faster. Three tools replacing two, each doing what it does best.

## What to Expect

### Speed

| Tool | Replaces | Speedup |
|------|----------|---------|
| **Biome** (formatter) | Prettier | ~40x faster |
| **oxlint** (bulk lint) | ESLint core + most plugins | ~50–100x faster |
| **ESLint** (slim) | Remaining gap plugins | Same speed, ~60% fewer rules |

### Rule Coverage

| Category | Before (uba-eslint-config) | After (uba-fast-lint-config) | Delta |
|----------|---------------------------|------------------------------|-------|
| ESLint core | ~133 | ~113 | -20 |
| @typescript-eslint | ~77 | ~73 | -4 |
| react + react-hooks | ~54 | ~36 | -18 |
| unicorn | ~83 | ~72 | -11 |
| import | ~24 | ~14 | -10 |
| promise | ~14 | ~14 | 0 |
| jsx-a11y | ~31 | ~26 | -5 (options lost) |
| vitest | ~18 | ~11 | -7 |
| perfectionist | 22 | 22 | 0 |
| Other gap plugins | ~47 | ~47 | 0 |
| **Total** | **~504** | **~429** | **~75** |

Bottom line: **~85% of rules preserved**. The 75 dropped rules are mostly low-risk, engine-checked, or waiting on oxlint type-aware support. See [KNOWN_GAPS.md](KNOWN_GAPS.md) for the full breakdown.

### Two-Tier Strategy

Instead of one slow `eslint .` pass, you get two speed tiers:

- **Fast tier** (oxlint + biome) — ~200 rules, runs in **milliseconds**
- **Full tier** (+ eslint) — ~280 rules, runs in **seconds** (ESLint is the bottleneck, but running ~60% fewer rules)

| Context | Recommended Tier | Why |
|---------|-----------------|-----|
| Editor on-save | Fast | Instant feedback |
| Pre-commit hook | Fast or Full | Speed vs CI parity |
| CI pipeline | Full | Catch everything |
| Watch mode / TDD | Fast | Don't break flow |
| Pre-push hook | Full | Last chance before CI |

### What Changes

- **3 tools** instead of 2 — Biome (format), oxlint (bulk lint), ESLint (gap plugins)
- **Removed flags**: `importCycleCheckMode`, `shouldEnableA11y`, `shouldEnableVitest`, `shouldEnableReact`, `shouldEnableNodeGlobals`, `shouldEnableBrowserGlobals` — these rules now run in oxlint unconditionally
- **New flag**: `shouldEnableTailwind` — controls `eslint-plugin-tailwindcss` (replaces `prettier-plugin-tailwindcss`)
- **Formatter gaps**: `prettier-plugin-packagejson` → use `sort-package-json`; `prettier-plugin-tailwindcss` → `eslint-plugin-tailwindcss`; embedded language formatting has no replacement

## Quick Start (Automated)

```bash
npx migrate-to-fast-lint
```

Or preview first:

```bash
npx migrate-to-fast-lint --dry-run
```

The script handles steps 1–6 below. For manual migration or to understand what it does, read on.

## Step 1: Install

```bash
pnpm remove uba-eslint-config prettier prettier-plugin-packagejson prettier-plugin-tailwindcss
pnpm add -D uba-fast-lint-config
```

## Step 2: Prettier → Biome

Delete Prettier config files:

```bash
rm -f .prettierrc .prettierrc.js .prettierrc.json .prettierrc.yaml .prettierrc.yml prettier.config.js prettier.config.mjs prettier.config.cjs
```

Copy the Biome config to your project root:

```bash
cp node_modules/uba-fast-lint-config/biome.json .
```

## Step 3: Copy oxlint config

```bash
cp node_modules/uba-fast-lint-config/.oxlintrc.json .
```

## Step 4: Update eslint.config.js

### Preset usage

```diff
- import { ubaEslintConfig } from "uba-eslint-config";
+ import { ubaFastLintConfig } from "uba-fast-lint-config";

- export default [...ubaEslintConfig];
+ export default [...ubaFastLintConfig];
```

### Custom config

```diff
- import { generateEslintConfig } from "uba-eslint-config";
+ import { generateLintConfig } from "uba-fast-lint-config";

- export default generateEslintConfig({
+ const { eslintConfig } = generateLintConfig({
    appType: "fullstack",
    shouldEnableTypescript: true,
-   importCycleCheckMode: "off",
  });
+
+ export default eslintConfig;
```

### Fine-grained control

```diff
- import { generateEslintConfigByFeatures } from "uba-eslint-config";
+ import { generateLintConfigByFeatures } from "uba-fast-lint-config";

- export default generateEslintConfigByFeatures({
+ const { eslintConfig } = generateLintConfigByFeatures({
-   shouldEnableA11y: true,
-   shouldEnableVitest: true,
-   shouldEnableReact: true,
-   shouldEnableNodeGlobals: true,
-   shouldEnableBrowserGlobals: true,
-   importCycleCheckMode: "off",
    shouldEnableTypescript: true,
    shouldEnableCypress: false,
    shouldEnableGraphql: false,
    shouldEnableStorybook: false,
    shouldEnableQuery: true,
    shouldEnableRouter: true,
+   shouldEnableTailwind: true,
  });
+
+ export default eslintConfig;
```

### API mapping

| uba-eslint-config | uba-fast-lint-config | Notes |
|---|---|---|
| `ubaEslintConfig` | `ubaFastLintConfig` | Spread into `eslint.config.js` |
| `generateEslintConfig()` | `generateLintConfig()` | Returns `{ eslintConfig, oxlintConfig, biomeFormatterConfig }` |
| `generateEslintConfigByFeatures()` | `generateLintConfigByFeatures()` | Same return shape |
| `ubaPrettierConfig` | `generateFormatterConfig().config` | |
| `generatePrettierConfig()` | `generateFormatterConfig()` | Returns `{ config, gaps }` |

### Options changes

| Removed | Reason |
|---|---|
| `importCycleCheckMode` | oxlint runs `import/no-cycle` natively |
| `shouldEnableA11y` | jsx-a11y rules in oxlint unconditionally |
| `shouldEnableVitest` | Vitest rules in oxlint unconditionally |
| `shouldEnableReact` | React rules in oxlint unconditionally |
| `shouldEnableNodeGlobals` | Configured in `.oxlintrc.json` env |
| `shouldEnableBrowserGlobals` | Configured in `.oxlintrc.json` env |

| Added | Purpose |
|---|---|
| `shouldEnableTailwind` | Controls `eslint-plugin-tailwindcss` (class sorting) |

Remove any lines importing `ubaPrettierConfig` or `generatePrettierConfig` — Prettier config is replaced by `biome.json`.

## Step 5: Update scripts & CI

### package.json

```diff
  "scripts": {
-   "lint": "eslint .",
-   "lint:fix": "eslint --fix .",
-   "format": "prettier --write .",
-   "format:check": "prettier --check .",
-   "fix": "prettier --write . && eslint --fix ."
+   "lint": "oxlint . && eslint .",
+   "lint:fix": "oxlint --fix . && eslint --fix .",
+   "format": "biome format --write .",
+   "format:check": "biome format .",
+   "fix": "biome format --write . && oxlint --fix . && eslint --fix ."
  }
```

### CI (GitHub Actions)

```yaml
# .github/workflows/ci.yml
- run: biome format .
- run: oxlint .
- run: eslint .
```

### Pre-commit hook (.husky/pre-commit)

```diff
- prettier --write .
+ biome format --write .
+ oxlint .
```

If your hook runs `eslint`, keep it — or switch to fast-tier-only for speed.

## Step 6: Editor setup

1. **Install** the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
2. **Remove/disable** the Prettier extension for JS/TS files
3. **Keep** the ESLint extension — it now only runs gap plugins (much faster)
4. oxlint runs as CLI only; no editor extension needed

## Known Limitations

- **27 type-aware TS rules** (e.g. `await-thenable`, `no-floating-promises`) — configured but won't run until oxlint stabilizes `--type-aware`
- **Prettier plugin gaps** — `prettier-plugin-packagejson` (use `sort-package-json`), `prettier-plugin-tailwindcss` (use `eslint-plugin-tailwindcss`), embedded language formatting (no replacement)
- **Some oxlint rules lack option parity** — e.g. jsx-a11y element/role mappings, `@typescript-eslint/no-unused-vars` `ignoreRestSiblings`

See [KNOWN_GAPS.md](KNOWN_GAPS.md) for the full list.
