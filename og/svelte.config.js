import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	kit: {
		adapter: adapter()
	}
};

export default config;
