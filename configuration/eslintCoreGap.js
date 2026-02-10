/** @type {import("eslint").Linter.Config} */
const eslintCoreGapConfig = {
  rules: {
    "consistent-return": 2,
    "func-name-matching": 2,
    "logical-assignment-operators": 2,
    "no-implicit-globals": 2,
    "no-implied-eval": 2,
    "no-octal-escape": 2,
    "no-restricted-syntax": [
      "warn",
      {
        message: "Avoid classes (except for those extending Error)",
        selector: "ClassDeclaration[superClass.name!='Error']",
      },
      {
        message: "Avoid classes (except for those extending Error)",
        selector: "ClassExpression[superClass.name!='Error']",
      },
    ],
    "no-undef": 2,
    "no-undef-init": 2,
    "no-unmodified-loop-condition": 2,
    "no-unreachable": 2,
    "no-unreachable-loop": 2,
    "object-shorthand": 2,
    "prefer-arrow-callback": [2, { allowNamedFunctions: true }],
    "prefer-named-capture-group": 2,
    "prefer-regex-literals": 2,
    "require-atomic-updates": 2,
    "spaced-comment": 2,
  },
};

export default eslintCoreGapConfig;
