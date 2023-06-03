<script lang="ts">
	import '@fontsource/share-tech-mono';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import '@picocss/pico';
	import '../app.scss';
	import PageTransition from './transition.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<div class="app">
	<main>
		<PageTransition url={data.url}>
			<slot />
		</PageTransition>
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
