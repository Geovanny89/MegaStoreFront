import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",

        manualChunks(id) {
          if (id.includes("node_modules")) {

            // ✅ React SIEMPRE junto (CRÍTICO)
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react/jsx-runtime")
            ) {
              return "vendor-react";
            }

            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("framer-motion")) return "vendor-animations";

            return "vendor-others";
          }
        },
      },
    },
  },
});
