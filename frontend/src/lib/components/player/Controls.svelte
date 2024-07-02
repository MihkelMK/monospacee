<script lang="ts">
	interface Props {
		isPlaying?: boolean;
		songIndex: number;
		lastSong: number;
		loading: boolean;
		muted?: boolean;
		mute: () => void;
		forward: () => void;
		rewind: () => void;
		playPause: () => void;
	}

	let {
		isPlaying = $bindable(),
		songIndex,
		lastSong,
		loading = $bindable(),
		muted = false,
		mute,
		forward,
		rewind,
		playPause
	}: Props = $props();
</script>

<button
	aria-label="Previous song"
	class="player_button player_button_rewind"
	onclick={rewind}
	disabled={songIndex === 0 || loading}
>
	<iconify-icon inline icon="pixelarticons:prev"></iconify-icon>
</button>

<button class="player_button player_button_play" aria-label="Play pause audio" onclick={playPause}>
	<iconify-icon inline icon={isPlaying ? 'pixelarticons:pause' : 'pixelarticons:play'}
	></iconify-icon>
</button>

<button
	class="player_button player_button_forward"
	onclick={forward}
	aria-label="Next song"
	disabled={songIndex === lastSong || loading}
>
	<iconify-icon inline icon="pixelarticons:next"></iconify-icon>
</button>

<button
	class="player_button player_button_mute {muted ? 'unactive' : ''}"
	onclick={mute}
	disabled={loading}
	aria-label="Mute audio"
>
	<iconify-icon inline icon={muted ? 'pixelarticons:volume-x' : 'pixelarticons:volume-2'}
	></iconify-icon>
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
