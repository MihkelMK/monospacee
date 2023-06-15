import { RequestHandler, json } from '@sveltejs/kit';
import type { Post } from '$lib/types';

async function getPosts(skipTo: number, goTo: number) {
	let posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];

		const slug = path
			.split('/')
			.at(-1)
			?.replace('.md', '')
			.toLowerCase()
			.replace(' ', '-')
			.replace('_', '-');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug' | 'date'>;
			const date = metadata.date ?? slug;

			const post = { ...metadata, slug, date } satisfies Post;
			post.published && posts.push(post);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	console.log(skipTo, goTo);

	posts = posts.slice(skipTo, goTo);

	return posts;
}

export const GET = (async ({ params }) => {
	const skipTo = Number(params.skip) || 0;

	const posts = await getPosts(skipTo, skipTo + 10);

	return json(posts);
}) satisfies RequestHandler;
