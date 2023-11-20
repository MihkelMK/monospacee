<script lang="ts">
	import PageTransition from '../transition.svelte';
	import Player from '$lib/components/player/Player.svelte';

	export let data;
</script>

<div class="container">
	<PageTransition url={data.url}>
		<slot />
	</PageTransition>
</div>
<Player />

<style lang="scss">
	.container {
		margin-bottom: 10rem;

		@media only screen and (max-width: 768px) {
			margin-bottom: 15rem;
		}
	}
</style>
