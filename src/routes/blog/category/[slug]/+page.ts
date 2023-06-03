import type { Post } from '$lib/types';
import type { PageLoad } from './$types.js';

export const load = (async ({ fetch, params }) => {
	const response = await fetch('/api/posts');
	const posts: Post[] = await response.json();

	posts.filter((post) => params.slug in post.categories);
	return { posts: posts, category: params.slug };
}) satisfies PageLoad;
