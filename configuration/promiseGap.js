// Promise rules not supported by oxlint — must stay in ESLint.

import promisePlugin from "eslint-plugin-promise";

/** @type {import("eslint").Linter.Config} */
const promiseGapConfig = {
  plugins: { promise: promisePlugin },
  rules: { "promise/no-return-in-finally": 2 },
};

export default promiseGapConfig;
