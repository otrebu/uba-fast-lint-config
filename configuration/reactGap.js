import react from "eslint-plugin-react";

/**
 * React rules NOT covered by oxlint.
 *
 * Rules that oxlint handles are in .oxlintrc.json and auto-disabled via
 * eslint-plugin-oxlint. This config contains only the gap — rules oxlint
 * hasn't implemented yet.
 *
 * NOTE: react/style-prop-object is "off" in the original config but oxlint
 * defaults it to "error". It must be set to "off" in .oxlintrc.json to match.
 */

/** @type {import("eslint").Linter.Config} */
const reactGapConfig = {
  files: ["**/*.tsx", "**/*.jsx"],
  plugins: { react },
  rules: {
    // --- CRITICAL ---

    "react/boolean-prop-naming": [
      2,
      { rule: "^(is|has|should|can|did|will|must)[A-Z]([A-Za-z0-9])" },
    ],
    "react/destructuring-assignment": [2, "always"],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
        unamedComponents: "arrow-function",
      },
    ],
    "react/hook-use-state": 2,
    "react/jsx-no-constructed-context-values": 2,

    // --- MAJOR ---

    "react/jsx-no-leaked-render": 2,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/no-adjacent-inline-elements": 2,
    "react/no-deprecated": 2,

    // --- MINOR ---

    "react/no-did-update-set-state": 2,
    "react/no-invalid-html-attribute": 2,
    "react/no-object-type-as-default-prop": 2,
    "react/no-typos": 2,
    "react/no-unstable-nested-components": 2,
    "react/no-unused-class-component-methods": 2,
    "react/no-unused-prop-types": 2,
    "react/no-unused-state": 2,
    "react/prop-types": 2,
    "react/sort-prop-types": 2,
  },
  settings: { react: { version: "detect" } },
};

export default reactGapConfig;
