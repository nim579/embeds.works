
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      outDir: './dist/lib',

      lib: {
        entry: 'src/autoresize.js',
        name: 'autoresize',
        fileName: () => 'autoresize.js'
      },
    }
  };
});
