import cypressPlugin from "eslint-plugin-cypress/flat";
import globals from "globals";

/** @type {import("eslint").Linter.Config} */
const cypressConfig = {
  files: ["cypress/**/*.ts", "cypress/**/*.tsx", "**/*.test.tsx"],
  languageOptions: {
    globals: {
      assert: false,
      chai: false,
      cy: false,
      Cypress: false,
      expect: false,
      ...globals.browser,
      ...globals.mocha,
    },
  },
  plugins: { cypress: cypressPlugin },
  rules: {
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-assigning-return-values": "error",
    "cypress/no-async-tests": "error",
    "cypress/no-force": "warn",
    "cypress/no-pause": "error",
    "cypress/no-unnecessary-waiting": "error",
  },
};

export default cypressConfig;
