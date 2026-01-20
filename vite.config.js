import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'http://leadgen-dev-test.s3-website.us-east-2.amazonaws.com'
})
