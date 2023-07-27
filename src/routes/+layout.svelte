<script lang="ts">
	import '@fontsource/share-tech-mono';
	import '@fontsource-variable/roboto-mono';
	import '../app.scss';

	import 'iconify-icon';
	import PageTransition from './transition.svelte';

	import { angleToMouse, throttle } from '$lib/utils';

	import Kern from './Kern.svelte';
	import Player from '$lib/components/player/Player.svelte';
	import { selectedRecording } from './store';

	export let data;

	let kernSilmNurk = 0;
	let silmadPaigal = false;
	let kernSilmV = "'";
	let kernSilmP = "'";
	let kernSuu = '◡';
	let kern: HTMLElement;

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

		const rect = kern.getBoundingClientRect();
		if (!rect) return;

		const ankurX = rect.left + rect.width / 2;
		const ankury = rect.top + rect.height / 2;

		const nurk = angleToMouse(hiirX, hiirY, ankurX, ankury) + 90;
		kernSilmNurk = Math.round(nurk / 30) * 30;
	};
</script>

<div
	role="application"
	class="app"
	on:mousemove={liigutaSilmi}
	on:mousemove={throttle(function (e) {
		muudaSuud(e);
	}, 100)}
>
	<header>
		<nav>
			<ul>
				<li><a class="secondary glow" href="/">/home/page</a></li>
			</ul>
			<ul id="kernList">
				<li bind:this={kern}>
					<Kern
						silmaNurk={kernSilmNurk}
						vasakSilm={kernSilmV}
						paremSilm={kernSilmP}
						suu={kernSuu}
					/>
				</li>
			</ul>
			<ul>
				<li><a class="secondary glow" href={`/${$selectedRecording}`}>/mnt/current</a></li>
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
	}

	header {
		--mask: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 1) 0,
				rgba(0, 0, 0, 1) 40%,
				rgba(0, 0, 0, 0) 95%,
				rgba(0, 0, 0, 0) 0
			)
			100% 50% / 100% 100% repeat-x;
		position: sticky;
		top: 0;
		padding-block: var(--nav-element-spacing-vertical) calc(var(--block-spacing-vertical) * 2);
		margin-bottom: calc(var(--block-spacing-vertical) * -1);
		backdrop-filter: blur(2px);
		background-color: transparentize($color: #000, $amount: 0.9);
		background-blend-mode: darken;
		background-size: 100% 100%;
		pointer-events: none;

		-webkit-mask: var(--mask);
		mask: var(--mask);

		z-index: 999;

		@media screen and (max-width: 768px) {
			padding-block: 0 calc(var(--block-spacing-vertical) * 5);
			margin-bottom: calc(var(--block-spacing-vertical) * -4);

			& nav {
				display: grid;
				grid-template-rows: auto auto;
				grid-template-columns: 1fr 1fr;
				place-items: center;

				ul:not(#kernList) li {
					padding: 0;
				}

				#kernList {
					grid-column: span 2;
					grid-row: 1;
					padding: calc(var(--nav-element-spacing-vertical) * 0.5)
						calc(var(--nav-element-spacing-horizontal) * 0.5);
					padding-bottom: 0;
				}
			}
		}

		& nav {
			pointer-events: auto;
			max-width: 50ch;
			margin-inline: auto;
		}
	}
</style>
