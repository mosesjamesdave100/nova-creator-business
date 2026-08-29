import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built assets resolve correctly whether this is
  // served from a domain root or a GitHub Pages project subpath
  // (https://<user>.github.io/<repo>/) - combined with HashRouter, the app
  // is fully relocatable without any deploy-specific config.
  base: './',
  plugins: [react(), tailwindcss()],
})
