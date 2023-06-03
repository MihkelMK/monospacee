export const prerender = true;

import type { LayoutLoad } from './$types.js';

export const load = (async ({ url }) => {
	return {
		url: url.pathname
	};
}) satisfies LayoutLoad;
