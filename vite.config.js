import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    target: browserslistToEsbuild(),
    lib: {
      entry: 'src/index.js',
      name: packageJson.name,
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
