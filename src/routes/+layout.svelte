<script lang="ts">
	import '@fontsource/share-tech-mono';
	import '../app.scss';
	import PageTransition from './transition.svelte';
	import 'iconify-icon';
	import Player from '$lib/components/player/Player.svelte';
	import { angleToMouse, throttle } from '$lib/utils';
	import Kern from './Kern.svelte';

	export let data;

	let kernSilmNurk = 0;
	let silmadPaigal = false;
	let kernSilmV = "'";
	let kernSilmP = "'";
	let kernSuu = '◡';

	const muudaSuud = (e: MouseEvent) => {
		if (!e) return;
		if (getComputedStyle(e.target as Element).cursor === 'pointer') {
			kernSuu = 'ₒ';
			kernSilmV = "'";
			kernSilmP = "'";
			silmadPaigal = false;
		} else {
			kernSuu = '◡';
			kernSilmV = "'";
			kernSilmP = "'";
			silmadPaigal = false;
		}
	};

	const liigutaSilmi = (e: MouseEvent) => {
		if (silmadPaigal || !e) return;
		const hiirX = e.clientX;
		const hiirY = e.clientY;

		const rect = document.querySelector('h1')?.getBoundingClientRect();
		if (!rect) return;

		const ankurX = rect.left + rect.width / 2;
		const ankury = rect.top + rect.height / 2;

		const nurk = angleToMouse(hiirX, hiirY, ankurX, ankury) + 90;
		kernSilmNurk = Math.round(nurk / 30) * 30;
	};
</script>

<div
	class="app"
	on:mousemove={liigutaSilmi}
	on:mousemove={throttle(function (e) {
		muudaSuud(e);
	}, 100)}
>
	<header>
		<nav>
			<ul>
				<li>
					<a class="secondary" href="/">~/</a>
				</li>
			</ul>
			<ul>
				<Kern silmaNurk={kernSilmNurk} vasakSilm={kernSilmV} paremSilm={kernSilmP} suu={kernSuu} />
			</ul>
			<ul>
				<li>
					<a class="secondary" href="/blog">~/blog</a>
				</li>
			</ul>
		</nav>
	</header>
	<PageTransition url={data.url}>
		<main>
			<slot />
		</main>
	</PageTransition>
	<Player />
</div>

<style lang="scss">
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

	header {
		margin-top: var(--block-spacing-vertical);
		& :global(h1) {
			margin-bottom: 0;
		}
	}

	nav {
		width: 75%;
		margin-inline: auto;
		a {
			padding: calc(var(--nav-link-spacing-vertical) * 0.5)
				calc(var(--nav-link-spacing-horizontal) * 1.5);
			border-radius: calc(var(--border-radius) * 2);
		}
	}

	@media (max-width: 576px) {
		nav {
			width: 90%;
		}
	}
</style>
