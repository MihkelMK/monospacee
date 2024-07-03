import type { Post, PostType } from '$lib/types';
import { timeToPercent } from '$lib/utils';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const feed: Writable<Post[]> = writable([]);

export const cueJump: Writable<number | undefined> = writable(undefined);

export const visiblePostTypes: Writable<PostType[]> = writable(['project', 'event', 'stream']);

export class AudioStore {
	selectedRecording: string | null = $state('');
	isPlaying: boolean = $state(false);
	isMuted: boolean = $state(false);
	currentTime: number = $state(0);
	duration: number = $state(0);
	volume: number = $state(1);

	progress: number = $derived(timeToPercent(this.currentTime, this.duration));

	constructor() {
		// Load progress for the initial selected recording (if any) on instantiation
		if (browser) {
			// Ensure this runs only in the browser
			this.selectedRecording = this.loadSelection();
			this.currentTime = this.loadProgress(this.selectedRecording) || 0;
		}
	}

	setRecording(recording: string | null) {
		this.saveProgress(); // Save the current progress before switching recordings
		this.selectedRecording = recording;
		this.isPlaying = false;
		this.currentTime = this.loadProgress(recording) || 0; // Load the progress for the new recording
		this.duration = 0;
	}

	togglePlay() {
		this.isPlaying = !this.isPlaying;
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
}

export const audioStore = new AudioStore();
