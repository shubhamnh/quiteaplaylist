import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
// import { getExtractedSVG } from "svg-inline-loader"
// import type { Plugin } from "rollup"
// import fs from "fs"

// TODO: remove this once https://github.com/vitejs/vite/pull/2909 gets merged
// Add svgLoader() in plugins
// const svgLoader: (options?: {
//   classPrefix?: string
//   idPrefix?: string
//   removeSVGTagAttrs?: boolean
//   warnTags?: boolean
//   removeTags?: boolean
//   warnTagAttrs?: boolean
//   removingTagAttrs?: boolean
// }) => Plugin = (options?: {}) => {
//   return {
//     name: "vite-svg-patch-plugin",
//     transform: function (code, id) {
//       if (
//         id.endsWith(".svg")
//       ) {
//         const extractedSvg = fs.readFileSync(id, "utf8")
//         return `export default '${getExtractedSVG(extractedSvg, options)}'`
//       }
//       return code
//     }
//   }
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  define: {
    _APP_VERSION: JSON.stringify(pkg.version),
  }
})
