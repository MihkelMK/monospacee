import { getLocale } from '$lib/paraglide/runtime.js';
import { error } from '@sveltejs/kit';

export async function load({ fetch, setHeaders }) {
	try {
		const response = await fetch(`/api/posts?end=10&lang=${getLocale()}`);
		const { posts, nextFrom } = await response.json();

		setHeaders({
			'cache-control': 'public, immutable, no-transform, max-age=3600'
		});

		return { posts, nextFrom };
	} catch {
		throw error(500, 'Error while fetching posts');
	}
}
