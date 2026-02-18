import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // dove la dist sarà servita dal CMS (URL pubblico)
  // es: https://tuosito.it/dist/...
  base: "/",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    // 1 CSS unico
    cssCodeSplit: false,

    rollupOptions: {
      // forza l’assenza di chunk (niente code splitting)
      inlineDynamicImports: true,

      output: {
        // JS entry con nome fisso
        entryFileNames: "mini3d.js",

        // CSS con nome fisso
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) return "mini3d.css";
          return "assets/[name][extname]";
        },

        // disabilita vendor splitting manuale
        manualChunks: undefined,
      },
    },
  },
});
