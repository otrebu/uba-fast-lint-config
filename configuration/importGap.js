// Import rules not supported by oxlint — must stay in ESLint.
// Severity and options match uba-eslint-config/configuration/import.js exactly.

import importPlugin from "eslint-plugin-import";

const importGapRules = {
  "import/export": 2,
  "import/extensions": [2, "never"],
  "import/named": 2,
  "import/newline-after-import": 2,
  "import/no-deprecated": 2,
  "import/no-extraneous-dependencies": 2,
  "import/no-relative-packages": 2,
  "import/no-unresolved": 2,
  "import/no-unused-modules": [2],
  "import/no-useless-path-segments": 2,
};

// import/no-cycle was in .oxlintrc.json as always-on "error", which is a perf
// regression — the original config only enforces it in CI.
// Moved here so the conditional works; the integrator (task #5) must set
// import/no-cycle to "off" in .oxlintrc.json.
const noCycleRule = { "import/no-cycle": process.env.CI ? 2 : 0 };

/** @type {Record<string, import("eslint").ESLint.Plugin>} */
const importPluginSetting = {
  import: { meta: { name: "import" }, rules: importPlugin.rules },
};

/** @type {import("eslint").Linter.Config} */
const importGapTypescriptConfig = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  plugins: importPluginSetting,
  rules: { ...importGapRules, ...noCycleRule },
  settings: {
    "import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
    "import/resolver": { node: true, typescript: { alwaysTryTypes: true } },
  },
};

/** @type {import("eslint").Linter.Config} */
const importGapJavascriptConfig = {
  files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
  languageOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: importPluginSetting,
  rules: { ...importGapRules, ...noCycleRule, "import/extensions": 0 },
};

export { importGapJavascriptConfig, importGapTypescriptConfig };
export default importGapTypescriptConfig;
