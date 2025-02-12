import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "swiper/react",
      "swiper/modules",
      "swiper/css",
      "swiper/css/navigation",
      "swiper/css/pagination",
      "swiper/css/autoplay",
    ],
  },
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000,
  },
});
