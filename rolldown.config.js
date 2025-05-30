import {defineConfig} from "rolldown";

export default defineConfig({
  input: "dist/index.js",
  output: {
    file: "dist/index.cjs",
    format: "cjs",
  },
  external: [
    // Only keep Node.js built-in modules as external
    'fs',
    'path',
    'crypto',
    'util'
  ],
  platform: "node",
});
