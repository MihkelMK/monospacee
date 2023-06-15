import type { Post } from '$lib/types';

export async function load({ fetch, params }) {
	const response = await fetch('/api/posts');
	const posts: Post[] = await response.json();

	posts.filter((post) => params.tag in post.categories);
	return { posts: posts, category: params.tag };
}
