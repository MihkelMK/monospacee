<script lang="ts">
	import { trimString } from '$lib/utils';
	import { audioData } from './audioData.js';

	import TrackInfo from './TrackInfo.svelte';
	import Controls from './Controls.svelte';
	import VolumeSlider from './VolumeSlider.svelte';
	import { onMount } from 'svelte';
	import ProgressBar from './ProgressBar.svelte';

	const loadTrack = () => {
		audioFile = new Audio(audioData[trackIndex].url);

		if (!audioFile) return;
		audioFile.onloadedmetadata = () => {
			totalTrackTime = audioFile.duration;
			updateTime();
		};
		trackTitle = audioData[trackIndex].name;
	};

	const autoPlayNextTrack = () => {
		if (trackIndex <= audioData.length - 1) {
			trackIndex += 1;
			loadTrack();
			audioFile.play();
		} else {
			trackIndex = 0;
			loadTrack();
			audioFile.play();
		}
	};

	function updateTime() {
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

	const rewindAudio = () => (audioFile.currentTime -= 10);
	const forwardAudio = () => (audioFile.currentTime += 10);
	const updateVolume = () => (audioFile.volume = vol / 100);
	const mute = () => {
		console.log(muted, audioFile.muted, vol);

		if (muted) {
			audioFile.muted = false;
			muted = false;
		} else {
			audioFile.muted = true;
			muted = true;
		}
	};

	let totalTimeDisplay = '00:00:00';
	let currTimeDisplay = '00:00:00';
	let progress = 0;
	let trackTimer: NodeJS.Timeout;
	let minimized = true;

	// Controls
	let isPlaying = false;
	$: console.log(`isPlaying = ${isPlaying}`);

	// Get Audio track
	let trackIndex = 0;

	let vol = 50;
	let muted = false;

	let audioFile: HTMLAudioElement;
	let trackTitle = 'Loading...';

	let totalTrackTime: number;
	$: console.log(totalTrackTime);

	// 28 => only 1 line of text before mobile breakpoint
	const titleMaxLength = 28;

	onMount(() => {
		// $: console.log(trackIndex)
		audioFile = new Audio(audioData[trackIndex].url);

		trackTitle = trimString(audioData[trackIndex].name, titleMaxLength);
		muted = audioFile.muted;

		// Track Duration and Progress Bar
		audioFile.onloadedmetadata = () => {
			totalTrackTime = audioFile.duration;
			updateTime();
		};
	});
</script>

<span class="player_background player_background_fade {minimized ? '' : ' player_open'}" />
<span class="player_background {minimized ? '' : ' player_open'}" />
<div class:minimized>
	<button
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
		on:rewind={rewindAudio}
		on:playPause={playPauseAudio}
		on:forward={forwardAudio}
	/>

	<TrackInfo {isPlaying} {currTimeDisplay} {trackTitle} {totalTimeDisplay} />

	<ProgressBar {progress} {isPlaying} />

	<VolumeSlider {minimized} bind:vol on:updateVolume={updateVolume} on:mute={mute} {muted} />
</div>

<style lang="scss">
	div {
		display: grid;
		z-index: 10;
		width: 100%;
		grid-template-areas:
			'. controls controls controls volume'
			'. current title total volume'
			'minimize progress progress progress mute';
		grid-template-columns: 3rem auto auto auto 3.5rem;
		position: fixed;
		bottom: 0;
		padding: 1rem 0.75rem 0.75em 0.7em;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
	}

	.player_button_minimize {
		grid-area: minimize;
		place-self: center;
		font-size: 1.4rem;
		width: 1.4rem;
		min-height: 1.6rem;
		transition-property: rotate;

		&_open {
			rotate: 180deg;
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
	}
</style>
