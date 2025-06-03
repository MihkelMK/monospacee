import { error } from '@sveltejs/kit';
import type { Cue } from '$lib/types.js';
import { getLocale } from '$lib/paraglide/runtime';

export async function load({ params, fetch, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});

	try {
		let post;

		if (getLocale() === 'en') {
			try {
				post = await import(`../../posts/en/${params.slug}.md`);
			} catch {
				console.log('No english .md for ' + params.slug + '. Defaulting to estonian.');
				post = await import(`../../posts/${params.slug}.md`);
			}
		} else {
			post = await import(`../../posts/${params.slug}.md`);
		}

		if (!post.metadata.recording) {
			return {
				content: post.default,
				meta: post.metadata
			};
		}

		const cueResponse = await fetch(`/api/cues/${params.slug}.cue`);
		const cue: Promise<Cue> = cueResponse.json();

		return {
			content: post.default,
			meta: post.metadata,
			streamed: {
				postCue: cue
			}
		};
	} catch {
		throw error(404, `Could not find ${params.slug}_${getLocale()}`);
	}
}
