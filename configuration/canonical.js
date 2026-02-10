import canonicalPlugin from "eslint-plugin-canonical";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").Linter.Config} */
const canonicalConfig = {
  plugins: { canonical: canonicalPlugin },
  rules: {
    "canonical/prefer-import-alias": [
      2,
      {
        aliases: [
          {
            alias: "@/",
            // __dirname once installed as a package: /node_modules/uba-fast-lint-config/configuration/
            matchParent: resolve(__dirname, "../../../../src"),
            matchPath: "^src\\/",
          },
          { alias: "@/", matchPath: "^src\\/", maxRelativeDepth: 2 },
        ],
      },
    ],
  },
};

export default canonicalConfig;
