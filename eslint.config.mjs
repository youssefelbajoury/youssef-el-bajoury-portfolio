import importX from "eslint-plugin-import-x";
import nextConfig from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "import-x": importX,
    },
    settings: {
      "import-x/resolver": {
        typescript: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["app/api/**/route.ts"],
    rules: {
      /*
        lib/env.server.ts holds the only secret-bearing schema in the project.
        It is allowed in a route handler and nowhere else — not in a client
        component, not in a shared module, not in a page. The runtime guard in
        the file is the second line of defence; this is the first.
      */
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/env.server",
              message:
                "lib/env.server.ts is server-only. Import it from a route handler under app/api.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];

export default eslintConfig;
