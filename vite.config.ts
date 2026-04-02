import { sveltekitOG } from '@ethercorps/sveltekit-og/plugin';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  css: { preprocessorOptions: { scss: { quietDeps: true } } },
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
});
