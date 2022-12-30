<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import '@picocss/pico';
	import '../app.scss';

	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		padding: 1rem;
		width: 100%;
		box-sizing: border-box;
	}
</style>
