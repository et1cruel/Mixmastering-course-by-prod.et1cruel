import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // relative paths: GitHub Pages project subpath + custom domain ใช้ได้หมด
  base: './',
  plugins: [react()],
})
