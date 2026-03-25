import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/insignificant-slice": "off",
      "fsd/excessive-slicing": "off",
      "fsd/no-segmentless-slices": "off",
      "fsd/inconsistent-naming": "off",
      "fsd/segments-by-purpose": "off",
    },
  },
  {
    files: ["./src/shared/**"],
    rules: { "fsd/public-api": "off" },
  },
]);
