import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      srcDir: "src",
      filename: "service-worker.js",
      strategies: "generateSW",

      manifest: {
        name: "OurReading",
        short_name: "OurReading",
        theme_color: "#46cdcf",
        icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
      },

      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
