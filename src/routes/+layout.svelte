<script lang="ts">
	import '@fontsource/share-tech-mono';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import '../app.scss';
	import PageTransition from './transition.svelte';
	import type { LayoutData } from './$types';
	import 'iconify-icon';
	import Player from '$lib/components/player/Player.svelte';
	import Kern from './Kern.svelte';

	export let data: LayoutData;

	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	const consoleTargetRegex = new RegExp('.*console.*');
	const outputTargetRegex = new RegExp('.*output.*');
	const commandTargetRegex = new RegExp('.*command.*');

	let kernSilmNurk = 0;
	let silmadPaigal = false;
	let kernSilmV = "'";
	let kernSilmP = "'";
	let kernSuu = '◡';

	/**
	 * @param {{ (e: MouseEvent): void; apply?: any; }} func
	 * @param {number} duration
	 */
	function throttle(func, duration) {
		let shouldWait = false;

		return function (/** @type {any[]} */ ...args) {
			if (!shouldWait) {
				// @ts-ignore
				func.apply(this, args);

				shouldWait = true;

				setTimeout(function () {
					shouldWait = false;
				}, duration);
			}
		};
	}

	const arvutaNurk = (
		/** @type {number} */ cx,
		/** @type {number} */ cy,
		/** @type {number} */ ex,
		/** @type {number} */ ey
	) => {
		const dy = ey - cy;
		const dx = ex - cx;
		const rad = Math.atan2(dy, dx); // (-Pie, Pie]
		const deg = (rad * 180) / Math.PI; // rads to degs, (-180, 180]
		return deg;
	};

	const muudaSuud = (/** @type {MouseEvent} */ e) => {
		if (getComputedStyle(e.target).cursor === 'pointer') {
			kernSuu = 'ₒ';
			kernSilmV = "'";
			kernSilmP = "'";
			silmadPaigal = false;
			// @ts-ignore
		} else if (e.target.localName == 'select' || e.target.localName == 'option') {
			kernSuu = '◡';
			kernSilmV = "˶'";
			kernSilmP = "'˶";
			silmadPaigal = true;
			kernSilmNurk = 0;
		} else {
			kernSuu = '◡';
			kernSilmV = "'";
			kernSilmP = "'";
			silmadPaigal = false;
		}
	};

	const liigutaSilmi = (/** @type {MouseEvent} */ e) => {
		if (silmadPaigal) return;
		const hiirX = e.clientX;
		const hiirY = e.clientY;

		// @ts-ignore
		const rect = document.querySelector('h1').getBoundingClientRect();
		const ankurX = rect.left + rect.width / 2;
		const ankury = rect.top + rect.height / 2;

		const nurk = arvutaNurk(hiirX, hiirY, ankurX, ankury) + 90;
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
</style>
