import type { Cue, Post, PostType, Song } from '$lib/types';
import { timeToPercent } from '$lib/utils';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { setContext, getContext, onDestroy } from 'svelte';

export class PostFeed {
	posts: Post[] = $state([]);

	setPosts(posts: Post[]) {
		this.posts = posts;
	}

	addPosts(posts: Post[]) {
		this.posts = [...this.posts, ...posts];
	}

	getCueTitle(slug: string | null) {
		if (!slug) return '';

		// Typically /recordings/YYYY-MM-DD.mp3
		// turn into YYYY-MM-DD
		const file = slug.split('/').at(-1);
		const date = file ? file.split('.')[0] : slug.split('.')[0];

		return this.posts.find((post) => post.date === date)?.title ?? '';
	}
}

export const cueJump: Writable<number | undefined> = writable(undefined);

export const visiblePostTypes: Writable<PostType[]> = writable(['project', 'event', 'stream']);

export class AudioStore {
	loading = $state(false);
	selectedRecording: string | null = $state('');
	isPlaying: boolean = $state(false);
	isMuted: boolean = $state(false);
	currentTime: number = $state(0);
	duration: number = $state(0);
	volume: number = $state(1);
	cue: Cue | undefined = $state(undefined);
	cueTitle: string | undefined = $state();

	progress: number = $derived(timeToPercent(this.currentTime, this.duration));

	getCurrentSongIndex = (time: number | null, cue: Cue | undefined = this.cue) => {
		if (!cue?.songs || typeof time !== 'number') return;

		const closest = cue.songs.reduce((prev: Song, curr: Song) => {
			return curr.start <= time && curr.start >= prev.start ? curr : prev;
		});

		return cue.songs.indexOf(closest);
	};
	currentSongIndex: number | undefined = $derived(this.getCurrentSongIndex(this.currentTime));
	currentSong: Song | undefined = $derived(
		typeof this.currentSongIndex === 'number'
			? this.cue?.songs.at(this.currentSongIndex)
			: undefined
	);

	constructor() {
		// Load progress for the initial selected recording (if any) on instantiation
		if (browser) {
			// Ensure this runs only in the browser
			this.setRecording(this.loadSelection());
		}
		onDestroy(() => {
			this.saveProgress();
			this.saveCueTitle();
		});
	}

	async setRecording(recording: string | null) {
		this.loading = true;

		this.saveProgress(); // Save the current progress before switching recordings
		this.saveCueTitle(); // Save the cue title before switching recordings

		this.isPlaying = false;
		this.selectedRecording = recording;
		this.currentTime = this.loadProgress(recording) || 0; // Load the progress for the new recording
		this.duration = 0; // Initialize with 0 to overwrite previous value
		this.cue = await this.getCue(recording);

		// Try to get cue title from postFeed, fall back to what's saved in localStorage
		// Trying from postFeed first ensures we get the title in the right language
		const freshCueTitle = postFeed.getCueTitle(recording);
		if (freshCueTitle) {
			this.cueTitle = freshCueTitle;
			this.saveCueTitle();
		} else {
			this.cueTitle = this.loadCueTitle(recording);
		}

		this.loading = false;
	}

	getCue = async (recording: string | null) => {
		if (typeof window === 'undefined' || !recording) return;

		// Manual data for /lift easter egg
		if (recording === '/human-music.mp3') {
			return {
				slug: 'human-music.mp3',
				songs: [{ artist: 'Them', title: 'Human Music', start: 0 }]
			};
		}

		const slug = recording.split('/').slice(-1)[0].split('.')[0];
		const cueRes = await fetch(`/api/cues/${slug}.cue`);
		const cueData: Cue = await cueRes.json();

		return cueData;
	};

	setPlay(state: boolean) {
		this.isPlaying = state;
	}

	togglePlay() {
		this.isPlaying = !this.isPlaying;
	}

	setMute(state: boolean) {
		this.isMuted = state;
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
	}

	updateTime(time: number) {
		this.currentTime = time;
		this.saveProgress(); // Save progress whenever time is updated
	}

	updateDuration(duration: number) {
		this.duration = duration;
	}

	updateVolume(volume: number) {
		this.volume = volume;
	}

	skip(seconds: number) {
		this.currentTime = Math.max(0, Math.min(this.duration, this.currentTime + seconds));
		this.saveProgress(); // Save progress whenever time is skipped
	}

	// Save the current progress to local storage
	saveProgress() {
		if (browser && this.selectedRecording) {
			const progressData = JSON.parse(localStorage.getItem('audioProgress') || '{}');
			progressData['selected'] = this.selectedRecording;
			progressData[this.selectedRecording] = this.currentTime;

			localStorage.setItem('audioProgress', JSON.stringify(progressData));
		}
	}

	loadSelection() {
		if (browser) {
			const progressData = JSON.parse(localStorage.getItem('audioProgress') || '{}');
			return progressData['selected'] || '/recordings/2024-06-08.mp3';
		}
	}

	// Load the progress from local storage
	loadProgress(recording: string | null): number | null {
		if (browser && recording) {
			const progressData = JSON.parse(localStorage.getItem('audioProgress') || '{}');
			return progressData[recording] || null;
		}
		return null;
	}

	// Load cue title from local storage
	loadCueTitle(recording: string | null): string | undefined {
		if (browser && recording) {
			const cueTitleData = JSON.parse(localStorage.getItem('cueTitles') || '{}');
			return cueTitleData[recording] || undefined;
		}
		return undefined;
	}

	// Save the current progress to local storage
	saveCueTitle() {
		if (browser && this.selectedRecording && this.cueTitle) {
			const cueTitleData = JSON.parse(localStorage.getItem('cueTitles') || '{}');
			cueTitleData[this.selectedRecording] = this.cueTitle;

			localStorage.setItem('cueTitles', JSON.stringify(cueTitleData));
		}
	}
}

const AUDIO_STORE_KEY = Symbol('AUDIO');

export function setAudioStore() {
	return setContext(AUDIO_STORE_KEY, new AudioStore());
}

export function getAudioStore() {
	return getContext<ReturnType<typeof setAudioStore>>(AUDIO_STORE_KEY);
}

export const postFeed = new PostFeed();
