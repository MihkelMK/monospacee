import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	try {
		const response = await fetch('/api/posts');
		const { posts, nextFrom } = await response.json();

		return { posts, nextFrom };
	} catch (err) {
		throw error(500, 'Error while fetching posts');
	}
}
