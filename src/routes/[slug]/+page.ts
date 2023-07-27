import { error } from '@sveltejs/kit';
import type { Cue } from '$lib/types.js';

export async function load({ params, fetch, setHeaders }) {
	try {
		const post = await import(`../../posts/${params.slug}.md`);

		const cueResponse = await fetch(`/api/cues/${params.slug}.cue`);
		const cue: Cue = cueResponse.json();

		setHeaders({
			'cache-control': 'max-age=60'
		});

		return {
			content: post.default,
			meta: post.metadata,
			cue: cue,
		};
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`);
	}
}
