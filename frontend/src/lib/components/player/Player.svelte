<script lang="ts">
	import { onMount } from 'svelte';

	import { cueJump, getAudioStore } from '$lib/store.svelte';

	import TrackInfo from './TrackInfo.svelte';
	import Controls from './Controls.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { invalidateAll } from '$app/navigation';
	import { FiniteStateMachine } from 'runed';

	const audioStore = getAudioStore();

	const seekToSong = (index: number) => {
		if (!audio) return;

		if (index < 0 || !audioStore.cue?.songs || !audioStore.cue?.songs.at(index)) return;
		audio.currentTime = audioStore.cue.songs.at(index)?.start ?? audio.currentTime;
	};

	let audio: HTMLAudioElement | null = $state(null);
	let loadedAudio: string | undefined = $state(undefined);

	type LoadingStates = 'loading' | 'loaded' | 'stalled' | 'waiting' | 'progressing' | 'skipping';
	type LoadingEvents = 'loading' | 'waiting' | 'stalled' | 'progress' | 'loaded' | 'skip';

	let waitingTimeout: ReturnType<typeof setTimeout> | undefined = $state();

	const loadingFS = new FiniteStateMachine<LoadingStates, LoadingEvents>('loading', {
		loading: {
			progress: 'progressing',
			loading: 'loading',
			waiting: 'waiting',
			stalled: 'stalled'
		},
		loaded: {
			loading: 'loading',
			waiting: 'waiting',
			stalled: 'stalled',
			skip: 'skipping'
		},
		stalled: {
			// Skip straight to loaded as in my testing stalled
			// is the only condition where progress means we are good to go
			progress: 'loaded',
			loading: 'loading',
			waiting: 'waiting'
		},
		waiting: {
			_enter: () => {
				// Handle case where we instantly scrub to the right place
				waitingTimeout = setTimeout(() => {
					loadingFS.send('loaded');
					console.log('waitingTimeout');
				}, 1000);
			},
			_exit: () => {
				// Scrub was not instant
				clearTimeout(waitingTimeout);
			},
			progress: 'progressing',
			loading: 'loading',
			stalled: 'stalled',
			loaded: 'loaded'
		},
		progressing: {
			_enter: () => {
				// Handle cases where most of the audio has been already loaded
				// But waitingTimeout still gets cancelled (rare)
				loadingFS.debounce(4000, 'loaded');
			},

			// Wait for second progress event because sometimes we still get stalled
			// Not waiting leads to a flash of loaded before being set to loading again
			progress: 'loaded',
			waiting: 'waiting',
			loading: 'loading',
			stalled: 'stalled',
			loaded: 'loaded'
		},
		skipping: {
			// Used when skiping +- 30sec along loaded song
			// Times where this takes significant time are rare
			// Still, one waiting event is triggered
			// Having this exception skips the flash of loader spinners
			_enter: () => {
				loadingFS.debounce(100, 'loaded');
			},
			loaded: 'loaded'
		}
	});

	let loading = $derived(loadingFS.current !== 'loaded' && loadingFS.current !== 'skipping');

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

	function handlePlayPause() {
		if (!audio) return;

		if (audio.ended) {
			audio.currentTime = 0;
		}

		if (audio.paused || audio.ended) {
			audio.play();
			audioStore.setPlay(true);
		} else {
			audio.pause();
			audioStore.setPlay(false);
		}
	}

	function handleMute() {
		if (!audio) return;

		audio.muted = !audio.muted;
		audioStore.toggleMute();
	}

	function handleSkip(seconds: number) {
		if (!audio) return;

		loadingFS.send('skip');
		audio.currentTime += seconds;
	}

	function loadNewSong(selectedRecording: string | null, startAfterLoad: boolean) {
		if (!selectedRecording || !audio) return;

		const currentRelative = '/' + audio.src.split('/').slice(3).join('/');
		if (selectedRecording === currentRelative) return;
		loadedAudio = undefined;

		loadingFS.send('loading');
		audio.src = selectedRecording;
		audio.currentTime = audioStore.currentTime;
		audio.load();

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

<audio
	loop={audioStore.selectedRecording === '/human-music.mp3'}
	bind:this={audio}
	preload="auto"
	autoplay={false}
	onplay={() => audioStore.setPlay(true)}
	onpause={() => audioStore.setPlay(false)}
	onended={() => audioStore.setPlay(false)}
	onloadstart={() => loadingFS.send('loading')}
	onstalled={() => loadingFS.send('stalled')}
	onwaiting={() => loadingFS.send('waiting')}
	onprogress={() => loadingFS.send('progress')}
	ontimeupdate={handleTimeUpdate}
	ondurationchange={handleDurationChange}
	onvolumechange={handleVolumeChange}>
</audio>

<div class="player">
	<Controls togglePlay={handlePlayPause} toggleMute={handleMute} skip={handleSkip}></Controls>
	<ProgressBar {loading} {updateProgress} {seekToSong}></ProgressBar>
	<TrackInfo {loading} />
</div>

<style lang="scss">
	.player {
		grid-area: player;
		display: grid;
		width: min(90dvw, 50rem);
		min-width: min(100%, 30rem);
		font-family: var(--font-accent);
		grid-template-areas:
			'track track track track track'
			'. current title total .'
			'mute progress progress progress play';
		grid-template-columns: 3.5rem 1fr 1fr 1fr 3.5rem;
		gap: 0;

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
