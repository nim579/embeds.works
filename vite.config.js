import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { A } from 'brotli/build/encode';

export default defineConfig(() => {
  return {
    plugins: [
      vue(),

      svgLoader({
        svgoConfig: {
          plugins: [{ name: 'removeViewBox', active: false }]
        }
      })
    ],

    resolve: {
      extensions: ['.vue', '.js', '.json']
    },

    build: {
      outDir: './dist',
      assetsDir: './static',

      rollupOptions: {
        output: {
          manualChunks(alias) {
            if (alias.indexOf('brotli-compress') > -1) return 'brotli';
            return null;
          }
        }
      }
    }
  };
});
