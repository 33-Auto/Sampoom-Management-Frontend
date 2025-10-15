// ./steiger.config.js
import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/no-segmentless-slices': 'off',
      'fsd/insignificant-slice': 'off',
      'fsd/no-reserved-folder-names': 'off',
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    // disable the `public-api` rule for files in the Shared layer
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },
])
