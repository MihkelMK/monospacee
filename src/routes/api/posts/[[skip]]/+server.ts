import { json } from '@sveltejs/kit';
import type { Post } from '$lib/types';

async function getPosts(skipTo: number, goTo: number) {
	let posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];


		if (file && typeof file === 'object' && 'metadata' in file) {
			const metadata = file.metadata as Omit<Post, 'date'>;
    const date = path
			.split('/')
			.at(-1)
			?.replace('.md', '')
			.toLowerCase()
			.replace(' ', '-')
			.replace('_', '-');


			const post = { ...metadata, date } satisfies Post;
			post.published && posts.push(post);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	posts = posts.slice(skipTo, goTo);

	return posts;
}

export async function GET({ params }) {
	const skipTo = Number(params.skip) || 0;

	const posts = await getPosts(skipTo, skipTo + 10);

	return json(posts);
}
