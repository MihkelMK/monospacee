import { deLocalizeUrl } from '$lib/paraglide/runtime.js';

export async function load({ url, fetch }) {
	const slug = deLocalizeUrl(url).pathname.split('/').at(-1);
	const cueSlugOnLoad = url.searchParams.has('load');

	// If loading post with ?load
	// try setting post as selected recording (if that post has a recording file)
	if (slug && cueSlugOnLoad) {
		const recordingPath = '/recordings/' + slug + '.mp3';
		const recordingExists = await fetch(recordingPath, { method: 'HEAD' }).then((res) => {
			return res.status === 200 || res.status === 204;
		});

		if (recordingExists) {
			return {
				url: url.pathname,
				selected: recordingPath
			};
		}
	}

	return {
		url: url.pathname
	};
}
