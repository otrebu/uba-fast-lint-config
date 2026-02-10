import tseslint from "typescript-eslint";

/**
 * TypeScript rules NOT covered by oxlint.
 *
 * All rules that oxlint handles (both non-type-aware and type-aware alpha)
 * are intentionally omitted here. eslint-plugin-oxlint turns those off
 * automatically so ESLint skips them and oxlint runs them at native speed.
 *
 * Rules here fall into three buckets:
 *   1. Rules oxlint hasn't implemented yet
 *   2. Rules requiring complex ESLint-specific option schemas oxlint can't replicate
 *   3. The naming-convention rule (no oxlint equivalent)
 */

/** @type {import("eslint").Linter.Config} */
const typescriptEslintConfig = {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { allowDefaultProject: true, projectService: true },
  },
  plugins: { "@typescript-eslint": tseslint.plugin },
  rules: {
    // --- Rules with NO oxlint equivalent ---

    "@typescript-eslint/consistent-type-assertions": [
      2,
      {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "allow-as-parameter",
      },
    ],
    "@typescript-eslint/consistent-type-exports": 2,
    "@typescript-eslint/dot-notation": 2,
    "@typescript-eslint/member-delimiter-style": 2,
    "@typescript-eslint/method-signature-style": [2, "property"],
    "@typescript-eslint/naming-convention": [
      2,
      {
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        selector: "variableLike",
      },
      { format: ["PascalCase"], prefix: ["T"], selector: "typeParameter" },
      { format: ["PascalCase"], selector: "typeLike" },
      {
        format: ["PascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will", "must"],
        selector: ["variable", "parameter"],
        types: ["boolean"],
      },
      {
        custom: { match: false, regex: "^I[A-Z]" },
        format: ["PascalCase"],
        selector: "interface",
      },
    ],
    "@typescript-eslint/no-invalid-this": 2,
    "@typescript-eslint/no-invalid-void-type": 2,
    "@typescript-eslint/no-shadow": [
      2,
      {
        ignoreFunctionTypeParameterNameValueShadow: true,
        ignoreTypeValueShadow: true,
      },
    ],
    "@typescript-eslint/no-unnecessary-condition": 2,
    "@typescript-eslint/no-unnecessary-qualifier": 2,
    "@typescript-eslint/prefer-optional-chain": 2,
    "@typescript-eslint/prefer-regexp-exec": 2,
    "@typescript-eslint/prefer-string-starts-ends-with": 2,
    "@typescript-eslint/typedef": 2,
    "@typescript-eslint/unified-signatures": 2,

    // --- Disable base ESLint equivalents (TS versions take over) ---
    "dot-notation": 0,
    "no-invalid-this": 0,
    "no-shadow": 0,
  },
};

export default typescriptEslintConfig;
