import { json } from '@sveltejs/kit';
import type { Post } from '$lib/types';

function getPosts(lang: string) {
	let posts: Post[] = [];
	let paths;

	if (lang === 'et') {
		paths = import.meta.glob('/src/posts/*.md', { eager: true });
	} else {
		paths = import.meta.glob('/src/posts/en/*.md', { eager: true });
	}

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
				.replace('_', '-') as string;

			const post = { ...metadata, date } satisfies Post;
			posts.push(post);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export function GET({ url, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});

	const lang = url.searchParams.get('lang') || 'et';
	const start = Number(url.searchParams.get('start')) || 0;
	const end = Number(url.searchParams.get('end')) || 0;

	const allPosts = getPosts(lang);
	const posts = allPosts.slice(start, end > 0 ? end : undefined);

	const nextIdx = start + posts.length;
	const nextFrom = nextIdx < allPosts.length ? nextIdx : null;

	return json({ posts, nextFrom });
}
