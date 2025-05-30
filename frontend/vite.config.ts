import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';

export default defineConfig({
	plugins: [sveltekit(), imagetools()],
	build: {
		rollupOptions: {
			external: ['@resvg/resvg-js']
		}
	}
});
