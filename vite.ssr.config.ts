import { defineConfig } from "vite"
const ext = ["axios"]
export default defineConfig({
  build: { ssr: true, outDir: ".ssrtmp", rollupOptions: { external: ext }, rolldownOptions: { external: ext } },
})
