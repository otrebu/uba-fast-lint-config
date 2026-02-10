// uba-fast-lint-config
// Hybrid linting: Biome (formatter) + oxlint (bulk lint) + ESLint (gap plugins)
//
// Replaces uba-eslint-config with a faster toolchain while maintaining
// the same rule coverage.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { generateBiomeFormatterConfig } from "./configuration/formatter.js";
import defaultEslintConfig, {
  generateEslintConfig,
  generateEslintConfigByFeatures,
} from "./eslint.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generate the full lint + format config bundle.
 * Returns an object with each tool's config so consumers know what goes where.
 *
 * @param {object} options
 * @param {AppType} [options.appType="fullstack"]
 * @param {boolean} [options.shouldEnableStorybook=false]
 * @param {boolean} [options.shouldEnableTypescript=true]
 * @returns {{ oxlintConfig: object, eslintConfig: import("eslint").Linter.Config[], biomeFormatterConfig: object }}
 */
function generateLintConfig({
  appType = "fullstack",
  shouldEnableStorybook = false,
  shouldEnableTypescript = true,
} = {}) {
  const eslintConfig = generateEslintConfig({
    appType,
    shouldEnableStorybook,
    shouldEnableTypescript,
  });
  const oxlintConfig = readOxlintConfig();
  const { config: biomeFormatterConfig } = generateBiomeFormatterConfig({
    appType,
  });

  return { biomeFormatterConfig, eslintConfig, oxlintConfig };
}

/**
 * @typedef {"fullstack" | "backendOnly"} AppType
 */

/**
 * Fine-grained feature-flag control.
 * Returns the same bundle shape as generateLintConfig.
 *
 * @param {object} options
 * @param {AppType} [options.appType="fullstack"]
 * @param {boolean} [options.shouldEnableTypescript=true]
 * @param {boolean} [options.shouldEnableCypress=false]
 * @param {boolean} [options.shouldEnableGraphql=false]
 * @param {boolean} [options.shouldEnableStorybook=false]
 * @param {boolean} [options.shouldEnableQuery=false]
 * @param {boolean} [options.shouldEnableRouter=false]
 * @param {boolean} [options.shouldEnableTailwind=false]
 * @returns {{ oxlintConfig: object, eslintConfig: import("eslint").Linter.Config[], biomeFormatterConfig: object }}
 */
function generateLintConfigByFeatures({
  appType = "fullstack",
  shouldEnableCypress = false,
  shouldEnableGraphql = false,
  shouldEnableQuery = false,
  shouldEnableRouter = false,
  shouldEnableStorybook = false,
  shouldEnableTailwind = false,
  shouldEnableTypescript = true,
} = {}) {
  const eslintConfig = generateEslintConfigByFeatures({
    shouldEnableCypress,
    shouldEnableGraphql,
    shouldEnableQuery,
    shouldEnableRouter,
    shouldEnableStorybook,
    shouldEnableTailwind,
    shouldEnableTypescript,
  });
  const oxlintConfig = readOxlintConfig();
  const { config: biomeFormatterConfig } = generateBiomeFormatterConfig({
    appType,
  });

  return { biomeFormatterConfig, eslintConfig, oxlintConfig };
}

/**
 * Returns the recommended package.json scripts for a project using this config.
 *
 * @returns {Record<string, string>}
 */
function getScripts() {
  return {
    check: "biome check .",
    fix: "biome format --write . && oxlint --fix . && eslint --fix .",
    format: "biome format --write .",
    "format:check": "biome format .",
    lint: "oxlint . && eslint .",
    "lint:fix": "oxlint --fix . && eslint --fix .",
  };
}

function readOxlintConfig() {
  const configPath = resolve(__dirname, ".oxlintrc.json");
  const raw = readFileSync(configPath, "utf8");
  // Strip single-line comments (JSONC → JSON)
  const stripped = raw.replaceAll(/^\s*\/\/.*$/gm, "");
  return JSON.parse(stripped);
}

/** Default preset: fullstack ESLint gap config (use as eslint.config.js default export) */
const ubaFastLintConfig = defaultEslintConfig;

export {
  generateLintConfig,
  generateLintConfigByFeatures,
  getScripts,
  ubaFastLintConfig,
};
export { generateBiomeFormatterConfig as generateFormatterConfig } from "./configuration/formatter.js";
