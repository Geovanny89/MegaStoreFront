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
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
    ],
  },
  build: {
    cssCodeSplit: true,
  },
});

