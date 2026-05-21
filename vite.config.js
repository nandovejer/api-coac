import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync } from 'fs';

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
  plugins: [
    {
      name: 'copy-static-data',
      closeBundle() {
        // Copy JSON data files so the API endpoints work in production
        cpSync(resolve(__dirname, 'data'), resolve(__dirname, 'dist/data'), { recursive: true });
      },
    },
  ],
});
