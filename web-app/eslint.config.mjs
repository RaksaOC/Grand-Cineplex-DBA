import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variable errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Disable 'any' type errors
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
