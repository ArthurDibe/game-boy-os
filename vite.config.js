import { defineConfig } from 'vite';

export default defineConfig({
  base: '/game-boy-os/',
  server: {
    port: 3000,
    open: true
  }
});
