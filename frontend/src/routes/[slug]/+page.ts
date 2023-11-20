import { error } from '@sveltejs/kit';
import type { Cue } from '$lib/types.js';

export async function load({ params, fetch, setHeaders }) {
		setHeaders({
			'cache-control': 'max-age=60'
		});

	try {
		const post = await import(`../../posts/${params.slug}.md`);

    if (!post.metadata.recording) {
      return {
        content: post.default,
        meta: post.metadata
      }
    }

		const cueResponse = await fetch(`/api/cues/${params.slug}.cue`);
		const cue: Cue = cueResponse.json();

		return {
			content: post.default,
			meta: post.metadata,
			cue: cue
		};
	} catch (_err) {
		throw error(404, `Could not find ${params.slug}`);
	}
}
