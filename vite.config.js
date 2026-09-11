import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: root + 'index.html',
        notFound: root + '404.html',
      },
    },
  },
})
