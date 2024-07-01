<script lang="ts">
	import PageTransition from '../../transition.svelte';
	import { enhance } from '$app/forms';

	export let data;

	import { selectedSearchResult } from '$lib/store';

	import type { SpotifySearchResult } from '$lib/types';
	import { onMount } from 'svelte';
	import Controls from '$lib/components/player/Controls.svelte';

	const playPauseAudio = () => {
		if (audioFile.paused) {
			isPlaying = true;
			audioFile.play();
		} else {
			isPlaying = false;
			audioFile.pause();
		}
	};

	const reloadPlayer = async (selectedSong: SpotifySearchResult) => {
		if (!selectedSong) return;
		let shouldResume = false;

		if (audioFile && !audioFile.paused) {
			shouldResume = true;
			playPauseAudio();
		}

		if (!selectedSong.preview_url) {
			previewUnavailable = true;
			return;
		}

		previewUnavailable = false;
		replaceAudio(selectedSong.preview_url);
		if (shouldResume) playPauseAudio();
	};

	const replaceAudio = async (url: string) => {
		if (audioFile) {
			audioFile.pause();
			audioFile.src = url;
			audioFile.load();
		} else {
			audioFile = new Audio(url);
			audioFile.load();
		}
	};

	let audioFile: HTMLAudioElement;
	let isPlaying = false;
	let loading = false;
	let previewUnavailable = false;

	onMount(async () => {
		selectedSearchResult.subscribe((song: SpotifySearchResult) => {
			loading = true;
			reloadPlayer(song).then(() => (loading = false));
		});
	});
</script>

<div class="container">
	<PageTransition url={data.url}>
		<main>
			<slot />
		</main>

		<footer>
			<Controls {loading} {isPlaying} preview on:playPause={playPauseAudio} />
			{#if previewUnavailable}
				<p>The selected song can't be previewed</p>
			{:else if $selectedSearchResult}
				<p>
					<span>{$selectedSearchResult?.name} / </span><span style="color: var(--secondary)"
						>{$selectedSearchResult?.artists?.at(0)?.name}</span
					>
				</p>
			{:else}
				<p>Select a search result to preview</p>
			{/if}
			<form method="POST" action="/soovid?/submit" use:enhance>
				<input type="hidden" value={$selectedSearchResult?.name} id="title" name="title" />
				<input
					type="hidden"
					value={$selectedSearchResult?.artists?.at(0)?.name}
					id="artist"
					name="artist"
				/>
				<input type="hidden" value={$selectedSearchResult?.id} id="spotifyID" name="spotifyID" />

				<button type="submit" disabled={!$selectedSearchResult} class="secondary"> Submit </button>
			</form>
		</footer>
	</PageTransition>
</div>

<style lang="scss">
	.container {
		margin-bottom: 5.5rem;
	}

	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		@media screen and (max-width: 992px) {
			grid-template-columns: 1fr;
		}
	}

	footer {
		width: 100%;
		min-width: min(100%, 30rem);
		font-family: var(--font-accent);
		position: fixed;
		bottom: 0;
		left: 50%;
		translate: -50%;

		padding: 1.25rem 10vw;

		box-shadow: var(--card-box-shadow);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		background: var(--progress-background-color);
		display: grid;
		grid-template-areas: 'play text submit';
		grid-template-columns: 5rem 1fr 12ch;
		place-items: center;
		gap: 2rem;
		grid-column: 1/3;

		box-shadow: 0 0 0 100vmax var(--progress-background-color);
		clip-path: inset(0 -100vmax);

		& p {
			margin-bottom: 0;
			font-size: 1.1em;
			text-align: center;
		}

		& form,
		button {
			margin-bottom: 0;
		}

		& :global(.player_button.player_button_play) {
			place-self: center start;
		}

		@media screen and (max-width: 768px) {
			min-width: 100%;
			padding-inline: 2rem;
			border-radius: 0;
			left: 0;
			translate: 0;
		}
	}
</style>
