import * as path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // node_modules 패키지를 vendor 청크로 분리
          if (id.includes("node_modules")) {
            // React 관련 라이브러리
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router") ||
              id.includes("scheduler")
            ) {
              return "react-vendor";
            }
            // Radix UI 라이브러리
            if (id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            // 기타 라이브러리
            return "vendor";
          }

          // shared/ui 를 하나의 청크로 묶어서 순환 참조 방지 및 캐싱 효율화
          if (id.includes("src/shared/ui")) {
            return "shared-ui";
          }
        },
      },
    },
  },
  plugins: [react(), EnvironmentPlugin(["REACT_APP_TEXT"])],
  publicDir: "public",
  server: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
