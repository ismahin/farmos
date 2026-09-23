import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    ignores: ["dist/**", "coverage/**", "drizzle/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-restricted-imports": ["error", {
        "patterns": [
          { "group": ["../../modules/*/infrastructure/*", "../../../modules/*/infrastructure/*"], "message": "Use a module public contract." },
          { "group": ["**/apps/web/**"], "message": "Backend code must not depend on frontend code." }
        ]
      }]
    }
  },
  {
    files: ["src/**/*.module.ts", "src/app.module.ts"],
    rules: { "@typescript-eslint/no-extraneous-class": "off" }
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/restrict-template-expressions": "off"
    }
  }
);
