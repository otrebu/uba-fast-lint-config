import tailwindPlugin from "eslint-plugin-tailwindcss";

/** @type {import("eslint").Linter.Config} */
const tailwindConfig = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: { tailwindcss: tailwindPlugin },
  rules: {
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/enforces-negative-arbitrary-values": "warn",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-contradicting-classname": "error",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-unnecessary-arbitrary-value": "warn",
  },
};

export default tailwindConfig;
