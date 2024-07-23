/* eslint-disable no-undef */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import inject from '@rollup/plugin-inject'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm';


export default defineConfig({
  plugins: [vue(), wasm()],
  resolve: {
    dedupe: ['vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      buffer: 'buffer'
    }
  },
  server: {
    host: "127.0.0.1",
    hmr: {
      overlay: false
    }
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
    minify: true,
    target: "es2022"
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
      },
      target: "es2022",
    }
  },
  esbuild: {
    target: 'es2022',
  }
})
