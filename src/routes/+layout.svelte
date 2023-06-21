<script lang="ts">
	import '@fontsource/share-tech-mono';
	import '../app.scss';

	import 'iconify-icon';
	import PageTransition from './transition.svelte';

	import { angleToMouse, throttle } from '$lib/utils';

	import Kern from './Kern.svelte';
	import Player from '$lib/components/player/Player.svelte';

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
			<ul class="kern">
				<Kern silmaNurk={kernSilmNurk} vasakSilm={kernSilmV} paremSilm={kernSilmP} suu={kernSuu} />
			</ul>
			<ul>
				<li>
					<a class="secondary" href="/blog">~/blog</a>
				</li>
			</ul>
		</nav>
	</header>

	<div class="container">
		<PageTransition url={data.url}>
			<slot />
		</PageTransition>
	</div>

	<Player />
</div>

<style lang="scss">
	.app {
		min-height: 100vh;
		display: grid;
	}

	.container {
		margin-bottom: 4rem;

		@media screen and (max-width: 768px) {
			margin-bottom: 6.5rem;
		}

		@media screen and (max-width: 625px) {
			max-width: 85vw;
		}
	}

	header {
		width: min(36rem, 100%);
		margin: calc(var(--block-spacing-vertical) * 2) auto;
		height: fit-content;

		& :global(h1) {
			margin-bottom: 0;
		}

		@media screen and (max-width: 768px) {
			margin-block: var(--block-spacing-vertical);

			nav {
				display: grid;
				grid: auto auto / 1fr 1fr;
				place-items: center;

				.kern {
					grid-area: 1/1/2/3;
				}
			}
		}
	}

	nav {
		width: 75%;
		margin-inline: auto;
		li {
			min-width: 4.7em;
			text-align: center;
			a {
				margin-inline: auto;
				padding: calc(var(--nav-link-spacing-vertical) * 0.5)
					calc(var(--nav-link-spacing-horizontal) * 1.5);
				border-radius: calc(var(--border-radius) * 2);
			}
		}
	}
</style>
