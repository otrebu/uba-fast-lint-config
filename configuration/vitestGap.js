// Vitest recommended rules not supported by oxlint — must stay in ESLint.
// oxlint handles: expect-expect, no-conditional-tests, no-disabled-tests,
// no-focused-tests, no-commented-out-tests, no-identical-title,
// no-import-node-test, valid-describe-callback, valid-expect, valid-title,
// max-nested-describe.

import vitest from "@vitest/eslint-plugin";

/** @type {import("eslint").Linter.Config} */
const vitestGapConfig = {
  files: [
    "tests/**",
    "**/*.test.ts",
    "**/*.test.js",
    "**/*.test.tsx",
    "**/*.test.jsx",
    "**/*.spec.ts",
    "**/*.spec.js",
  ],
  languageOptions: { globals: { ...vitest.environments.env.globals } },
  plugins: { vitest },
  rules: {
    "vitest/no-interpolation-in-snapshots": 2,
    "vitest/no-mocks-import": 2,
    "vitest/no-unneeded-async-expect-function": 2,
    "vitest/prefer-called-exactly-once-with": 2,
    "vitest/valid-expect-in-promise": 2,
  },
  settings: { vitest: { typecheck: true } },
};

export default vitestGapConfig;
