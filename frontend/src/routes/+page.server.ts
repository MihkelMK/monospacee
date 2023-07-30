import { error } from '@sveltejs/kit';

export async function load({ fetch, setHeaders }) {
	try {
		const response = await fetch('/api/posts?end=10');
		const { posts, nextFrom } = await response.json();

		setHeaders({
			'cache-control': 'public, immutable, no-transform, max-age=3600'
		});

		return { posts, nextFrom };
	} catch (err) {
		throw error(500, 'Error while fetching posts');
	}
}