import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'index',
      fileName: (format) => `index.${format}.js`
    },
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'react'
        }
      }
    }
  },
  plugins: [reactRefresh()]
})
