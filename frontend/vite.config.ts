import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@mantine/core", "react-hot-toast"],
  },
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    sourcemap: false,
    minify: "terser",
    cssMinify: true,
  },
});
