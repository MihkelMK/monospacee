<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	import { selectedRecording } from '../../../routes/store';

	let dispatch = createEventDispatcher();

	export let isPlaying = false;
	export let minimized: boolean;
	export let blogSlug: string | null;
  export let songIndex: number;
  export let lastSong: number;
</script>

{#if !minimized}
	<div class="player_controls" transition:fly={{ y: 50, duration: 200, opacity: 0 }}>
		{#if blogSlug && blogSlug !== $selectedRecording}
			<button
				transition:fly|local={{ y: 50, duration: 200, opacity: 0 }}
				data-tooltip="Mängi seda saadet"
				class="player_button player_button_replace"
				on:click={() => dispatch('replaceAudio')}
			>
				<iconify-icon inline icon="pixelarticons:forwardburger" />
			</button>
		{/if}
		<button
			class="player_button player_button_rewind"
			on:click={() => dispatch('rewind')}
			data-tooltip="Eelmine lugu"
			disabled={!isPlaying || songIndex===0}
		>
			<iconify-icon inline icon="pixelarticons:arrow-left" />
		</button>

		<button
			class="player_button player_button_play"
			on:click={() => dispatch('playPause')}
			data-tooltip={isPlaying ? 'Muusika pausile' : 'Muusika käima'}
		>
			<iconify-icon inline icon={isPlaying ? 'pixelarticons:pause' : 'pixelarticons:play'} />
		</button>

		<button
			class="player_button player_button_forward"
			on:click={() => dispatch('forward')}
			data-tooltip="Järgmine lugu"
			disabled={!isPlaying || songIndex===lastSong}
		>
			<iconify-icon inline icon="pixelarticons:arrow-right" />
		</button>

		{#if !(blogSlug === $selectedRecording)}
			<button
				transition:fly|local={{ y: 50, duration: 200, opacity: 0 }}
				data-tooltip="Mängiva saate postitus"
				class="player_button player_button_openblog"
				on:click={() => goto(`/blog/${$selectedRecording}`)}
			>
				<iconify-icon inline icon="pixelarticons:open" />
			</button>
		{/if}
	</div>
{/if}

<style lang="scss">
	.player_controls {
		grid-area: controls;
		display: flex;
		justify-content: space-around;
		text-align: center;
		align-self: center;

		.player_button {
			&_replace {
				font-size: 2.3em;
			}
			&_openblog {
				font-size: 1.8em;
			}

			@media screen and (max-width: 768px) {
				font-size: 3rem;
				&_replace {
					font-size: 3em;
				}
				&_openblog {
					font-size: 2.4em;
				}
			}
		}
	}
</style>
