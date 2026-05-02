/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30000,
    hookTimeout: 60000,
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    // Run unit tests first (fast), then integration (slow, needs server)
    sequence: {
      sortable: true,
    },
  },
})
