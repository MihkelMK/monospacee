<script lang="ts">
	import { onMount } from 'svelte';

	import type { Cue, Song } from '$lib/types';
	import { cueJump, feed, audioStore } from '$lib/store.svelte';

	import TrackInfo from './TrackInfo.svelte';
	import Controls from './Controls.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { invalidateAll } from '$app/navigation';

	const { cue } = $props<{
		cue: Cue;
	}>();

	const getPlayingSong = (time: number) => {
		if (!cue?.songs || typeof time !== 'number') return;

		const closest = cue.songs.reduce((prev: Song, curr: Song) => {
			return curr.start <= time && curr.start > prev.start ? curr : prev;
		});

		return cue.songs.indexOf(closest);
	};

	const seekToSong = (index: number) => {
		if (!audio) return;

		if (index < 0 || !cue?.songs || !cue?.songs.at(index)) return;
		audio.currentTime = cue.songs.at(index)?.start ?? audio.currentTime;
	};

	let audio: HTMLAudioElement | null = $state(null);
	let loadedAudio: string | undefined = $state(undefined);

	let playingSongIndex: number | undefined = $derived(getPlayingSong(audioStore.currentTime));
	let playingSongTitle: string = $derived(cue?.songs.at(playingSongIndex).title ?? '');
	let playingSongArtist: string = $derived(cue?.songs.at(playingSongIndex).artist ?? '');
	let cueTitle: string = $derived(
		$feed.find((post) => post.date === cue?.slug.split('.')[0])?.title ?? ''
	);

	function handleTimeUpdate() {
		if (!audio) return;
		audioStore.updateTime(audio.currentTime);
	}

	function handleDurationChange() {
		if (!audio) return;
		audioStore.updateDuration(audio.duration);
	}

	function handleVolumeChange() {
		if (!audio) return;
		audioStore.updateVolume(audio.volume);
	}

	function updateProgress(time: number) {
		if (!audio || !time) return false;

		audio.currentTime = time;
		return false;
	}

	function loadNewSong(selectedRecording: string | null, startAfterLoad: boolean) {
		if (!selectedRecording || !audio) return;

		const currentRelative = '/' + audio.src.split('/').slice(3).join('/');
		if (selectedRecording === currentRelative) return;

		audio.src = selectedRecording;
		audio.load();
		audio.currentTime = audioStore.currentTime;

		invalidateAll();

		if (startAfterLoad) {
			audio.play();
		}
	}

	$effect(() => {
		if (audio && loadedAudio) {
			if (audioStore.isPlaying) {
				audio.play().catch((error) => {
					console.error('Error playing audio:', error);
					audioStore.isPlaying = false;
				});
			} else {
				audio.pause();
			}
		}
	});

	$effect(() => {
		if (audio) {
			audio.muted = audioStore.isMuted;
		}
	});

	$effect(() => {
		if (loadedAudio && loadedAudio !== audioStore.selectedRecording) {
			loadNewSong(audioStore.selectedRecording, true);
		}
	});

	onMount(() => {
		if (audio) {
			audio.addEventListener('canplay', () => {
				loadedAudio = '/' + audio?.src.split('/').slice(-2).join('/') || undefined;
			});
		}
		cueJump.subscribe((time: number | undefined) => {
			if (time !== undefined && audio) {
				audio.currentTime = time;
				cueJump.set(undefined);
			}
		});

		if (audioStore.selectedRecording) {
			loadNewSong(audioStore.selectedRecording, false);
		}
	});
</script>

<!-- <svelte:window -->
<!-- 	use:keybind={{ -->
<!-- 		binds: ['Control', 'k'], -->
<!-- 		on_bind: playPauseAudio -->
<!-- 	}} -->
<!-- 	use:keybind={{ -->
<!-- 		binds: ['Control', 'j'], -->
<!-- 		on_bind: rewindAudio -->
<!-- 	}} -->
<!-- 	use:keybind={{ -->
<!-- 		binds: ['Control', 'l'], -->
<!-- 		on_bind: forwardAudio -->
<!-- 	}} -->
<!-- 	use:keybind={{ -->
<!-- 		binds: ['Control', 'm'], -->
<!-- 		on_bind: mute -->
<!-- 	}} -->
<!-- /> -->
<audio
	loop={audioStore.selectedRecording === '/human-music.mp3'}
	bind:this={audio}
	preload="auto"
	onplay={() => (audioStore.isPlaying = true)}
	onpause={() => (audioStore.isPlaying = false)}
	onended={() => (audioStore.isPlaying = false)}
	ontimeupdate={handleTimeUpdate}
	ondurationchange={handleDurationChange}
	onvolumechange={handleVolumeChange}
></audio>

<footer class="container">
	<Controls
		togglePlay={() => audioStore.togglePlay()}
		toggleMute={() => audioStore.toggleMute()}
		skip={(seconds) => (audio.currentTime += seconds)}
		isPlaying={audioStore.isPlaying}
		isMuted={audioStore.isMuted}
		loading={!loadedAudio}
	></Controls>

	<ProgressBar
		duration={audioStore.duration}
		currentTime={audioStore.currentTime}
		songs={cue?.songs}
		{playingSongIndex}
		isPlaying={audioStore.isPlaying}
		loading={!loadedAudio}
		{updateProgress}
		{seekToSong}
	></ProgressBar>
	<TrackInfo
		loading={!loadedAudio}
		isPlaying={audioStore.isPlaying}
		currentTime={audioStore.currentTime}
		duration={audioStore.duration}
		trackTitle={playingSongTitle}
		trackArtist={playingSongArtist}
		{cueTitle}
	/>
</footer>

<style lang="scss">
	footer {
		display: grid;
		width: min(90dvw, 50rem);
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
		background: var(--card-background-color);
		box-shadow: var(--card-box-shadow);
		border-radius: var(--border-radius) var(--border-radius) 0 0;

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
