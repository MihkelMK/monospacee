<script lang="ts">
	import { onMount } from 'svelte';

	import type { Cue, Song } from '$lib/types';
	import { timeStringFromSeconds, keybind } from '$lib/utils';
	import {
		selectedRecording,
		cueJump,
		recordingPlaying,
		feed,
		streamingData
	} from '../../../routes/store';

	import TrackInfo from './TrackInfo.svelte';
	import Controls from './Controls.svelte';
	import ProgressBar from './ProgressBar.svelte';

	const getPlayingSong = (time = audioFile.currentTime) => {
		if (!songs || typeof time !== 'number') return;

		const closest = songs.reduce((prev, curr) => {
			return curr.start <= time && curr.start > prev.start ? curr : prev;
		});

		songIndex = songs.indexOf(closest);
	};

	const updateTime = () => {
		if (!audioFile) return;
		currentTime = audioFile.currentTime;
		currTimeDisplay = timeStringFromSeconds(audioFile.currentTime);

		if (audioFile.ended) {
			toggleTimeRunning();
		}

		if (
			audioFile.ended ||
			!$streamingData[$selectedRecording].progress ||
			Math.abs(audioFile.currentTime - $streamingData[$selectedRecording].progress) > 2
		) {
			$streamingData[$selectedRecording].progress = audioFile.currentTime;
		}

		refreshTrack();
	};

	const toggleTimeRunning = () => {
		if (audioFile.ended) {
			recordingPlaying.set(false);
			clearInterval(trackTimer);
		} else {
			trackTimer = setInterval(updateTime, 500);
		}
	};

	const seekToSong = (index: number) => {
		if (index < 0 || !songs || !songs.at(index)) return;
		songIndex = index;
		audioFile.currentTime = songs.at(index)?.start ?? audioFile.currentTime;
		refreshTrack();
	};

	const scrubToTime = (time: number) => {
		if (!audioFile) return;

		getPlayingSong(time);
		audioFile.currentTime = time;
		$streamingData[$selectedRecording].progress = time;
	};

	const scrubToTimeOnEvent = (event: CustomEvent) => {
		const time: number = event.detail ?? currentTime ?? 0;
		audioFile.currentTime = time;
		currentTime = time;
		$streamingData[$selectedRecording].progress = time;
		getPlayingSong(time);
	};

	const refreshTrack = () => {
		if (!songs) return;
		const song = songs.at(songIndex);
		if (!song) return;

		if (
			audioFile &&
			songIndex + 1 < songs.length &&
			songs.at(songIndex + 1)?.start < audioFile.currentTime
		)
			songIndex = songIndex + 1;

		trackTitle = `${song.title} / ${song.artist}` ?? 'Loading...';
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

			if (audioFile) {
				audioFile.pause();
				audioFile.src = `/recordings/${audioUrl}`;
				audioFile.load();
			} else {
				audioFile = audioUrl ? new Audio(`/recordings/${audioUrl}`) : new Audio();
				audioFile.load();
			}

			if (currentTime) audioFile.currentTime = currentTime;

			// Track Duration and Progress Bar
			audioFile.onloadedmetadata = () => {
				if (!audioFile) return;

				totalTrackTime = audioFile.duration;
				totalTimeDisplay = timeStringFromSeconds(totalTrackTime);
				refreshTrack();

				if (slug !== $selectedRecording) audioFile.play();

				if ($streamingData[$selectedRecording]?.duration !== audioFile.duration) {
					$streamingData[$selectedRecording].duration = audioFile.duration;
				}
			};
		}
	};

	const playPauseAudio = () => {
		if (!audioFile) {
			loading = true;
			replaceAudio(audioUrl);
			loading = false;
		}

		if (audioFile.ended || currentTime === totalTrackTime) {
			audioFile.currentTime = 0;
			songIndex = 0;
		}

		if (audioFile.paused) {
			recordingPlaying.set(true);
			toggleTimeRunning();
			audioFile.play();
		} else {
			recordingPlaying.set(false);
			toggleTimeRunning();
			audioFile.pause();
		}
	};

	const reloadPlayer = async (slug: string | null) => {
		if (!slug) return;

		let progressWasSaved = false;
		if ($streamingData[slug]?.progress) progressWasSaved = true;
		else $streamingData[slug] = { progress: 0 };

		totalTrackTime = $streamingData[slug]?.duration ?? 0;
		currentTime = $streamingData[slug]?.progress ?? 0;
		totalTimeDisplay = timeStringFromSeconds(totalTrackTime);
		currTimeDisplay = timeStringFromSeconds(currentTime);

		const selectedCue: Cue = await getCue();
		songs = selectedCue.songs;
		audioUrl = selectedCue.slug;

		if (!$streamingData[slug]?.title) {
			$streamingData[slug].title = $feed.find((post) => post.date === slug)?.title ?? '';
		}
		recTitle = $streamingData[slug].title ?? '';

		if (progressWasSaved) getPlayingSong(currentTime);
		refreshTrack();

		if (!firstLoad) {
			replaceAudio(audioUrl);
			playPauseAudio();

			if (scrubToTime !== null && $cueJump) scrubToTime($cueJump);
		} else firstLoad = false;
	};

	const rewindAudio = () => {
		if (!audioFile) return;
		seekToSong(songIndex - 1);
	};
	const forwardAudio = () => {
		if (!audioFile) return;
		seekToSong(songIndex + 1);
	};
	const mute = () => {
		if (!audioFile) return;
		audioFile.muted = !audioFile.muted;
	};

	let totalTimeDisplay = '00:00:00';
	let currTimeDisplay = '00:00:00';
	let trackTimer: NodeJS.Timeout;
	let currentTime = 0;
	let loading = true;

	let blogSlug: string | null;

	// Controls
	let firstLoad = true;

	let songIndex = 0;
	let songs: Song[];
	let audioUrl = '';

	let audioFile: HTMLAudioElement;
	let trackTitle: string;
	let recTitle: string;

	let totalTrackTime: number;

	onMount(async () => {
		selectedRecording.subscribe((slug: string) => {
			loading = true;
			reloadPlayer(slug).then(() => (loading = false));
		});

		cueJump.subscribe((time: number | undefined) => {
			if (time !== undefined && !loading) {
				scrubToTime(time);
				cueJump.set(undefined);
				if (!$recordingPlaying) playPauseAudio();
			}
		});
	});
</script>

<svelte:window
	use:keybind={{
		binds: ['Control', 'k'],
		on_bind: playPauseAudio
	}}
	use:keybind={{
		binds: ['Control', 'j'],
		on_bind: rewindAudio
	}}
	use:keybind={{
		binds: ['Control', 'l'],
		on_bind: forwardAudio
	}}
	use:keybind={{
		binds: ['Control', 'm'],
		on_bind: mute
	}}
/>

<footer class="container">
	<Controls
		bind:isPlaying={$recordingPlaying}
		loading={loading || !audioFile}
		{songIndex}
		on:mute={mute}
		muted={audioFile?.muted}
		lastSong={songs ? songs.length - 1 : 0}
		on:replaceAudio={() => replaceAudio(blogSlug)}
		on:rewind={rewindAudio}
		on:playPause={playPauseAudio}
		on:forward={forwardAudio}
	/>

	<TrackInfo
		bind:loading
		isPlaying={$recordingPlaying}
		{currTimeDisplay}
		{trackTitle}
		{recTitle}
		{totalTimeDisplay}
	/>

	<ProgressBar
		isPlaying={$recordingPlaying}
		{totalTrackTime}
		{currentTime}
		audioNotLoaded={!audioFile}
		bind:songIndex
		{songs}
		on:scrub={scrubToTimeOnEvent}
		on:seekToSong={({ detail }) => seekToSong(detail)}
	/>
</footer>

<style lang="scss">
	footer {
		display: grid;
		width: 100%;
		min-width: min(100%, 30rem);
		font-family: var(--font-accent);
		grid-template-areas:
			'track track track track track'
			'. current title total .'
			'mute progress progress progress play';
		grid-template-columns: 3.5rem 1fr 1fr 1fr 3.5rem;
		position: fixed;
		bottom: 0;
		gap: 0;
		left: 50%;
		translate: -50%;

		padding-bottom: 1rem;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		background: var(--card-background-color);
		box-shadow: var(--card-box-shadow);

		@media screen and (max-width: 768px) {
			grid-template-areas:
				'track track track track track'
				'mute current title total play'
				'progress progress progress progress progress';
			grid-template-columns: 5rem auto auto auto 5rem;
			gap: 0.85rem 0;
			padding: 0;
			min-width: 100%;
			border-radius: 0;
			left: 0;
			translate: 0;
		}
	}
</style>
