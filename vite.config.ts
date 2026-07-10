import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// CORS 우회용 dev 프록시.
// 브라우저는 같은 출처(localhost)로 요청하고, Vite 가 백엔드로 대신 전달한다.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_PROXY_TARGET ?? "http://13.125.246.1:8080";

  // 백엔드 API 경로 접두사들
  const apiPaths = [
    "/auth",
    "/members",
    "/todos",
    "/calendar",
    "/categories",
    "/statistics",
  ];
  const proxy = Object.fromEntries(
    apiPaths.map((p) => [p, { target, changeOrigin: true }]),
  );

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
  };
});
