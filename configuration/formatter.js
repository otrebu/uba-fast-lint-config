// Biome formatter configuration generator
// Replaces Prettier with equivalent Biome settings
//
// GAPS (no Biome equivalent):
// - prettier-plugin-packagejson: sorts package.json keys.
//   Workaround: use `npx sort-package-json` as a pre-commit hook or CI step.
//   Biome has no built-in package.json key sorting.
//
// - prettier-plugin-tailwindcss: sorts Tailwind CSS classes in JSX/HTML.
//   Workaround: use `eslint-plugin-tailwindcss` with rule
//   "tailwindcss/classnames-order" (already included in ESLint gap config).
//   Biome has no built-in Tailwind class sorting.
//
// - embeddedLanguageFormatting: Biome does not yet format embedded languages
//   inside template literals (e.g. css`...`, html`...`, graphql`...`).
//   Workaround: none. Embedded code stays unformatted until Biome adds support.

const BASE_FORMATTER_CONFIG = {
  expand: "never",
  indentStyle: "space",
  indentWidth: 2,
  lineEnding: "lf",
  lineWidth: 80,
};

const JAVASCRIPT_FORMATTER_CONFIG = {
  arrowParentheses: "always",
  bracketSpacing: true,
  quoteProperties: "asNeeded",
  quoteStyle: "double",
  semicolons: "always",
  trailingCommas: "all",
};

/**
 * Generate Biome formatter config matching the original Prettier settings.
 *
 * @param {object} options
 * @param {"fullstack" | "backend" | "library"} [options.appType="fullstack"]
 * @returns {object} Biome-compatible formatter configuration object
 */
function generateBiomeFormatterConfig({ appType = "fullstack" } = {}) {
  const config = {
    css: { formatter: { enabled: true, indentWidth: 2 } },
    formatter: { enabled: true, ...BASE_FORMATTER_CONFIG },
    html: { formatter: { enabled: true, whitespaceSensitivity: "css" } },
    javascript: { formatter: { ...JAVASCRIPT_FORMATTER_CONFIG } },
    json: {
      formatter: {
        enabled: true,
        // Keep JSON expanded for readability (package.json, tsconfig, etc.)
        expand: "always",
        indentWidth: 2,
      },
    },
  };

  // Document gaps that depend on appType
  const gaps = [];

  gaps.push({
    description: "package.json key sorting",
    plugin: "prettier-plugin-packagejson",
    workaround: "Use `npx sort-package-json` in pre-commit hook or CI",
  });

  if (appType === "fullstack") {
    gaps.push({
      description: "Tailwind CSS class sorting in JSX/HTML",
      plugin: "prettier-plugin-tailwindcss",
      workaround:
        "Use eslint-plugin-tailwindcss with classnames-order rule (included in ESLint gap config)",
    });
  }

  return { config, gaps };
}

export default generateBiomeFormatterConfig;
export { generateBiomeFormatterConfig };
