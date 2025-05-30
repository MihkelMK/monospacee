<script lang="ts">
	import { getAudioStore } from '$lib/store.svelte';

	const { togglePlay, toggleMute, skip, loading } = $props<{
		togglePlay: () => void;
		toggleMute: () => void;
		skip: (seconds: number) => void;
		loading: boolean;
	}>();

	const audioStore = getAudioStore();
</script>

<button
	aria-label="Skip back 30 seconds"
	class="player_button player_button_rewind"
	onclick={() => skip(-30)}>
	<iconify-icon inline icon="pixelarticons:prev"></iconify-icon>
</button>

<button class="player_button player_button_play" aria-label="Play pause audio" onclick={togglePlay}>
	<iconify-icon inline icon={audioStore.isPlaying ? 'pixelarticons:pause' : 'pixelarticons:play'}>
	</iconify-icon>
</button>

<button
	class="player_button player_button_forward"
	onclick={() => skip(30)}
	aria-label="Skip forward 30 seconds">
	<iconify-icon inline icon="pixelarticons:next"></iconify-icon>
</button>

<button
	class="player_button player_button_mute {audioStore.isMuted ? 'unactive' : ''}"
	onclick={toggleMute}
	disabled={loading}
	aria-label="Mute audio">
	<iconify-icon
		inline
		icon={audioStore.isMuted ? 'pixelarticons:volume-x' : 'pixelarticons:volume-2'}>
	</iconify-icon>
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

		--color: var(--color);

		@media screen and (max-width: 768px) {
			--icon_size: 2.7rem;
		}

		& iconify-icon {
			line-height: normal;
			font-size: var(--icon_size);
			height: var(--icon_size);
			width: var(--icon_size);
		}

		&:hover,
		&:focus-within {
			--color: var(--contrast-hover);
		}
		&:active {
			--color: var(--contrast);
		}
		&.unactive {
			--color: var(--muted-color);
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
				--icon_size: 2.3rem;
			}
		}
		&_play {
			grid-area: play;
			--icon_size: 1.9rem;

			@media screen and (max-width: 768px) {
				--icon_size: 2.55rem;
			}
		}
	}
</style>
