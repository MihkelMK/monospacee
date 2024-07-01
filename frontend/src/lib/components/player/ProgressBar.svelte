<script lang="ts">
	import type { Song } from '$lib/types';
	import { trimString } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let totalTrackTime: number;
	export let currentTime: number;
	export let songIndex: number;
	export let audioNotLoaded: boolean;
	export let isPlaying: boolean;
	export let songs: Song[];

	const dispatch = createEventDispatcher();
	const timeToPercent = (time: number, totalTime: number) =>
		Math.min((time * 100) / totalTime, 100);

	let scrubTime: number;
	let scrubbing = false;

	$: scrubTime = scrubbing ? scrubTime : currentTime;
	$: opacity = isPlaying ? '1' : '0.6';
	$: progress = scrubTime ? scrubTime * (100 / totalTrackTime) : 0;
</script>

<div class="player_progress">
	{#if songs && totalTrackTime}
		{#each songs as song, i}
			<label
				style="--startsAt:{timeToPercent(song.start, totalTrackTime)}%;"
				class="player_progress_step {i === songIndex ? 'player_progress_step_active' : ''}"
				data-placement={timeToPercent(song.start, totalTrackTime) < 35
					? 'right'
					: timeToPercent(song.start, totalTrackTime) > 65
						? 'left'
						: 'top'}
				data-tooltip={trimString(`${song.title} - ${song.artist}`, 40)}
			>
				<input
					disabled={audioNotLoaded}
					type="radio"
					aria-label="Skip to song: {song.title}"
					checked={i === songIndex}
					on:click={() => dispatch('seekToSong', i)}
				/>
			</label>
		{/each}
	{/if}
	<input
		aria-label="player progress"
		disabled={audioNotLoaded}
		type="range"
		max={`${totalTrackTime}`}
		min="0"
		bind:value={scrubTime}
		on:pointerdown={() => (scrubbing = true)}
		on:pointerup={() => {
			dispatch('scrub', scrubTime);
			scrubbing = false;
		}}
		on:touchstart={() => (scrubbing = true)}
		on:touchend={() => {
			dispatch('scrub', scrubTime);
			scrubbing = false;
		}}
	/>
	<span class="player_progress_bar" style="width: {progress}%; opacity:{opacity}" />
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
