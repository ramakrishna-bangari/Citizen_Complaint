import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import oxlint from "vite-plugin-oxlint";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  envPrefix: ["VITE_", "API_", "CLOUDINARY_", "CITIZEN_", "OFFICER_", "ADMIN_"],
  plugins: [
    react(),
    oxlint(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8090",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
