import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig(() => {
  return {
    envPrefix: 'APP_',

    plugins: [
      vue(),

      svgLoader({
        svgoConfig: {
          plugins: [{
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              }
            }
          }]
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
