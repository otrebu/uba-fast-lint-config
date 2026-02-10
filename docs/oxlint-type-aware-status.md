# oxlint Type-Aware Linting Status

> Last reviewed: 2026-02-10 | oxlint v1.43.0 | tsgolint alpha

## Status: Alpha

Type-aware linting in oxlint uses `tsgolint`, a separate binary powered by
typescript-go. It requires the `--type-aware` CLI flag and `oxlint-tsgolint` as
a dev dependency.

```bash
npm add -D oxlint oxlint-tsgolint@latest
npx oxlint --type-aware
```

## Coverage

43 of 59 typescript-eslint type-aware rules are implemented.

### Rules we use that oxlint handles (type-aware)

| Rule | Status |
|------|--------|
| await-thenable | alpha |
| no-base-to-string | alpha |
| no-confusing-void-expression | alpha |
| no-floating-promises | alpha |
| no-for-in-array | alpha |
| no-implied-eval | alpha |
| no-meaningless-void-operator | alpha |
| no-misused-promises | alpha |
| no-redundant-type-constituents | alpha |
| no-unnecessary-boolean-literal-compare | alpha |
| no-unnecessary-type-arguments | alpha |
| no-unnecessary-type-assertion | alpha |
| no-unsafe-argument | alpha |
| no-unsafe-assignment | alpha |
| no-unsafe-call | alpha |
| no-unsafe-member-access | alpha |
| no-unsafe-return | alpha |
| non-nullable-type-assertion-style | alpha |
| prefer-includes | alpha |
| prefer-nullish-coalescing | alpha |
| prefer-reduce-type-parameter | alpha |
| promise-function-async | alpha |
| require-array-sort-compare | alpha |
| require-await | alpha |
| restrict-plus-operands | alpha |
| restrict-template-expressions | alpha |
| strict-boolean-expressions | alpha |

### Rules we use that oxlint does NOT handle (stay in ESLint)

- consistent-type-assertions
- consistent-type-exports
- dot-notation
- member-delimiter-style
- method-signature-style
- naming-convention
- no-invalid-this
- no-invalid-void-type
- no-shadow
- no-unnecessary-condition
- no-unnecessary-qualifier
- prefer-optional-chain
- prefer-regexp-exec
- prefer-string-starts-ends-with
- typedef
- unified-signatures

## Known Limitations

- **Memory:** Large codebases may OOM. Memory optimization planned for beta.
- **Alpha stability:** May have false positives/negatives. Watch release notes.
- **Config:** Type-aware rules use the same JSON config format as non-type-aware
  rules but require the `--type-aware` flag at runtime.

## Recommendation

**Do not enable `--type-aware` in CI yet.** Keep type-aware rules in ESLint via
typescript-eslint until oxlint promotes them to stable. Monitor the
[oxlint changelog](https://oxc.rs/blog) and re-evaluate at beta.

When stable, remove type-aware rules from `configuration/typescript.js` and add
`--type-aware` to the oxlint invocation. eslint-plugin-oxlint will
automatically disable the corresponding ESLint rules.
