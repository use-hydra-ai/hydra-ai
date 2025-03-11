import nextJsConfig from "@tambo-ai/eslint-config/next-js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...nextJsConfig,
  { ignores: [".source/"] },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [],
        },
      },
    },
  },
);
