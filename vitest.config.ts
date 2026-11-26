/// <reference types="vitest/config" />

import path from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
  test: {},
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
