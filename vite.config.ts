import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import svgLoader from 'vite-svg-loader'
// import type { Plugin } from "rollup"
// import fs from "fs"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  define: {
    _APP_VERSION: JSON.stringify(pkg.version),
  }
})
