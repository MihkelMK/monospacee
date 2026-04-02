import { sveltekitOG } from '@ethercorps/sveltekit-og/plugin';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    sveltekitOG(),
    imagetools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'cookie'],
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: '@use "/src/variables.scss" as *;',
      },
    },
  },
});
