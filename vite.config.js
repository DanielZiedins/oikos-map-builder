import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        growth: resolve(__dirname, 'growth.html'),
        connect: resolve(__dirname, 'connect.html'),
      },
    },
  },
});
