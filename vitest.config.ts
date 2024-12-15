/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import path from "node:path";
export default defineConfig({
	test: {},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
