// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "tailwindcss";
// import { nodePolyfills } from "vite-plugin-node-polyfills";

// export default defineConfig({
//   plugins: [
//     react(),
//     nodePolyfills({
//       globals: {
//         Buffer: true, // Ensure Buffer is polyfilled
//         global: true,
//         process: true,
//       },
//       protocolImports: true, // Add support for `node:` protocol imports
//     }),
//   ],
//   css: {
//     postcss: {
//       plugins: [tailwindcss()],
//     },
//   },
// });



// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "tailwindcss";
// import { nodePolyfills } from "vite-plugin-node-polyfills";
// import path from "path";

// // Helper function to resolve relative paths
// const resolvePath = (p) => path.resolve(__dirname, p);

// export default defineConfig({
//   plugins: [
//     react(),
//     nodePolyfills({
//       globals: {
//         Buffer: true,
//         global: true,
//         process: true,
//       },
//       protocolImports: true,
//     }),
//   ],
//   css: {
//     postcss: {
//       plugins: [tailwindcss()],
//     },
//   },
//   resolve: {
//     alias: {
//       // These aliases allow you to use absolute paths in your imports
//       "@": resolvePath("src"),
//       "@assets": resolvePath("src/assets"),
//       "@components": resolvePath("src/components"),
//       "@styles": resolvePath("src/pages"),
//       "@howler": resolvePath("src/howler"),
//     },
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';

// Helper function to resolve relative paths
const resolvePath = (p) => path.resolve(__dirname, p);

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    wasm(),
    topLevelAwait(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@': resolvePath('src'),
      '@assets': resolvePath('src/assets'),
      '@components': resolvePath('src/components'),
      '@styles': resolvePath('src/pages'),
      '@howler': resolvePath('src/howler'),
      'ansem-wasm': resolvePath('wasm-ansem-fight/pkg'), // Add this line for aliasing ansem-wasm
    },
  },
});
