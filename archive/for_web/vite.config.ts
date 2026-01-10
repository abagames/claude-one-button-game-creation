import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development' || process.env.BUILD_MODE === 'dev';

  return {
    base: isDev ? '/' : '/web-coding-agent-game-dev/',
    root: isDev ? 'dev' : '.',
    build: {
      outDir: isDev ? 'dist' : '../docs',
      emptyOutDir: true,
      rollupOptions: isDev ? undefined : {
        input: {
          main: resolve(__dirname, 'index.html'),
          // Add completed games here for GitHub Pages
          // example: resolve(__dirname, 'games/example/index.html'),
        }
      }
    }
  }
})
