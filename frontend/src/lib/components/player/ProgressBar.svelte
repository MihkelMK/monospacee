<script lang="ts">
	import type { Song } from '$lib/types.js';
	import { trimString, timeToPercent } from '$lib/utils.js';

	// interface Props {
	// 	totalTrackTime: number;
	// 	currentTime: number;
	// 	songIndex: number;
	// 	audioNotLoaded: boolean;
	// 	isPlaying: boolean;
	// 	songs: Song[];
	// 	seekToSong: (index: number) => void;
	// 	scrub: (time: number) => void;
	// }
	//
	// let {
	// 	totalTrackTime,
	// 	currentTime,
	// 	songIndex = $bindable(),
	// 	audioNotLoaded,
	// 	isPlaying,
	// 	songs,
	// 	seekToSong,
	// 	scrub
	// }: Props = $props();
	//
	// const timeToPercent = (time: number, totalTime: number) =>
	// 	Math.min((time * 100) / totalTime, 100);
	//
	// let scrubTime: number | undefined = $state();
	// let scrubbing = $state(false);
	// let progress = $derived(scrubTime ? scrubTime * (100 / totalTrackTime) : 0);
	//
	// $effect(() => {
	// 	scrubTime = scrubbing ? scrubTime : currentTime;
	// });
	const {
		duration,
		currentTime,
		songs,
		playingSongIndex,
		loading,
		isPlaying,
		updateProgress,
		seekToSong
	} = $props<{
		duration: number;
		currentTime: number;
		songs: Song[] | undefined;
		playingSongIndex: number | undefined;
		loading: boolean;
		isPlaying: boolean;
		updateProgress: (time: number) => boolean;
		seekToSong: (trackIndex: number) => void;
	}>();

	let scrubbing = $state(false);
	let opacity = $derived(isPlaying ? '1' : '0.6');
	let scrubTime = $state(0);
	let shownProgress = $derived.by(() => {
		// The Math.abs check keeps the progress bar from flickering
		// after the user has scrubbed time.
		// The first currentTime update still has the old, pre scrub time
		if (scrubbing || Math.abs(scrubTime - currentTime) > 4) {
			return timeToPercent(scrubTime, duration);
		} else {
			return timeToPercent(currentTime, duration);
		}
	});

	$effect(() => {
		if (!scrubbing) {
			scrubTime = currentTime;
		}
	});
	$inspect(scrubbing, shownProgress);
</script>

<div class="player_progress">
	{#if songs && duration}
		{#each songs as song, i}
			<label
				style="--startsAt:{timeToPercent(song.start, duration)}%;"
				class="player_progress_step {i === playingSongIndex ? 'player_progress_step_active' : ''}"
				data-placement={timeToPercent(song.start, duration) < 35
					? 'right'
					: timeToPercent(song.start, duration) > 65
						? 'left'
						: 'top'}
				data-tooltip={trimString(`${song.title} - ${song.artist}`, 40)}
			>
				<input
					disabled={loading}
					type="radio"
					aria-label="Skip to song: {song.title}"
					checked={i === playingSongIndex}
					onclick={() => seekToSong(i)}
				/>
			</label>
		{/each}
	{/if}
	<input
		aria-label="player progress"
		disabled={loading}
		type="range"
		max={String(duration)}
		min="0"
		bind:value={scrubTime}
		onpointerdown={() => (scrubbing = true)}
		onpointerup={() => {
			scrubbing = updateProgress(scrubTime);
		}}
		ontouchstart={() => (scrubbing = true)}
		ontouchend={() => {
			scrubbing = updateProgress(scrubTime);
		}}
	/>
	<span class="player_progress_bar" style="width: {shownProgress}%; opacity:{opacity}"></span>
</div>

<style lang="scss">
	@mixin track() {
		height: 100%;
		background: transparent;
	}

	@mixin thumb() {
		border: none; // for cross-browser consistency
		width: 2vw;
		border-radius: 0;
		background: transparent;
		height: 0.75rem;
		cursor: ew-resize;
		@media screen and (max-width: 768px) {
			width: max(10vw, 4rem);
		}
	}

	.player_progress {
		grid-area: progress;
		width: 100%;
		background: color-mix(in srgb, var(--progress-background-color) 90%, #000);
		height: 0.75rem;
		position: relative;
		border-radius: calc(var(--border-radius) * 0.25);
		place-self: end center;

		& input[type='range'] {
			position: absolute;
			left: 0;
			height: 100%;
		}

		&_bar {
			position: absolute;
			height: 100%;
			transition: opacity var(--transition);
			background-image: linear-gradient(to right, var(--secondary), var(--primary));
			background-size: 100vw 100%;
			border-radius: 0 var(--border-radius) var(--border-radius) 0;
			pointer-events: none;
			@media only screen and (prefers-color-scheme: light) {
				background-image: linear-gradient(
					to right,
					color-mix(in srgb, var(--secondary) 60%, #fff),
					color-mix(in srgb, var(--primary) 60%, #fff)
				);
			}
		}

		@media screen and (max-width: 768px) {
			place-self: end center;
			height: 1rem;
		}

		&:hover {
			input:not([disabled='']) {
				opacity: 0.9;
				@media only screen and (prefers-color-scheme: light) {
					opacity: 0.4;
				}
			}
		}

		&_step {
			position: absolute;
			left: clamp(0px, calc(var(--startsAt) - 0.6rem), calc(100% - 0.6rem));
			border-radius: calc(var(--border-radius) * 0.25);
			user-select: none;
			margin: 0;
			border: 0;
			height: 100%;
			display: flex;
			background: transparent;

			@media screen and (max-width: 576px) {
				clip: rect(0 0 0 0);
				border: 0;
				height: 1px;
				margin: -1px;
				overflow: hidden;
				padding: 0;
				position: absolute;
				width: 1px;
			}

			& input {
				margin: 0;
				border: 0;
				z-index: 1;

				width: 0.6rem;
				border-radius: 0;
				height: 100%;
				background-color: var(--card-background-color);
				opacity: 0.5;
				mix-blend-mode: soft-light;
				transition: opacity var(--transition);

				@media only screen and (prefers-color-scheme: light) {
					opacity: 0.2;
					mix-blend-mode: difference;
					background-color: var(--muted-color);
				}
			}

			@media only screen and (prefers-color-scheme: light) {
				&_active {
					z-index: 1;
					& input {
						opacity: 0.6;
						background-color: #fff;
					}
					&:hover input {
						opacity: 0.9;
					}
				}
			}
			&_active input {
				background-color: var(--primary-inverse);
				opacity: 0.5;
			}
		}

		input[type='range'] {
			/* allow custom styling in WebKit browsers */
			&,
			&::-webkit-slider-runnable-track,
			&::-webkit-slider-thumb {
				-webkit-appearance: none;
			}

			&::-webkit-slider-container {
				/* override read-only */
				-webkit-user-modify: read-write !important;
				@include track;
			}

			&::-moz-range-track {
				@include track;
			}

			&::-webkit-slider-thumb {
				@include thumb;
			}
			&::-moz-range-thumb {
				@include thumb;
			}

			&:focus {
				outline: none;
			}
		}

		:global([data-tooltip][data-placement='right']::before) {
			transform: translate(-0.5rem, -132.5%);
		}
		:global([data-tooltip][data-placement='right']::after) {
			transform: translate(-0.5rem, -132.5%) rotate(-90deg);
		}
		:global([data-tooltip][data-placement='left']::before) {
			transform: translate(0.5rem, -132.5%);
		}
		:global([data-tooltip][data-placement='left']::after) {
			transform: translate(0.5rem, -132.5%) rotate(90deg);
		}
		:global([data-tooltip][data-placement='right']:hover::before) {
			animation-name: tooltip-slide-right;
		}
		:global([data-tooltip][data-placement='right']:hover::after) {
			animation-name: tooltip-caret-slide-right;
		}
		:global([data-tooltip][data-placement='left']:hover::before) {
			animation-name: tooltip-slide-left;
		}
		:global([data-tooltip][data-placement='left']:hover::after) {
			animation-name: tooltip-caret-slide-left;
		}
		@keyframes tooltip-slide-left {
			from {
				transform: translate(0.5rem, -95%);
				opacity: 0;
			}
			to {
				transform: translate(0.5rem, -132.5%);
				opacity: 1;
			}
		}

		@keyframes tooltip-caret-slide-left {
			from {
				opacity: 0;
			}
			50% {
				transform: translate(0.5rem, -95%);
				opacity: 0;
			}
			to {
				transform: translate(0.5rem, -132.5%);
				opacity: 1;
			}
		}

		@keyframes tooltip-slide-right {
			from {
				transform: translate(-0.5rem, -95%);
				opacity: 0;
			}
			to {
				transform: translate(-0.5rem, -132.5%);
				opacity: 1;
			}
		}

		@keyframes tooltip-caret-slide-right {
			from {
				opacity: 0;
			}
			50% {
				transform: translate(-0.5rem, -95%);
				opacity: 0;
			}
			to {
				transform: translate(-0.5rem, -132.5%);
				opacity: 1;
			}
		}
	}
</style>
