import type { Post } from '$lib/types.js';

export async function load({ fetch }) {
	const response = await fetch('/api/posts');
	const posts: Post[] = response.json();

	const lazyResponse = await fetch('/api/posts/10');
	const lazyPosts: Post[] = lazyResponse.json();
	return { posts: posts, lazy: { posts: lazyPosts } };
}
