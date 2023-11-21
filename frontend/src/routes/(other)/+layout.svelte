<script lang="ts">
	import { Modals, closeModal } from 'svelte-modals';
	import PageTransition from '../transition.svelte';

	export let data;
</script>

<Modals>
	<div role="button" tabindex="0" slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<div class="container">
	<PageTransition url={data.url}>
		<slot />
	</PageTransition>
</div>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
	}
</style>
