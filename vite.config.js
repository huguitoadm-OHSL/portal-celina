import process from "node:process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.CRM_SYNTHETIC_LOCAL === "1"
      ? [(await import("./server/crm/devPlugin.js")).crmDevPlugin()]
      : []),
  ],
});
