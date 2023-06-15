<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	let dispatch = createEventDispatcher();

	export let isPlaying = false;
	export let minimized: boolean;
</script>

{#if !minimized}
	<div class="player_controls" transition:fly={{ y: 50, duration: 200, opacity: 0 }}>
		<button class="player_button player_button_rewind" on:click={() => dispatch('rewind')}>
			<iconify-icon inline icon="pixelarticons:arrow-left" />
		</button>

		<button class="player_button player_button_play" on:click={() => dispatch('playPause')}>
			<iconify-icon inline icon={isPlaying ? 'pixelarticons:pause' : 'pixelarticons:play'} />
		</button>

		<button class="player_button player_button_forward" on:click={() => dispatch('forward')}>
			<iconify-icon inline icon="pixelarticons:arrow-right" />
		</button>
	</div>
{/if}

<style lang="scss">
	.player_controls {
		grid-area: controls;
		display: flex;
		justify-content: space-around;
	}
</style>
