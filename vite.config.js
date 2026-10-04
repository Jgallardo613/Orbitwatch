import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api/n2yo': {
        target: 'https://api.n2yo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n2yo/, ''),
      },
    },
  },
});