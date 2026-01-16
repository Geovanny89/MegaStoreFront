// import { defineConfig } from "vite";

// import react from "@vitejs/plugin-react";

// import tailwindcss from "@tailwindcss/vite";



// export default defineConfig({

//   plugins: [

//     react(),

//     tailwindcss(),

//   ],

// });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   // Añade esto para forzar la resolución de React
//   resolve: {
//     alias: {
//       "react": "react",
//       "react-dom": "react-dom",
//     },
//   },
//   optimizeDeps: {
//     // Esto asegura que estas librerías se procesen juntas
//     include: [
//       "react", 
//       "react-dom", 
//       "react-router-dom", 
//       "lucide-react", 
//       "@heroicons/react/24/outline" // Si usas icons específicos
//     ],
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    target: "esnext",
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser', // Terser suele comprimir mejor que esbuild para producción
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.logs para ahorrar espacio
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Esta es la clave: Separa las librerías en archivos distintos
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Agrupa todas las dependencias de react en un chunk
            if (id.includes('react')) return 'vendor-react';
            // Agrupa librerías de analítica
            if (id.includes('react-ga4') || id.includes('react-facebook-pixel')) return 'vendor-analytics';
            // El resto de node_modules
            return 'vendor';
          }
        },
        // Mejora los nombres de los archivos para mejor caché
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000, // Sube el límite de aviso ya que estamos controlando los chunks
  },
});
