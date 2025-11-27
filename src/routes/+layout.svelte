<script lang="ts">
	import '@fontsource-variable/roboto-mono';
	import '@fontsource/share-tech-mono';
	import '../app.scss';

	import PageTransition from '$lib/components/PageTransition.svelte';
	import 'iconify-icon';

	import { angleToMouse, throttle } from '$lib/utils';

	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Kern from '$lib/components/Kern.svelte';
	import Player from '$lib/components/player/Player.svelte';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';
	import { getAudioStore, setAudioStore } from '$lib/store.svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	setAudioStore(data?.selected, data?.fallback);

	const audioStore = getAudioStore();
	let kernSilmNurk = $state(0);
	let kernSilmV = "'";
	let kernSilmP = "'";
	let kernSuu = $state('◡');
	let kern: HTMLElement | undefined = $state();

	let innerWidth: number | undefined = $state();
	let watcher: HTMLElement | undefined = $state();
	let scrolled = $state(false);

	let otherLocale: 'en' | 'et' = $derived(getLocale() === 'en' ? 'et' : 'en');
	const localeText = (locale: 'en' | 'et') => (locale === 'en' ? 'english' : 'estonian');

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

	afterNavigate(() => {
		// Clean up ?load parameter after it's been used
		if (browser && page.url.searchParams.has('load')) {
			goto(resolve('/[slug]', { slug: page.url.pathname.replace('/', '') }), {
				replaceState: true,
				invalidateAll: false,
				noScroll: true
			});
		}
	});

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

{#snippet langSwitchButton(style: string)}
	<button class="{style} glow outline languageSwitch" onclick={() => setLocale(otherLocale)}>
		{getLocale()}
	</button>
	<span class="sr-only">Change language to {localeText(otherLocale)}</span>
{/snippet}

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
				<li><a class="secondary glow" href={localizeHref('/')}>/home/page</a></li>
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
			<ul class="languageSwitchWrapperMobile">
				{@render langSwitchButton('secondary')}
			</ul>
			<ul>
				<li>
					<a class="secondary glow" href={localizeHref(`/${currentTrackLink}`)}>/mnt/current</a>
				</li>
			</ul>
		</nav>
	</header>
	<div class="container">
		<PageTransition url={data.url}>
			{@render children?.()}
		</PageTransition>
	</div>
	<footer>
		<Player />
	</footer>
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

	button.languageSwitch {
		border: none;
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

		nav {
			position: relative;
			& li {
				font-size: 1.2em;
				font-family: var(--font-accent);
			}
		}

		@media screen and (max-width: 768px) {
			padding-block: 0 calc(var(--block-spacing-vertical) * 3);
			margin-bottom: calc(var(--block-spacing-vertical) * -2);

			& nav {
				display: grid;
				grid-template-rows: auto auto;
				grid-template-columns: 1fr 1fr 1fr;
				place-items: center;

				ul:not(#kernList) li {
					padding: 0;
				}

				#kernList {
					grid-column: span 3;
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

	footer {
		position: fixed;
		bottom: 0;
		width: 100%;

		display: grid;
		grid-template-columns: 1fr auto 1fr;
		grid-template-areas: '. player .';

		@media screen and (max-width: 768px) {
			grid-template-columns: 1fr;
			grid-template-areas: 'player';
		}
	}

	@media screen and (min-width: 769px) {
		.languageSwitchWrapperMobile {
			position: absolute;
			bottom: -1rem;
			left: 50%;
			translate: calc(-50% - 0.7rem) 0;
		}
	}
</style>
