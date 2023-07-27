<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	export let isPlaying = false;
	export let songIndex: number;
	export let lastSong: number;
  export let loading: boolean;
  export let ended: boolean;
	export let muted = false;
</script>

<button
	class="player_button player_button_rewind"
	on:click={() => dispatch('rewind')}
	disabled={songIndex === 0 || loading}
>
	<iconify-icon inline icon="pixelarticons:prev" />
</button>

<button class="player_button player_button_play" on:click={() => dispatch('playPause')}>
	<iconify-icon inline icon={ended ? 'pixelarticons:reload' : isPlaying ? 'pixelarticons:pause' : 'pixelarticons:play'} />
</button>

<button
	class="player_button player_button_forward"
	on:click={() => dispatch('forward')}
	disabled={songIndex === lastSong || loading}
>
	<iconify-icon inline icon="pixelarticons:next" />
</button>

<button
	class="player_button player_button_mute {muted ? 'unactive' : ''}"
	on:click={() => dispatch('mute')}
	disabled={loading}
>
	<iconify-icon inline icon={muted ? 'pixelarticons:volume-x' : 'pixelarticons:volume-2'} />
</button>

<style lang="scss">
	.player_button {
		place-self: center;
		padding: 0;
		margin: 0;

		--icon_size: 2.2rem;
		height: var(--icon_size);
		width: var(--icon_size);

		background-color: transparent;
		border: none;

		transition: color var(--transition);

		& iconify-icon {
			line-height: normal;
			font-size: var(--icon_size);
			height: var(--icon_size);
			width: var(--icon_size);
		}

		&:hover,
		&:focus-within {
			color: inherit;
		}
		&:active {
			color: var(--contrast);
		}
		&.unactive {
			color: var(--muted-color);
		}

		&_rewind {
			grid-area: 1/1/2/2;
			z-index: 1;
		}
		&_forward {
			grid-area: 1/5/2/6;
			z-index: 1;
		}
		&_mute {
			grid-area: mute;
			--icon_size: 1.5rem;

			@media screen and (max-width: 768px) {
				--icon_size: 1.7rem;
			}
		}
		&_play {
			grid-area: play;
			--icon_size: 1.9rem;

			@media screen and (max-width: 768px) {
				--icon_size: 2.1rem;
			}
		}
	}
</style>
