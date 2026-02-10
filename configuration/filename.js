import checkFile from "eslint-plugin-check-file";

/** @type {import("eslint").Linter.Config} */
const filenameConfig = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: { "check-file": checkFile },
  rules: {
    "check-file/filename-naming-convention": [
      "error",
      { "src/components/**/!(*index).{jsx,tsx}": "PASCAL_CASE" },
    ],
  },
};

export default filenameConfig;
