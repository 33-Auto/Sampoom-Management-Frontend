import { defineConfig } from "eslint/config";
import tsPrefixer from "eslint-config-ts-prefixer";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  {
    ignores: [
      "**/.vscode",
      "**/node_modules",
      "**/build",
      "**/dist",
      "**/.github",
      "**/.idea",
      "public/mockServiceWorker.js",
    ],
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
    },
  },
  ...tsPrefixer,
]);
