import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import prerender from "vite-plugin-prerender"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    prerender({
      staticDir: path.resolve(__dirname, 'dist'),
      routes: [
        '/',
        '/showroom',
        '/sell-your-car',
        '/finance',
        '/about',
        '/compliments-complaints',
        '/404',
      ],
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html.replace(
          /href="\.\//g,
          'href="/'
        );
        return renderedRoute;
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'recharts'],
        },
      },
    },
  },
});
