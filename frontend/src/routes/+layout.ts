export async function load({ url }) {
	let selectedRecording: string = '';

	if (typeof window !== 'undefined') {
		const progressData = JSON.parse(localStorage.getItem('audioProgress') || '{}');
		selectedRecording = progressData['selected'] || '/recordings/2024-06-08.mp3';
	}

	return {
		url: url.pathname,
		selected: selectedRecording
	};
}
