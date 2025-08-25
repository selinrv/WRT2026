import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  server: {
    host: true,          // allow access via LAN / custom domain
    port: 3001,          // your dev port
    allowedHosts: ["wrt2026.com.ua"],
    hmr: {
      protocol: "ws",    // use "wss" if site is HTTPS
      host: "wrt2026.com.ua",
      port: 3001,
    },
  },
});
