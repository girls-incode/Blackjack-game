import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    // Node CLI bundle rather than a browser app.
    ssr: "src/main.ts",
    target: "node22",
    outDir: "dist",
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
