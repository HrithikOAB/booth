import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Booth kiosk app. Videos are served from /public/videos (symlinks to /Videos).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
    // Large local mp4s are referenced by URL, never bundled/inlined.
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (/@xyflow|@dagrejs|d3-/.test(id)) return "vendor-flow";
            if (/framer-motion|motion-dom|motion-utils/.test(id)) return "vendor-motion";
            if (/react-router|\/react-dom\/|\/react\/|scheduler/.test(id)) return "vendor-react";
          }
          if (id.includes("/src/data/registry/")) return "registry";
        },
      },
    },
  },
});
