import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/presentation"),
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor"; // Dynamically split vendor libraries
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust chunk size warning limit
  },
});
