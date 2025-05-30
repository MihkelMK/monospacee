<script lang="ts">
	import '@fontsource/share-tech-mono';
	import '@fontsource-variable/roboto-mono';
	import '../app.scss';

	import 'iconify-icon';
	import PageTransition from '$lib/components/PageTransition.svelte';

	import { angleToMouse, throttle } from '$lib/utils';

	import Kern from '$lib/components/Kern.svelte';
	import Player from '$lib/components/player/Player.svelte';
	import { getAudioStore, setAudioStore } from '$lib/store.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	setAudioStore();

	const audioStore = getAudioStore();
	let kernSilmNurk = $state(0);
	let kernSilmV = "'";
	let kernSilmP = "'";
	let kernSuu = $state('◡');
	let kern: HTMLElement | undefined = $state();

	let innerWidth: number | undefined = $state();
	let watcher: HTMLElement | undefined = $state();
	let scrolled = $state(false);

	const muudaSuud = (e: MouseEvent) => {
		if (!innerWidth || !e) return;
		if (getComputedStyle(e.target as Element).cursor === 'pointer') {
			kernSuu = 'ₒ';
		} else {
			kernSuu = '◡';
		}
	};

	const liigutaSilmi = (e: MouseEvent) => {
		if (!e || !innerWidth || !kern || audioStore.isPlaying) return;
		const hiirX = e.clientX;
		const hiirY = e.clientY;

		const rect = kern.getBoundingClientRect();
		if (!rect) return;

		const ankurX = rect.left + rect.width / 2;
		const ankury = rect.top + rect.height / 2;

		const nurk = angleToMouse(hiirX, hiirY, ankurX, ankury) + 90;
		kernSilmNurk = Math.round(nurk / 30) * 30;
	};

	let currentTrackLink = $derived(audioStore.selectedRecording?.split('/')[2]?.split('.')[0] || '');

	onMount(() => {
		if (browser) {
			const observer = new IntersectionObserver(
				(entries) => {
					scrolled = !entries?.at(0)?.isIntersecting;
				},
				{ threshold: 0.2, rootMargin: '5% 0px 0px 0px' }
			);

			if (watcher) {
				observer.observe(watcher);
			}
		}
	});
</script>

<svelte:window bind:innerWidth />

<div
	role="application"
	class="app"
	onmousemove={(event) => {
		liigutaSilmi(event);

		throttle(function (e: MouseEvent) {
			muudaSuud(e);
		}, 100)?.(event);
	}}>
	<div bind:this={watcher} data-scroll-watcher></div>

	<header class:scrolled>
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
						suu={kernSuu} />
				</li>
			</ul>
			<ul>
				<li>
					<a class="secondary glow" href={`/${currentTrackLink}`}>/mnt/current</a>
				</li>
			</ul>
		</nav>
	</header>
	<div class="container">
		<PageTransition url={data.url}>
			{@render children?.()}
		</PageTransition>
	</div>
	<Player />
</div>

<style lang="scss">
	.app {
		min-height: 100vh;
	}

	.container {
		margin-bottom: 10rem;

		@media only screen and (max-width: 768px) {
			margin-bottom: 15rem;
		}
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
		padding-block: var(--nav-element-spacing-vertical) calc(var(--block-spacing-vertical) * 2.5);
		margin-bottom: calc(var(--block-spacing-vertical) * -1.5);
		backdrop-filter: blur(2px);
		background-color: rgba(0, 0, 0, 0.2);
		background-size: 100% 100%;
		pointer-events: none;

		-webkit-mask: var(--mask);
		mask: var(--mask);

		z-index: 999;

		@media only screen and (prefers-color-scheme: light) {
			--mask: none;
			padding-block: 0;
			margin-bottom: calc(var(--block-spacing-vertical) * 2.5);
			backdrop-filter: none;
			background-color: var(--card-background-color);

			&.scrolled::after {
				opacity: 1;
				transition-duration: 0.2s;
			}

			&::after {
				position: absolute;
				opacity: 0;
				inset: 0;
				content: '';
				box-shadow: var(--card-box-shadow);
			}
		}

		nav li {
			font-size: 1.2em;
			font-family: var(--font-accent);
		}

		@media screen and (max-width: 768px) {
			padding-block: 0 calc(var(--block-spacing-vertical) * 3);
			margin-bottom: calc(var(--block-spacing-vertical) * -2);

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
					padding: 0 calc(var(--nav-element-spacing-horizontal) * 0.5);

					& li {
						padding: calc(var(--nav-element-spacing-vertical) * 0.5) 0;
					}
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
