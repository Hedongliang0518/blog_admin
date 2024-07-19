import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      eslintPlugin({
        cache: false, // 关闭eslint缓存，在开发过程中更实时的反馈
        include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"], // 包含的文件
        exclude: ["node_modules"], // 排除的文件
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true, // 支持内联 JavaScript
          additionalData: '@import "./src/assets/global.less";', // 引入多个文件以；分割
          modifyVars: {}, // 重写 ant design的 less 变量，定制样式,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      // 代理
      proxy: {
        [env.VITE_BASE_API]: {
          target: "http://localhost:8989",
          changeOrigin: true,
          disableHostCheck: true,
          rewrite: (path) => env.VITE_ENV === 'development' ? path.replace(/^\/dev-api/, '') : path.replace(/^\/prod-api/, '')
        },
      },
    },
  };
});
