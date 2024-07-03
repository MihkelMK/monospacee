import { audioStore } from '$lib/store.svelte';
import type { Cue } from '$lib/types';

export async function load({ url, fetch }) {
	const getCue = async (selectedRecording: string | null) => {
		if (typeof window === 'undefined' || !selectedRecording) return;

		const slug = selectedRecording.split('/').slice(-1)[0].split('.')[0];
		const cueRes = await fetch(`/api/cues/${slug}.cue`);
		const cueData: Cue = await cueRes.json();
		return cueData;
	};

	let cue: Cue;

	if (audioStore.selectedRecording === '/human-music.mp3') {
		cue = {
			slug: 'human-music.mp3',
			songs: [{ artist: 'Them', title: 'Human Music', start: 0 }]
		};
	} else {
		cue = await getCue(audioStore.selectedRecording);
	}

	return {
		url: url.pathname,
		cue: cue
	};
}
