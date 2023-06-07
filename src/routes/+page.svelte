<script>
	import * as config from '$lib/config';
	import Console from './Console.svelte';
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content={config.description} />
	<meta property="og:description" content={config.description} />
	<meta property="og:url" content={config.url} />
	<meta property="og:site_name" content={config.site_name} />
</svelte:head>

<div class="wrapper">
	<section>
		<Console />
	</section>
</div>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	div.wrapper {
		display: flex;
		flex-direction: column;
		row-gap: clamp(1rem, 4vh, 3rem);
	}
</style>
