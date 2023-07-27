import type { Cue, Post, PostType, RecordingData } from '$lib/types';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const feed: Writable<Post[]> = writable([]);

export const recordingPlaying: Writable<boolean> = writable(false);

export const selectedRecording: Writable<string> = writable(
	fromLocalStorage('selectedRecording', '2023-06-30')
);
toLocalStorage(selectedRecording, 'selectedRecording');

export const selectedCue: Writable<Cue> = writable();

export const cueJump: Writable<number | undefined> = writable(undefined);

export const streamingData: Writable<Record<string, RecordingData>> = writable(
	fromLocalStorage('streamingData', {
		[fromLocalStorage('selectedRecording', '2023-06-30') as string]: {
			progress: 0
		}
	}) as Record<string, RecordingData>
);
toLocalStorage(streamingData, 'streamingData');

export const visiblePostTypes: Writable<PostType[]> = writable(['project', 'event', 'stream']);

// Get value from localStorage if in browser and the value is stored, otherwise fallback
function fromLocalStorage(
	storageKey: string,
	fallbackValue: string | Record<string, RecordingData>
) {
	if (browser) {
		const storedValue = window.localStorage.getItem(storageKey);
		if (storedValue !== 'undefined' && storedValue !== null) {
			return typeof fallbackValue === 'object'
				? (JSON.parse(storedValue) as Record<string, RecordingData>)
				: storedValue;
		}
	}

	return fallbackValue;
}

function toLocalStorage(
	store: Writable<string | Record<string, RecordingData>>,
	storageKey: string
) {
	if (browser) {
		store.subscribe((value) => {
			const storageValue = typeof value === 'object' ? JSON.stringify(value) : value;

			window.localStorage.setItem(storageKey, storageValue);
		});
	}
}
