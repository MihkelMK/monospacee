<script lang="ts">
	import { audioStore } from '$lib/store.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (audioStore.selectedRecording !== '/human-music.mp3') {
			audioStore.isPlaying = false;
			audioStore.setRecording('/human-music.mp3');
		}
	});
</script>

<h2>Fill that awkward silence</h2>

<style>
	h2 {
		margin-block: 5rem 2rem;
		margin-inline: auto;
		width: fit-content;
		text-align: center;
	}
</style>
