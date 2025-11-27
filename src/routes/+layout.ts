import { PUBLIC_LATEST_POST } from '$env/static/public';
import { deLocalizeUrl } from '$lib/paraglide/runtime.js';
import type { LoadEvent } from '@sveltejs/kit';

const isValidRecording = async (fetch: LoadEvent['fetch'], slug: string) => {
	const recordingPath = '/recordings/' + slug + '.mp3';
	const recordingExists = await fetch(recordingPath, { method: 'HEAD' }).then((res) => {
		return res.status === 200 || res.status === 204;
	});

	return recordingExists ? recordingPath : undefined;
};

export async function load({ url, fetch }) {
	let recording: string | undefined;

	const slug = deLocalizeUrl(url).pathname.split('/').at(-1);
	const cueSlugOnLoad = url.searchParams.has('load');

	// If loading post with ?load
	// try setting post as selected recording (if that post has a recording file)
	if (slug && cueSlugOnLoad) {
		recording = await isValidRecording(fetch, slug);
	}

	// Provide fallback recording for initial load (when localStorage is empty)
	const fallback = await isValidRecording(fetch, PUBLIC_LATEST_POST);

	return {
		url: url.pathname,
		selected: recording,
		fallback
	};
}
