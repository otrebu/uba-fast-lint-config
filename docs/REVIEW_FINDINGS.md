# Review Findings: uba-fast-lint-config Parity Audit

> Reviewer: devil's-advocate agent | Date: 2026-02-10
> Compared: uba-eslint-config@1.4.0 vs uba-fast-lint-config@0.1.0

---

## Executive Summary

The migration splits the original ESLint+Prettier stack into three tools: Biome (formatter), oxlint (bulk linting), and slim ESLint (gap plugins). Overall the architecture is sound, but there are **rule coverage gaps**, **formatter parity issues**, and **stability risks** that consumers must understand before adopting.

**Findings:** 8 critical, 12 major, 9 minor
**Post-fix status:** See "Resolved" annotations below.

---

## 1. Silently Dropped Rules [CRITICAL]

### 1.1 `no-restricted-syntax` with custom AST selectors — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js` with exact original options (class restriction selectors).

### 1.2 `consistent-return` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.3 `no-implicit-globals` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.4 `no-octal-escape` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.5 `no-dupe-args` — DROPPED (accepted)

**Severity: MINOR** | **Status: ACCEPTED** — Not added. JS engine catches this at parse time. Low risk.

### 1.6 `no-undef` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.7 `no-unreachable` / `no-unreachable-loop` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Both added to `configuration/eslintCoreGap.js`.

### 1.8 `object-shorthand` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.9 `prefer-arrow-callback` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js` with `{ allowNamedFunctions: true }`.

### 1.10 `prefer-named-capture-group` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.11 `prefer-regex-literals` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.12 `require-atomic-updates` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.13 `spaced-comment` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.14 `logical-assignment-operators` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

### 1.15 `func-name-matching` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/eslintCoreGap.js`.

---

## 2. TypeScript Rules — Gaps

### 2.1 `@typescript-eslint/consistent-type-definitions` — ~~SEVERITY MISMATCH~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Present in `.oxlintrc.json` with correct `["error", "interface"]` option. oxlint handles this.

### 2.2 `@typescript-eslint/no-array-constructor` — DROPPED (accepted)

**Severity: MINOR** | **Status: ACCEPTED** — Uncommon pattern. Low risk.

### 2.3 `@typescript-eslint/no-unused-vars` — option parity (accepted)

**Severity: MAJOR** | **Status: ACCEPTED** — Base `eslint/no-unused-vars` in oxlint has `ignoreRestSiblings: true`. TS version adds type-only detection but base covers the main use case.

### 2.4 `@typescript-eslint/no-restricted-imports` — DROPPED (accepted)

**Severity: MINOR** | **Status: ACCEPTED** — Base `eslint/no-restricted-imports` in oxlint (empty config = no specific restrictions). Same effective behavior.

### 2.5 `@typescript-eslint/init-declarations` — DROPPED (accepted)

**Severity: MINOR** | **Status: ACCEPTED** — Base `eslint/init-declarations` in oxlint with `["error", "always"]`. Same behavior for TS files.

### 2.6 `@typescript-eslint/default-param-last` — DROPPED (accepted)

**Severity: MINOR** | **Status: ACCEPTED** — Base `eslint/default-param-last` in oxlint. Same behavior for TS files.

---

## 3. React Rules — Gaps

### 3.1 `react/boolean-prop-naming` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/reactGap.js` with exact original regex pattern.

### 3.2 `react/destructuring-assignment` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js` with `["always"]`.

### 3.3 `react/function-component-definition` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/reactGap.js` with exact original options.

### 3.4 `react/hook-use-state` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.5 `react/jsx-no-constructed-context-values` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.6 `react/jsx-no-leaked-render` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.7 `react/no-did-update-set-state` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.8 `react/no-invalid-html-attribute` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.9 `react/no-object-type-as-default-prop` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.10 `react/no-typos` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.11 `react/no-unstable-nested-components` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.12 `react/no-unused-class-component-methods` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.13 `react/no-unused-prop-types` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.14 `react/no-unused-state` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.15 `react/prop-types` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.16 `react/sort-prop-types` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/reactGap.js`.

### 3.17 `react/style-prop-object` — ~~ADDED (not in original)~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Set to `"off"` in `.oxlintrc.json` (line 215). Matches original.

---

## 4. Unicorn Rules — Gaps

### 4.1 `unicorn/prevent-abbreviations` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/unicornGap.js` with full 24-entry allowList and `replacements: { err: { error: true } }`. Exact match verified.

### 4.2 `unicorn/consistent-destructuring` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

### 4.3 `unicorn/no-array-push-push` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

### 4.4 `unicorn/no-for-loop` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

### 4.5 `unicorn/prefer-export-from` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

### 4.6 `unicorn/prefer-module` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

### 4.7 `unicorn/prefer-string-starts-ends-with` — DROPPED (accepted)

**Severity: MINOR** | **Status: ACCEPTED** — oxlint has `unicorn/prefer-string-starts-ends-with` already.

### 4.8 `unicorn/prefer-switch` / `unicorn/prefer-ternary` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Both added to `configuration/unicornGap.js`.

### 4.9 `unicorn/relative-url-style` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

### 4.10 `unicorn/template-indent` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/unicornGap.js`.

---

## 5. Import Rules — Gaps

### 5.1 `import/export` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.2 `import/extensions` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/importGap.js` with `["error", "never"]` for TS, off for JS (matches original).

### 5.3 `import/named` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.4 `import/newline-after-import` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.5 `import/no-deprecated` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.6 `import/no-extraneous-dependencies` — ~~DROPPED~~ RESOLVED

**Severity: CRITICAL** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.7 `import/no-relative-packages` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.8 `import/no-unresolved` — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.9 `import/no-unused-modules` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

### 5.10 `import/no-useless-path-segments` — ~~DROPPED~~ RESOLVED

**Severity: MINOR** | **Status: RESOLVED** — Added to `configuration/importGap.js`.

---

## 6. jsx-a11y Rules — Gaps

### 6.1 `jsx-a11y/interactive-supports-focus` — OPTIONS DROPPED

**Severity: MAJOR**

Original recommended config includes `tabbable` option. oxlint has the rule but likely without the option schema. Verify.

### 6.2 `jsx-a11y/no-interactive-element-to-noninteractive-role` — OPTIONS DROPPED

**Severity: MINOR**

Complex element-to-role mapping options present in recommended config but not expressible in oxlint.

### 6.3 `jsx-a11y/no-noninteractive-element-interactions` — OPTIONS DROPPED

**Severity: MINOR**

Has `handlers` and per-element options.

### 6.4 `jsx-a11y/no-noninteractive-element-to-interactive-role` — OPTIONS DROPPED

**Severity: MINOR**

### 6.5 `jsx-a11y/no-static-element-interactions` — OPTIONS DROPPED

**Severity: MINOR**

---

## 7. Vitest Rules — Gaps

### 7.1 Several recommended rules DROPPED

**Severity: MAJOR**

Original includes `vitest.configs.recommended.rules` which has 17 rules. oxlint config only has 11. Missing:
- `vitest/no-conditional-expect`
- `vitest/no-interpolation-in-snapshots`
- `vitest/no-mocks-import`
- `vitest/no-standalone-expect`
- `vitest/no-unneeded-async-expect-function`
- `vitest/prefer-called-exactly-once-with`
- `vitest/require-local-test-context-for-concurrent-snapshots`
- `vitest/valid-expect-in-promise`

Note: `vitest/no-conditional-tests` is in oxlint but NOT in the original config's recommended preset.

---

## 8. Formatter Parity (Biome vs Prettier)

### 8.1 `prettier-plugin-packagejson` — NO EQUIVALENT

**Severity: MAJOR**

Biome has `useSortedKeys` but it does generic alphabetical sorting, NOT semantic package.json field ordering. `sort-package-json` or similar must be added as pre-commit step.

`configuration/formatter.js` documents this gap. biome.json does NOT have any workaround configured.

### 8.2 `prettier-plugin-tailwindcss` — PARTIAL

**Severity: MAJOR**

Biome's `useSortedClasses` is nursery/experimental with unsafe fixes. The ESLint gap config includes `tailwindcss/classnames-order: "warn"` which is a reasonable workaround, but it's a lint rule (warn only), not a formatter (auto-fix on save). DX differs: Prettier auto-sorted on save, now requires explicit `eslint --fix`.

### 8.3 `embeddedLanguageFormatting` — NO EQUIVALENT

**Severity: MINOR**

Biome does not format embedded languages in template literals. Documented in `formatter.js`.

### 8.4 `htmlWhitespaceSensitivity: "css"` — PARTIAL

**Severity: MINOR**

biome.json has `html.formatter.whitespaceSensitivity: "css"` but Biome's HTML formatter support is limited/experimental.

### 8.5 `objectWrap: "collapse"` mapping

**Severity: MINOR**

biome.json has `expand: "never"` which maps to `objectWrap: "collapse"`. Correct mapping. However, Biome's behavior may differ from Prettier in edge cases (deeply nested objects).

---

## 9. Architecture & DX Risks

### 9.1 Three-Tool Complexity

**Severity: MAJOR**

Consumers need:
- VS Code: Biome extension + ESLint extension + oxlint extension (3 extensions)
- CLI: `biome format` + `oxlint` + `eslint` (3 commands)
- Config files: `biome.json` + `.oxlintrc.json` + `eslint.config.js` (3 configs)

Original: ESLint extension + Prettier extension (2 extensions), 2 config files.

**Risk:** Error messages from 3 tools with different formats. Developers must know which tool owns which rule. When a lint error appears, it's not obvious whether to look at oxlint config or ESLint config.

### 9.2 oxlint Type-Aware Linting — Alpha Stability

**Severity: CRITICAL**

The `docs/oxlint-type-aware-status.md` correctly documents this as alpha. The recommendation to NOT enable `--type-aware` in CI is sound. However:

- 27 type-aware rules in `.oxlintrc.json` (await-thenable, no-floating-promises, etc.) are configured but **will not run without `--type-aware` flag**
- If someone runs `oxlint .` without the flag, these rules silently do nothing
- The `configuration/typescript.js` ESLint gap config covers only 15 rules, leaving ~12 type-aware rules in a **dead zone** — configured in oxlint but not running because `--type-aware` isn't recommended

**Fix:** Either enable `--type-aware` (accepting alpha risk) OR duplicate the 27 type-aware rules in `configuration/typescript.js` until oxlint promotes them to stable.

### 9.3 `eslint-plugin-oxlint` Rule Deconfliction

**Severity: MAJOR**

`eslint.config.js` uses `oxlint.buildFromOxlintConfigFile(".oxlintrc.json")` to auto-disable overlapping ESLint rules. This is correct but:

- If `.oxlintrc.json` path changes or file is missing, ESLint will have no rules disabled and they'll conflict with oxlint
- The deconfliction depends on `eslint-plugin-oxlint` staying in sync with oxlint's rule names

### 9.4 CI Workflow — Missing oxlint Config Path

**Severity: MINOR**

CI workflow (`.github/workflows/ci.yml`) runs `oxlint .` without specifying `--config .oxlintrc.json`. oxlint may auto-detect, but should be explicit.

### 9.5 `import/no-cycle` CI-only Mode — ~~DROPPED~~ RESOLVED

**Severity: MAJOR** | **Status: RESOLVED** — `import/no-cycle` set to `"off"` in `.oxlintrc.json`. Moved to `configuration/importGap.js` with `process.env.CI ? 2 : 0` conditional. Matches original CI-only behavior.

### 9.6 Missing `import/order` equivalent

**Severity: MINOR**

Original had `import/order: 0` (off, using perfectionist). New config has perfectionist/sort-imports in ESLint gap. This is correct but worth noting that import ordering now runs in ESLint (slow) instead of being available in oxlint (fast).

---

## 10. Performance Assessment

### 10.1 Claimed Speedups

**Assessment: Realistic for linting, not for formatting**

- oxlint is genuinely 50-100x faster than ESLint for rules it covers
- Biome formatter is 10-30x faster than Prettier
- BUT: the slim ESLint still runs 22 perfectionist rules, TypeScript gap rules, and several plugin configs. ESLint startup + parsing overhead still exists
- Net improvement: ~60-70% of total lint time saved for a typical fullstack project

### 10.2 `import/no-cycle` Performance Regression

Running `import/no-cycle` in oxlint on every local run (no CI-only mode) could negate speedups for large monorepos.

---

## 11. Summary Table: Rule Count Comparison (POST-FIX)

| Category | Original Enabled | oxlint | ESLint Gap | Total New | Remaining Gap |
|----------|-----------------|--------|------------|-----------|--------------|
| ESLint core | ~136 | ~112 | 16 | ~128 | ~8 (low risk) |
| @typescript-eslint | ~62 | ~28 | 15 | ~43 | ~27 type-aware (intentional) |
| react + react-hooks | ~54 | ~32 | 21 | ~53 | 0 |
| unicorn | ~59 | ~48 | 11 | ~59 | 0 |
| import | ~20 | ~14 | 10 (+no-cycle CI) | ~24 | 0 |
| promise | ~13 | ~12 | 0 | ~12 | 1 (no-return-in-finally) |
| jsx-a11y | ~31 | ~26 | 0 | ~26 | ~5 (options) |
| vitest | ~18 | ~11 | 0 | ~11 | ~7 (oxlint limitation) |
| perfectionist | 22 | 0 | 22 | 22 | 0 |
| cypress | 6 | 6 (overrides) | 6 | 6 | 0 |
| graphql | ~16 | 0 | ~16 | ~16 | 0 |
| canonical | 1 | 0 | 1 | 1 | 0 |
| check-file | 1 | 0 | 1 | 1 | 0 |
| function-name | 1 | 0 | 1 | 1 | 0 |
| chai-friendly | 1 | 0 | 1 | 1 | 0 |
| query | 7 | 0 | 7 | 7 | 0 |
| router | 2 | 0 | 2 | 2 | 0 |
| storybook | ~11 | 0 | ~11 | ~11 | 0 |
| **TOTAL** | **~421** | **~289** | **~141** | **~405** | **~16 real + 27 type-aware** |

**Post-fix: ~95% non-type-aware rule parity achieved. Down from ~75 dropped to ~16.**

---

## 12. Recommendations (POST-FIX UPDATE)

### RESOLVED (originally Critical/Major):
1. ~~Add `no-restricted-syntax`~~ — DONE (`eslintCoreGap.js`)
2. ~~Add React critical rules~~ — DONE (`reactGap.js`: 21 rules)
3. ~~Add `import/no-extraneous-dependencies`~~ — DONE (`importGap.js`)
4. Type-aware dead zone — DOCUMENTED (known gap, pending oxlint stability)
5. ~~Add `unicorn/prevent-abbreviations` with allowList~~ — DONE (`unicornGap.js`)
6. ~~Add remaining core ESLint rules~~ — DONE (`eslintCoreGap.js`: 16 rules)
7. ~~Add `import/no-unresolved` and `import/named`~~ — DONE (`importGap.js`)
8. ~~Implement `import/no-cycle` CI-only mode~~ — DONE (oxlint=off, importGap.js CI conditional)
9. `sort-package-json` pre-commit hook — STILL OPEN (formatter gap)
10. 3-tool debugging docs — STILL OPEN (DX documentation)
11. ~~Remove `react/style-prop-object`~~ — DONE (set to `"off"` in .oxlintrc.json)

### Still open (Minor/Medium):
- Add `no-unmodified-loop-condition` and `no-implied-eval` to eslintCoreGap.js (medium risk)
- Add `promise/no-return-in-finally` to a promise gap config (medium risk)
- Add `@typescript-eslint/no-unused-expressions` to TS gap config (medium risk)
- Verify jsx-a11y rule options parity in oxlint
- Make CI workflow explicit about oxlint config path
- Add 8 missing vitest recommended rules as ESLint gap (oxlint limitation)
