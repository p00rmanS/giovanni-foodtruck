import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'

const root = fileURLToPath(new URL('.', import.meta.url))

// Absolute URLs are required for og:image / twitter:image / JSON-LD (link-preview
// crawlers ignore relative ones). The host injects its own URL at build time; set
// SITE_URL to override, e.g. once the real domain is connected.
function resolveSiteUrl() {
  const env = process.env
  // Netlify: production builds use the primary (custom) domain; previews use their own URL.
  const netlify =
    env.CONTEXT && env.CONTEXT !== 'production'
      ? env.DEPLOY_PRIME_URL || env.URL
      : env.URL || env.DEPLOY_PRIME_URL
  // Vercel: production uses the project's production domain; previews use their own hostname.
  const vercel =
    env.VERCEL_ENV === 'production'
      ? env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
      : env.VERCEL_URL || env.VERCEL_PROJECT_PRODUCTION_URL
  let site = env.SITE_URL || netlify || vercel || 'https://giovannisshrimptruck.com'
  if (!/^https?:\/\//.test(site)) site = `https://${site}`
  return site.replace(/\/+$/, '')
}

function siteUrlPlugin() {
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', resolveSiteUrl())
    },
  }
}

export default defineConfig({
  plugins: [siteUrlPlugin()],
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
