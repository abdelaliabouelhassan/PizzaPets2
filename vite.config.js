/* eslint-disable no-undef */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import inject from '@rollup/plugin-inject'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ['vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      buffer: 'buffer'
    }
  },
  server: {
    host: "127.0.0.1",
  },
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      external: [],
      output: {},
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        }),
        NodeModulesPolyfillPlugin(),
        inject({
          Buffer: ['buffer', 'Buffer']
        })
      ]
    },
    sourcemap: false,
    minify: true
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ],
      define: {
        global: 'globalThis'
      }
    }
  }
})
