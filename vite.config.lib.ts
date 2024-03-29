
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
    envPrefix: 'APP_',

    plugins: [
      dts(),
    ],

    build: {
      outDir: './dist/lib',

      lib: {
        entry: './src/autoresize.ts',
        name: 'autoresize',
        fileName: () => 'autoresize.js'
      },
    }
  };
});
