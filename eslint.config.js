// Slim ESLint config — gap plugins only.
// Rules covered by oxlint or Biome are intentionally excluded.
// eslint-plugin-oxlint auto-disables any overlapping ESLint rules.

import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import pluginChaiFriendly from "eslint-plugin-chai-friendly";
import oxlint from "eslint-plugin-oxlint";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";

import canonicalConfig from "./configuration/canonical.js";
import cypressConfig from "./configuration/cypress.js";
import eslintCoreGapConfig from "./configuration/eslintCoreGap.js";
import filenameConfig from "./configuration/filename.js";
import functionNameConfig from "./configuration/functionName.js";
import graphqlConfig from "./configuration/graphql.js";
import {
  importGapJavascriptConfig,
  importGapTypescriptConfig,
} from "./configuration/importGap.js";
import promiseGapConfig from "./configuration/promiseGap.js";
import reactGapConfig from "./configuration/reactGap.js";
import { getStorybookConfig } from "./configuration/storybook.js";
import tailwindConfig from "./configuration/tailwind.js";
import typescriptEslintConfig from "./configuration/typescript.js";
import unicornGapConfig from "./configuration/unicornGap.js";
import vitestGapConfig from "./configuration/vitestGap.js";

// --- Main generators ---

/**
 * @typedef {"fullstack" | "backendOnly"} AppType
 */

/**
 * @typedef {object} EslintGapConfigOptions
 * @property {AppType} [appType="fullstack"]
 * @property {boolean} [shouldEnableStorybook=false]
 * @property {boolean} [shouldEnableTypescript=true]
 */

/**
 * Generate slim ESLint config with gap plugins only.
 * Rules handled by oxlint/Biome are auto-disabled via eslint-plugin-oxlint.
 *
 * @param {EslintGapConfigOptions} options
 * @returns {import("eslint").Linter.Config[]}
 */
function generateEslintConfig({
  appType = "fullstack",
  shouldEnableStorybook = false,
  shouldEnableTypescript = true,
}) {
  switch (appType) {
    case "backendOnly": {
      return generateEslintConfigByFeatures({
        shouldEnableCypress: false,
        shouldEnableGraphql: false,
        shouldEnableQuery: false,
        shouldEnableReact: false,
        shouldEnableRouter: false,
        shouldEnableStorybook: false,
        shouldEnableTailwind: false,
        shouldEnableTypescript,
      });
    }
    case "fullstack": {
      return generateEslintConfigByFeatures({
        shouldEnableCypress: true,
        shouldEnableGraphql: false,
        shouldEnableQuery: true,
        shouldEnableReact: true,
        shouldEnableRouter: true,
        shouldEnableStorybook,
        shouldEnableTailwind: true,
        shouldEnableTypescript,
      });
    }
    default: {
      throw new Error(`Invalid app type: ${appType}`);
    }
  }
}

/**
 * @param {object} options
 * @param {boolean} [options.shouldEnableTypescript=true]
 * @param {boolean} [options.shouldEnableCypress=false]
 * @param {boolean} [options.shouldEnableGraphql=false]
 * @param {boolean} [options.shouldEnableReact=true]
 * @param {boolean} [options.shouldEnableStorybook=false]
 * @param {boolean} [options.shouldEnableQuery=false]
 * @param {boolean} [options.shouldEnableRouter=false]
 * @param {boolean} [options.shouldEnableTailwind=false]
 * @returns {import("eslint").Linter.Config[]}
 */
function generateEslintConfigByFeatures({
  shouldEnableCypress = false,
  shouldEnableGraphql = false,
  shouldEnableQuery = false,
  shouldEnableReact = true,
  shouldEnableRouter = false,
  shouldEnableStorybook = false,
  shouldEnableTailwind = false,
  shouldEnableTypescript = true,
}) {
  return [
    // Gap plugins (no oxlint/Biome equivalent) — always on
    perfectionist.configs["recommended-alphabetical"],
    canonicalConfig,
    eslintCoreGapConfig,
    filenameConfig,
    functionNameConfig,
    importGapTypescriptConfig,
    importGapJavascriptConfig,
    pluginChaiFriendly.configs.recommendedFlat,
    promiseGapConfig,
    unicornGapConfig,
    vitestGapConfig,

    // Feature-flagged gap plugins
    shouldEnableReact ? reactGapConfig : undefined,
    shouldEnableTypescript ? typescriptEslintConfig : undefined,
    shouldEnableCypress ? cypressConfig : undefined,
    shouldEnableGraphql ? graphqlConfig : undefined,
    shouldEnableStorybook ? getStorybookConfig() : undefined,
    shouldEnableQuery
      ? [...pluginQuery.configs["flat/recommended"]]
      : undefined,
    shouldEnableRouter
      ? [...pluginRouter.configs["flat/recommended"]]
      : undefined,
    shouldEnableTailwind ? tailwindConfig : undefined,

    // This package's own config files: relax import resolution
    // (some plugins use non-standard exports that the resolver can't find)
    {
      files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
      languageOptions: { globals: globals.node },
      rules: { "import/no-unresolved": 0 },
    },

    // Must be last: auto-disable ESLint rules that oxlint handles
    ...oxlint.buildFromOxlintConfigFile(".oxlintrc.json"),
  ]
    .filter((c) => c !== undefined)
    .flat();
}

/** @type {import("eslint").Linter.Config[]} */
const baseConfig = generateEslintConfig({
  appType: "fullstack",
  shouldEnableTypescript: true,
});

export { generateEslintConfig, generateEslintConfigByFeatures };
export default baseConfig;
