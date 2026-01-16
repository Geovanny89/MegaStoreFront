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
  resolve: {
    alias: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "lucide-react"],
  },
  build: {
    // 'es2020' es seguro para iPhones con iOS 13.4 o superior (el 98% del mercado)
    // Esto elimina los polyfills basura pero mantiene la compatibilidad necesaria.
    target: 'es2020', 
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // ESTO ES CLAVE: Divide el archivo de 2MB en trozos pequeños
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; 
          }
        },
      },
    },
  },
});