<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	let dispatch = createEventDispatcher();

	export let vol: number;
	export let minimized: boolean;
	export let muted = false;
</script>

{#if !minimized}
	<input
		transition:fly={{ x: -50, duration: 200, opacity: 0 }}
		type="range"
		min="0"
		max="100"
		step="1"
		name="volume"
		class="player_slider"
		on:input={() => dispatch('updateVolume')}
		bind:value={vol}
		disabled={muted}
	/>
{/if}

<button
	class="player_button player_button_mute"
	on:click={() => dispatch('mute')}
	data-tooltip="Vaigista"
>
	<iconify-icon
		inline
		icon={muted
			? 'pixelarticons:volume-x'
			: vol < 50
			? 'pixelarticons:volume-1'
			: 'pixelarticons:volume-2'}
	/>
</button>

<style lang="scss">
	$input-p: 0.5rem; // input padding
	$input-w: 4rem; // input width
	$input-h: 1.35rem; // input height

	$thumb-d: 0.8rem; // thumb diameter

	$track-h: $input-h - 2 * $input-p; // track height

	@mixin track() {
		/* allow thmb border-box range of motion 
	   outside input content-box 
	   if thumb radius > track radius */
		height: $track-h;
		border-radius: calc(var(--border-radius) * 0.25);
	}

	@mixin thumb() {
		border: none; // for cross-browser consistency
		width: $thumb-d;
		height: $thumb-d;
		box-shadow: -1px 0 2px var(--color-text-glow);
		background: var(--secondary);
		cursor: ns-resize;
	}

	button {
		grid-area: mute;
		place-self: center;
		font-size: 1.2rem;
		width: 1.2rem;
		margin-left: 0.1rem;

		@media screen and (max-width: 768px) {
			font-size: 2rem;
			width: 2rem;
			min-height: 2.1rem;
			place-self: start center;
		}
	}

	input[type='range'] {
		/* allow custom styling in WebKit browsers */
		&,
		&::-webkit-slider-runnable-track,
		&::-webkit-slider-thumb {
			-webkit-appearance: none;
		}

		grid-area: volume;
		place-self: center;
		padding: $input-p;
		width: $input-w;
		height: $input-h;
		margin-bottom: 0.5rem;
		rotate: -90deg;
		border-radius: calc(var(--border-radius) * 2);

		&::-webkit-slider-container {
			/* override read-only */
			-webkit-user-modify: read-write !important;
			@include track;
		}

		/* enlarge track so its content-box width coincides 
		 with content-box width of input once more */
		&::-moz-range-track {
			@include track;
		}

		&::-webkit-slider-thumb {
			transition: background var(--transition);
			@include thumb;
		}
		&::-moz-range-thumb {
			transition: background var(--transition);
			@include thumb;
		}

		&:focus {
			outline: none;
		}

		&:active {
			&::-moz-range-thumb,
			&::-webkit-slider-thumb {
				background: var(--secondary-hover);
			}
		}

		@media screen and (max-width: 768px) {
			display: none;
		}
	}
</style>
