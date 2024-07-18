import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
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
    // 端口
    port: 5173,
    // 是否开启https服务
    https: false,
    // 代理
    proxy: {
      // '/project/delete': {
      //   target: 'https://www.your-request-url.com',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/project\/delete/, ''),
      // },
    },
  },
});
