<script lang="ts">
	import PageTransition from '../transition.svelte';

	export let data;
</script>

<div class="container">
	<PageTransition url={data.url}>
		<slot />
	</PageTransition>
</div>
