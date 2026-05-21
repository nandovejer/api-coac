import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/api-coac/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'martinez-ares': resolve(__dirname, 'authors/martinez-ares/index.html'),
      },
    },
  },
});
