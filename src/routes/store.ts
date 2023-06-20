import type { Cue } from '$lib/types';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const selectedRecording = writable('2023-06-08');

export const selectedCue: Writable<Cue> = writable();
