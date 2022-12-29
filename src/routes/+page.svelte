<script>
	import Console from './Console.svelte';

	/**
	 * @type {{ logo: String; }}
	 */
	export let data;
</script>

<svelte:head>
	<title>monospacee</title>
	<meta name="description" content="SoonTM to a terminal near you" />
</svelte:head>

<section>
	<h1 class="welcome">
		{data.logo}
	</h1>

	<Console />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		font-size: 4em;
		text-shadow: 0px 0px 0.2em var(--color-theme-2-glow);
		font-weight: bold;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048 / 1.75) 0;
	}
</style>
