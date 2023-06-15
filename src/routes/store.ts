import { writable, derived } from 'svelte/store';

export const selectedRecording = writable('latest');

// export const selectedRecordingData = derived(selectedRecording, (selectedRecording) => {

// });
