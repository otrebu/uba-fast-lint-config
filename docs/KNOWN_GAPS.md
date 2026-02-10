# Known Gaps

Features from uba-eslint-config (ESLint + Prettier) that have no direct Biome/oxlint equivalent.

For the full audit report, see [REVIEW_FINDINGS.md](REVIEW_FINDINGS.md).

## Summary

| Category | Original Enabled | New (oxlint + ESLint gap) | Dropped |
|----------|-----------------|---------------------------|---------|
| ESLint core | ~133 | ~113 | ~20 |
| @typescript-eslint | ~77 | ~73 | ~4 |
| react + react-hooks | ~54 | ~36 | ~18 |
| unicorn | ~83 | ~72 | ~11 |
| import | ~24 | ~14 | ~10 |
| promise | ~14 | ~14 | 0 |
| jsx-a11y | ~31 | ~26 | ~5 (options lost) |
| vitest | ~18 | ~11 | ~7 |
| perfectionist | 22 | 22 | 0 |
| Other gap plugins | ~47 | ~47 | 0 |
| **Total** | **~504** | **~429** | **~75** |

## Critical Dropped Rules

These rules were in the original config but are missing from both oxlint and the ESLint gap layer. They should be added to `eslint.config.js` before release.

### ESLint Core

| Rule | Severity | Impact |
|------|----------|--------|
| `no-restricted-syntax` (class restriction) | Critical | FP-first enforcement — warns on class usage (except Error subclasses) |
| `consistent-return` | Critical | Prevents implicit undefined returns |
| `no-undef` | Major | Catches undeclared variables in JS files |
| `no-unreachable` / `no-unreachable-loop` | Major | Dead code detection |
| `object-shorthand` | Major | Enforces `{ foo }` over `{ foo: foo }` |
| `prefer-arrow-callback` | Major | Enforces arrow callbacks (with `allowNamedFunctions`) |
| `require-atomic-updates` | Major | Prevents race condition bugs |
| `no-implicit-globals` | Major | Prevents global pollution |
| `logical-assignment-operators` | Minor | Enforces `??=`, `&&=`, `\|\|=` |
| `spaced-comment` | Minor | Comment formatting |
| `func-name-matching` | Minor | Name consistency |
| `prefer-named-capture-group` | Minor | Regex readability |
| `prefer-regex-literals` | Minor | Avoid `new RegExp()` |
| `no-octal-escape` | Minor | Security |
| `no-dupe-args` | Minor | Engine catches this |

### React

| Rule | Severity | Impact |
|------|----------|--------|
| `react/jsx-no-leaked-render` | Critical | Prevents rendering `0` or `""` in JSX |
| `react/jsx-no-constructed-context-values` | Critical | Prevents re-renders from inline context objects |
| `react/no-unstable-nested-components` | Critical | Prevents unmounting/remounting on every render |
| `react/function-component-definition` | Critical | Enforces function declarations for named components |
| `react/boolean-prop-naming` | Critical | Enforces `is/has/should/can/did/will/must` prefix |
| `react/hook-use-state` | Major | Enforces `[value, setValue]` destructuring |
| `react/destructuring-assignment` | Major | Enforces `always` destructuring |
| `react/no-object-type-as-default-prop` | Major | Performance — prevents re-renders |
| `react/no-unused-prop-types` | Major | Dead code |
| `react/prop-types` | Major | PropTypes validation |
| `react/no-adjacent-inline-elements` | Minor | |
| `react/no-did-update-set-state` | Minor | |
| `react/no-invalid-html-attribute` | Minor | |
| `react/no-typos` | Minor | |
| `react/no-unused-class-component-methods` | Minor | |
| `react/no-unused-state` | Minor | |
| `react/sort-prop-types` | Minor | |

### Unicorn

| Rule | Severity | Impact |
|------|----------|--------|
| `unicorn/prevent-abbreviations` | Critical | Has 24-entry allowList — without it, every `props`, `args`, `env`, `db`, `ref`, `src` etc. triggers |
| `unicorn/consistent-destructuring` | Major | |
| `unicorn/no-array-push-push` | Minor | |
| `unicorn/no-for-loop` | Minor | |
| `unicorn/prefer-export-from` | Minor | |
| `unicorn/prefer-module` | Minor | |
| `unicorn/prefer-string-starts-ends-with` | Minor | |
| `unicorn/prefer-switch` / `prefer-ternary` | Minor | |
| `unicorn/relative-url-style` | Minor | |
| `unicorn/template-indent` | Minor | |

### Import

| Rule | Severity | Impact |
|------|----------|--------|
| `import/no-extraneous-dependencies` | Critical | Catches imports not in package.json |
| `import/no-unresolved` | Major | Catches broken imports |
| `import/named` | Major | Validates named imports exist |
| `import/export` | Major | Validates export declarations |
| `import/extensions` | Minor | |
| `import/newline-after-import` | Minor | |
| `import/no-deprecated` | Minor | |
| `import/no-relative-packages` | Minor | |
| `import/no-unused-modules` | Minor | |
| `import/no-useless-path-segments` | Minor | |

### TypeScript

| Rule | Severity | Impact |
|------|----------|--------|
| `@typescript-eslint/no-unused-vars` option parity | Major | `ignoreRestSiblings` option needs verification in oxlint |
| `@typescript-eslint/no-restricted-imports` | Minor | |
| `@typescript-eslint/init-declarations` | Minor | |
| `@typescript-eslint/default-param-last` | Minor | |

### Vitest (8 missing from recommended)

`no-conditional-expect`, `no-interpolation-in-snapshots`, `no-mocks-import`, `no-standalone-expect`, `no-unneeded-async-expect-function`, `prefer-called-exactly-once-with`, `require-local-test-context-for-concurrent-snapshots`, `valid-expect-in-promise`

### jsx-a11y (options lost)

5 rules have complex element/role mapping options that oxlint may not fully support: `interactive-supports-focus`, `no-interactive-element-to-noninteractive-role`, `no-noninteractive-element-interactions`, `no-noninteractive-element-to-interactive-role`, `no-static-element-interactions`.

### False Positive Addition

`react/style-prop-object` is **enabled** in oxlint but was **OFF** in the original config. Should be turned off.

## Formatter Gaps (Prettier → Biome)

| Prettier Feature | Status | Workaround |
|---|---|---|
| `prettier-plugin-packagejson` | No Biome equivalent | Run `npx sort-package-json` in pre-commit hook or CI |
| `prettier-plugin-tailwindcss` | No Biome equivalent | `eslint-plugin-tailwindcss` with `classnames-order` rule (included in ESLint gap). Note: lint rule (warn only), not auto-fix on save like Prettier was |
| `embeddedLanguageFormatting` | Not supported | None — embedded code in template literals stays unformatted |
| `objectWrap: "collapse"` | Biome uses `expand: "never"` | Closest equivalent; minor edge-case differences |
| HTML whitespace sensitivity | Biome experimental | `html.formatter.whitespaceSensitivity: "css"` set but Biome HTML support is limited |

## Architecture Considerations

### Type-Aware Rule Dead Zone

27 type-aware rules are configured in `.oxlintrc.json` but **will not run** without the `--type-aware` flag. The flag is not recommended yet (alpha stability). These 27 rules are not duplicated in the ESLint gap config, creating a coverage gap. See [oxlint-type-aware-status.md](oxlint-type-aware-status.md).

### Three-Tool Complexity

Consumers manage 3 tools (Biome + oxlint + ESLint) vs the original 2 (ESLint + Prettier). Error messages come from different tools with different formats. Document which tool owns which rule for debugging.

### `import/no-cycle` Always On

Original had `importCycleCheckMode` to disable this heavy rule locally. oxlint runs it always. May slow down large monorepos — monitor performance.

## Removed Options

| Original Option | Reason |
|---|---|
| `importCycleCheckMode` | oxlint runs `import/no-cycle` natively — no CI-only mode |
| `shouldEnableA11y` | jsx-a11y rules run in oxlint unconditionally |
| `shouldEnableVitest` | Vitest rules run in oxlint unconditionally |
| `shouldEnableReact` | React rules run in oxlint unconditionally |
| `shouldEnableNodeGlobals` | Configured in `.oxlintrc.json` env |
| `shouldEnableBrowserGlobals` | Configured in `.oxlintrc.json` env |
