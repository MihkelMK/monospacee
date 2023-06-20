<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';

	import type { Cue } from '$lib/types';
	import { selectedRecording } from '../../../routes/store';

	import TrackInfo from './TrackInfo.svelte';
	import Controls from './Controls.svelte';
	import VolumeSlider from './VolumeSlider.svelte';
	import ProgressBar from './ProgressBar.svelte';

	const getTrack = () => {
		if (!selectedCue || !selectedCue.songs) return;
		if (audioFile.currentTime >= selectedCue.songs.at(trackIndex + 1)?.start) {
			trackIndex += 1;
			lastProgress = audioFile.currentTime;
		} else if (lastProgress > audioFile.currentTime && audioFile.currentTime <= lastProgress)
			trackIndex -= 1;
	};

	const getCue = async () => {
		const cueRes = await fetch(`/api/cues/${$selectedRecording}.cue`);
		const cue: Cue = await cueRes.json();
		return cue;
	};

	function updateTime() {
		getTrack();
		progress = audioFile.currentTime * (100 / totalTrackTime);

		let currHrs = Math.floor(audioFile.currentTime / 60 / 60);
		let currMins = Math.floor(audioFile.currentTime / 60);
		let currSecs = Math.floor(audioFile.currentTime - currMins * 60);

		let durHrs = Math.floor(totalTrackTime / 60 / 60);
		let durMins = Math.floor((totalTrackTime / 60) % 60);
		let durSecs = Math.floor(totalTrackTime - durHrs * 60 * 60 - durMins * 60);

		currTimeDisplay = `${String(currHrs).padStart(2, '0')}:${String(currMins).padStart(
			2,
			'0'
		)}:${String(currSecs).padStart(2, '0')}`;
		totalTimeDisplay = `${String(durHrs).padStart(2, '0')}:${String(durMins).padStart(
			2,
			'0'
		)}:${String(durSecs).padStart(2, '0')}`;

		if (audioFile.ended) {
			toggleTimeRunning();
		}
	}

	const toggleTimeRunning = () => {
		if (audioFile.ended) {
			isPlaying = false;
			clearInterval(trackTimer);
			console.log(`Ended = ${audioFile.ended}`);
		} else {
			trackTimer = setInterval(updateTime, 100);
		}
	};

	const playPauseAudio = () => {
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

	const replaceAudio = async () => {
		if (blogSlug) {
			audioFile.pause();

			selectedRecording.set(blogSlug);

			const cueRes = await fetch(`/api/cues/${$selectedRecording}.cue`);
      selectedCue = await cueRes.json();
			audioFile = selectedCue ? new Audio(`/recordings/${selectedCue.slug}`) : new Audio();

			// Track Duration and Progress Bar
			audioFile.onloadedmetadata = () => {
				if (!audioFile) return;
				totalTrackTime = audioFile.duration;
				updateTime();
				
        audioFile.play();
			};
		}
	};

	const rewindAudio = () => (audioFile.currentTime -= 15);
	const forwardAudio = () => (audioFile.currentTime += 15);
	const updateVolume = () => (audioFile.volume = vol / 100);
	const mute = () => (audioFile.muted = !audioFile.muted);

	const getBlogPostFromPath = (path: string) =>
		path.match('/blog/[0-9-]*$')?.at(0)?.replace('/blog/', '').replace('.cue', '') ?? null;

	let totalTimeDisplay = '00:00:00';
	let currTimeDisplay = '00:00:00';
	let progress = 0;
	let lastProgress = 0;
	let trackTimer: NodeJS.Timeout;
	let minimized = true;
	let blogSlug: string | null;

	$: if ($navigating && $navigating.to) blogSlug = getBlogPostFromPath($navigating.to.url.pathname);

	// Controls
	let isPlaying = false;

	// Get Audio track
	let trackIndex = 0;
	let vol = 50;

	let selectedCue: Cue;

	let audioFile: HTMLAudioElement;
	let trackTitle = 'Loading...';

	let totalTrackTime: number;

	$: trackTitle = selectedCue
		? `${selectedCue.songs.at(trackIndex)?.title} - ${selectedCue.songs.at(trackIndex)?.artist}`
		: 'Loading...';

	onMount(async () => {
		blogSlug = getBlogPostFromPath($page.url.pathname);
		minimized = !blogSlug;

		selectedCue = await getCue();
		audioFile = selectedCue ? new Audio(`/recordings/${selectedCue.slug}`) : new Audio();

		// Track Duration and Progress Bar
		audioFile.onloadedmetadata = () => {
			if (!audioFile) return;
			totalTrackTime = audioFile.duration;
			updateTime();
		};
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
		on:replaceAudio={replaceAudio}
		on:rewind={rewindAudio}
		on:playPause={playPauseAudio}
		on:forward={forwardAudio}
	/>

	<TrackInfo {isPlaying} {currTimeDisplay} {trackTitle} {totalTimeDisplay} />

	<ProgressBar {progress} {isPlaying} />

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
		padding: 1rem 0.75rem 0.75em 0.7em;
		border-radius: var(--border-radius) var(--border-radius) 0 0;

		@media screen and (max-width: 768px) {
			grid-template-areas:
				'controls controls controls controls controls'
				'minimize title title title mute'
				'progress progress progress progress progress';
			grid-template-columns: 4rem auto auto auto 4.5rem;
			grid-template-rows: auto 4rem 0.75rem;
			gap: 0.4rem 0;
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
