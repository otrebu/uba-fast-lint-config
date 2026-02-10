import eslintPluginUnicorn from "eslint-plugin-unicorn";

/** @type {import("eslint").Linter.Config} */
const unicornGapConfig = {
  plugins: { unicorn: eslintPluginUnicorn },
  rules: {
    "unicorn/consistent-destructuring": 2,
    "unicorn/no-array-push-push": 2,
    "unicorn/no-for-loop": 2,
    "unicorn/prefer-export-from": 2,
    "unicorn/prefer-json-parse-buffer": 2,
    "unicorn/prefer-module": 2,
    "unicorn/prefer-switch": 2,
    "unicorn/prefer-ternary": 2,
    "unicorn/prevent-abbreviations": [
      2,
      {
        allowList: {
          args: true,
          buildDir: true,
          ctx: true,
          db: true,
          Db: true,
          defaultDir: true,
          dir: true,
          dist: true,
          distDir: true,
          docs: true,
          env: true,
          Env: true,
          outDir: true,
          params: true,
          props: true,
          ref: true,
          root: true,
          rootDir: true,
          src: true,
          srcDir: true,
          toolsDir: true,
          util: true,
          Util: true,
          utils: true,
          Utils: true,
        },
        replacements: { err: { error: true } },
      },
    ],
    "unicorn/relative-url-style": 2,
    "unicorn/template-indent": 2,
  },
};

export default unicornGapConfig;
