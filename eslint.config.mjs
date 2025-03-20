import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: pluginReact,
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
