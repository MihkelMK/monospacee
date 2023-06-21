<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';

	import type { Cue, Song } from '$lib/types';
	import { timeStringFromSeconds } from '$lib/utils';
	import { selectedRecording } from '../../../routes/store';

	import TrackInfo from './TrackInfo.svelte';
	import Controls from './Controls.svelte';
	import VolumeSlider from './VolumeSlider.svelte';
	import ProgressBar from './ProgressBar.svelte';

	const getPlayingSong = (time = audioFile.currentTime) => {
		if (!songs || !time) return;

		if (!songIndex) songIndex = 0;

		const next = songs.at(songIndex + 1);
		if (next && time >= next.start) {
			songIndex += 1;
			refreshTitle();
		} else {
			const current = songs.at(songIndex);
			if (current && time < current.start - 15) {
				songIndex -= 1;
				refreshTitle();
			}
		}
	};

	const updateTime = () => {
		if (!audioFile) return;
		getPlayingSong();

		progress = audioFile.currentTime * (100 / totalTrackTime);
		currTimeDisplay = timeStringFromSeconds(audioFile.currentTime);

		if (audioFile.ended) {
			toggleTimeRunning();
		}
	};

	const toggleTimeRunning = () => {
		if (audioFile.ended) {
			isPlaying = false;
			clearInterval(trackTimer);
		} else {
			trackTimer = setInterval(updateTime, 100);
		}
	};

	const seekToSong = (index: number) => {
		if (index < 0 || !songs.at(index)) return;
		songIndex = index;
		audioFile.currentTime = songs.at(index)?.start ?? audioFile.currentTime;
		refreshTitle();
	};

	const refreshTitle = () => {
		const song = songs.at(songIndex);
		if (!song) return;

		trackTitle = `${song.title} - ${song.artist}` ?? 'Loading...';
	};

	const getCue = async () => {
		const cueRes = await fetch(`/api/cues/${$selectedRecording}.cue`);
		const cue: Cue = await cueRes.json();
		return cue;
	};

	const replaceAudio = async (slug: string | null) => {
		if (slug) {
			if (audioFile) audioFile.pause();
			totalTimeDisplay = timeStringFromSeconds(0);
			songIndex = 0;

			selectedRecording.set(slug);

			const selectedCue: Cue = await getCue();
			songs = selectedCue.songs;
			audioFile = selectedCue ? new Audio(`/recordings/${selectedCue.slug}`) : new Audio();

			// Track Duration and Progress Bar
			audioFile.onloadedmetadata = () => {
				if (!audioFile) return;

				totalTrackTime = audioFile.duration;
				totalTimeDisplay = timeStringFromSeconds(totalTrackTime);
				refreshTitle();

				if (slug !== $selectedRecording) audioFile.play();
			};
		}
	};

	const playPauseAudio = () => {
		if (audioFile.ended) audioFile.currentTime = 0;

		if (audioFile.paused) {
			toggleTimeRunning();
			audioFile.play();
			isPlaying = true;
		} else {
			toggleTimeRunning();
			audioFile.pause();
			isPlaying = false;
		}
	};

	const rewindAudio = () => seekToSong(songIndex - 1);
	const forwardAudio = () => seekToSong(songIndex + 1);
	const updateVolume = () => (audioFile.volume = vol / 100);
	const mute = () => (audioFile.muted = !audioFile.muted);

	const getBlogPostFromPath = (path: string) =>
		path.match('/blog/[0-9-]*$')?.at(0)?.replace('/blog/', '').replace('.cue', '') ?? null;

	let totalTimeDisplay = '00:00:00';
	let currTimeDisplay = '00:00:00';
	let trackTimer: NodeJS.Timeout;
	let progress = 0;

	let minimized = true;
	let blogSlug: string | null;

	$: if ($navigating && $navigating.to) blogSlug = getBlogPostFromPath($navigating.to.url.pathname);

	// Controls
	let isPlaying = false;

	// Get Audio track
	let vol = 50;

	let songIndex = 0;
	let songs: Song[];

	let audioFile: HTMLAudioElement;
	let trackTitle: string;

	let totalTrackTime: number;

	onMount(async () => {
		blogSlug = getBlogPostFromPath($page.url.pathname);
		minimized = !blogSlug;

		replaceAudio($selectedRecording);
	});
</script>

<span class="player_background {minimized ? '' : ' player_open'}" />
<footer class:minimized>
	<button
		data-tooltip={minimized ? 'Ava menüü' : 'Sulge menüü'}
		class="player_button player_button_minimize player_button_minimize_{minimized
			? 'closed'
			: 'open'}"
		on:click={() => (minimized = !minimized)}
	>
		<iconify-icon inline icon="pixelarticons:chevron-up" />
	</button>

	<Controls
		{isPlaying}
		{minimized}
		{blogSlug}
		{songIndex}
		lastSong={songs ? songs.length - 1 : 0}
		on:replaceAudio={() => replaceAudio(blogSlug)}
		on:rewind={rewindAudio}
		on:playPause={playPauseAudio}
		on:forward={forwardAudio}
	/>

	<TrackInfo {isPlaying} {currTimeDisplay} {trackTitle} {totalTimeDisplay} />

	{#if audioFile}
		<ProgressBar bind:currentTime={audioFile.currentTime} {progress} {isPlaying} {totalTrackTime} />
	{:else}
		<ProgressBar currentTime={0} {isPlaying} {totalTrackTime} {progress} />
	{/if}

	<VolumeSlider
		{minimized}
		bind:vol
		on:updateVolume={updateVolume}
		on:mute={mute}
		muted={audioFile?.muted}
	/>
</footer>

<style lang="scss">
	footer {
		display: grid;
		z-index: 10;
		width: 100%;
		grid-template-areas:
			'openblog controls controls controls volume'
			'. current title total volume'
			'minimize progress progress progress mute';
		grid-template-columns: 3rem auto auto auto 3.5rem;
		position: fixed;
		bottom: 0;
		padding: 1rem 0.75rem 1rem 0.75rem;
		border-radius: var(--border-radius) var(--border-radius) 0 0;

		@media screen and (max-width: 768px) {
			grid-template-areas:
				'controls controls controls controls controls'
				'minimize title title title mute'
				'progress progress progress progress progress';
			grid-template-columns: 4rem auto auto auto 4.5rem;
			grid-template-rows: auto 4rem 0.75rem;
			gap: 0.55rem 0;
			padding: 0;

			min-height: 12rem;

			&.minimized {
				min-height: unset;
			}
		}
	}

	.player_button_minimize {
		grid-area: minimize;
		place-self: center;
		font-size: 1.4rem;
		width: 1.4rem;

		min-height: 1.6rem;

		@media screen and (max-width: 768px) {
			font-size: 2.3rem;
			width: 2.3rem;
			min-height: 2.4rem;
			place-self: start center;
		}

		iconify-icon {
			transition: rotate var(--transition);
		}

		&_open {
			iconify-icon {
				rotate: 180deg;
			}
		}
	}

	.player_background {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100%;
		max-height: 4.7rem;
		background: var(--card-background-color);
		transition: max-height var(--transition);
		border-radius: calc(var(--border-radius) * 0.25);
		box-shadow: var(--card-box-shadow);

		&.player_open {
			max-height: 7.5rem;
		}

		@media screen and (max-width: 768px) {
			max-height: 6rem;

			&.player_open {
				max-height: 13rem;
			}
		}
	}
</style>
