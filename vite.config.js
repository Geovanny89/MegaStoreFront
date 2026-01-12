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
    chunkSizeWarningLimit: 1000, // Subimos un poco el límite
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. Agrupamos TODO lo relacionado con el ecosistema React y librerías base
            // Esto evita que se pierdan las referencias como 'forwardRef'
            if (
              id.includes("react") || 
              id.includes("react-dom") || 
              id.includes("react-router") ||
              id.includes("scheduler")
            ) {
              return "vendor-framework";
            }

            // 2. Iconos aparte (son muchos y suelen ser el problema de peso)
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }

            // 3. El resto de librerías (como framer-motion si la usas)
            return "vendor-others";
          }
        },
      },
    },
  },
});