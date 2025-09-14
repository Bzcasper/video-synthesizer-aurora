import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@/components/ui/toaster.tsx",
            "@/components/ui/button.tsx",
            "@/components/ui/card.tsx",
          ],
        },
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "esbuild", // Changed from 'terser' to 'esbuild' which is built-in
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
