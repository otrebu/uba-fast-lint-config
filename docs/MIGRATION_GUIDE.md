# Migration Guide: uba-eslint-config → uba-fast-lint-config

## 1. Install

```bash
pnpm remove uba-eslint-config prettier prettier-plugin-packagejson prettier-plugin-tailwindcss
pnpm add -D uba-fast-lint-config
```

## 2. Replace Prettier with Biome

Delete Prettier config files:

```bash
rm .prettierrc .prettierrc.js .prettierrc.json prettier.config.js prettier.config.mjs 2>/dev/null
```

The `biome.json` ships with this package. Copy it to your project root or reference it:

```bash
cp node_modules/uba-fast-lint-config/biome.json .
```

## 3. Update ESLint config

Replace imports in `eslint.config.js`:

```diff
- import { ubaEslintConfig } from "uba-eslint-config";
+ import { ubaFastLintConfig } from "uba-fast-lint-config";

- export default [...ubaEslintConfig];
+ export default [...ubaFastLintConfig];
```

Or with custom options:

```diff
- import { generateEslintConfig } from "uba-eslint-config";
+ import { generateLintConfig } from "uba-fast-lint-config";

- export default generateEslintConfig({
+ export default generateLintConfig({
    appType: "fullstack",
    shouldEnableTypescript: true,
-   importCycleCheckMode: "off",
  });
```

### API mapping

| uba-eslint-config | uba-fast-lint-config |
|---|---|
| `ubaEslintConfig` | `ubaFastLintConfig` |
| `generateEslintConfig()` | `generateLintConfig()` |
| `generateEslintConfigByFeatures()` | `generateLintConfigByFeatures()` |
| `ubaPrettierConfig` | `generateFormatterConfig().config` |
| `generatePrettierConfig()` | `generateFormatterConfig()` |

### Options changes

- `importCycleCheckMode` is removed. oxlint handles `import/no-cycle` natively and it's fast enough to run always.
- `shouldEnableA11y`, `shouldEnableNodeGlobals`, `shouldEnableBrowserGlobals`, `shouldEnableVitest`, `shouldEnableReact` are no longer ESLint feature flags — those rules run in oxlint unconditionally via `.oxlintrc.json`.
- New flag: `shouldEnableTailwind` controls the `eslint-plugin-tailwindcss` gap plugin (replaces `prettier-plugin-tailwindcss` for class sorting).

## 4. Update package.json scripts

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

## 5. Update CI

Replace Prettier commands with Biome, add oxlint before ESLint. See `.github/workflows/ci.yml` in this repo for the reference workflow.

## 6. Update editor integration

- Install the Biome VS Code extension (`biomejs.biome`)
- Remove/disable the Prettier extension for JS/TS files
- Keep the ESLint extension (it now only runs gap plugins — much faster)
- oxlint runs as a CLI tool; no editor extension needed (oxlint diagnostics overlap with ESLint)
