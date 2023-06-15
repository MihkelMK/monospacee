import type { Post } from '$lib/types.js';
import type { PageLoad } from './$types.js';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/posts');
	const posts: Post[] = response.json();

	const lazyResponse = await fetch('/api/posts/10');
	const lazyPosts: Post[] = lazyResponse.json();
	return { posts: posts, lazy: { posts: lazyPosts } };
}) satisfies PageLoad;
