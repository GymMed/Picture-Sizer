import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isBackendOn = env.VITE_BACKEND === "true";
  const baseUrl = isBackendOn ? "public/" : "/Picture-Sizer/";

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    base: baseUrl,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
